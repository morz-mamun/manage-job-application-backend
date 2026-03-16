import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import { env, isDev } from "@config/env";
import { globalRateLimiter } from "@middleware/rateLimiter";
import { errorHandler, notFoundHandler } from "@middleware/errorHandler";
import { morganStream } from "@utils/logger";

// Routes
import authRoutes from "@modules/auth/auth.routes";
import jobsRoutes from "@modules/jobs/jobs.routes";
import cvRoutes from "@modules/cv/cv.routes";
import aiRoutes from "@modules/ai/ai.routes";
import { clerkMiddleware } from "@clerk/express";

const createApp = (): Application => {
  const app = express();

  // ─── Trust Proxy ─────────────────────────────────────────────────────────
  // Required for accurate IP detection behind reverse proxies (Nginx, Railway, Render, etc.)
  // Ensures rate limiter and logging capture the real client IP
  app.set("trust proxy", 1);

  // ─── CORS ────────────────────────────────────────────────────────────────
  // Must come before helmet so OPTIONS preflight requests are handled correctly
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowedOrigins = env.ALLOWED_ORIGINS.map((o) => o.trim());

        // Allow server-to-server requests (no origin) in development only
        if (!origin && isDev) return callback(null, true);

        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS policy: origin '${origin}' is not allowed`));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  // ─── Security Headers (Helmet) ───────────────────────────────────────────
  app.use(
    helmet({
      // Disable CSP in dev (avoids blocking local tools), enforce in production
      contentSecurityPolicy: isDev ? false : undefined,
      // Disable if your app serves cross-origin resources (images, iframes, etc.)
      crossOriginEmbedderPolicy: false,
    }),
  );

  // ─── Compression ─────────────────────────────────────────────────────────
  app.use(compression());

  // ─── Body Parsers ────────────────────────────────────────────────────────
  // General routes get a tight limit; file-heavy routes (e.g. /cv) override below
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: true, limit: "100kb" }));

  // ─── Request Logging ─────────────────────────────────────────────────────
  app.use(morgan(isDev ? "dev" : "combined", { stream: morganStream }));

  // ─── Rate Limiting ───────────────────────────────────────────────────────
  app.use(globalRateLimiter);

  // ─── Health Check ────────────────────────────────────────────────────────
  // Intentionally placed BEFORE clerkAuth so load balancers and uptime monitors
  // can reach this endpoint without needing an Authorization header
  app.get("/health", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is running",
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // ─── Authentication ───────────────────────────────────────────────────────
  app.use(clerkMiddleware());

  // ─── API Routes ──────────────────────────────────────────────────────────
  const apiPrefix = `/api/${env.API_VERSION}`;

  app.use(`${apiPrefix}/auth`, authRoutes);
  app.use(`${apiPrefix}/jobs`, jobsRoutes);

  // CV routes allow larger payloads for document uploads
  app.use(`${apiPrefix}/cv`, express.json({ limit: "10mb" }), cvRoutes);

  app.use(`${apiPrefix}/ai`, aiRoutes);

  // ─── Error Handling ──────────────────────────────────────────────────────
  // notFoundHandler must come after all routes to catch unmatched requests
  // errorHandler must be last and must declare all 4 parameters (err, req, res, next)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
