import { Socket } from "net";
import { env } from "@config/env";
import { logger } from "@utils/logger";
import createApp from "./app";
import { connectDB, disconnectDB } from "@config/db";

const bootstrap = async (): Promise<void> => {
  await connectDB();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(
      `🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`,
    );
    logger.info(`📍 API: http://localhost:${env.PORT}/api/${env.API_VERSION}`);
    logger.info(`❤️  Health: http://localhost:${env.PORT}/health`);
  });

  // ─── Listen Error Handling ─────────────────────────────────────────────
  // Catches port-in-use and other server-level bind errors that would
  // otherwise surface as unhandledRejection with no useful context
  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      logger.error(`Port ${env.PORT} is already in use`);
    } else {
      logger.error("Server failed to start", {
        error: err.message,
        code: err.code,
      });
    }
    process.exit(1);
  });

  // ─── Track Open Connections ────────────────────────────────────────────
  // Keep-alive connections can block server.close() indefinitely.
  // We track them so we can forcefully destroy them during shutdown.
  const connections = new Set<Socket>();

  server.on("connection", (socket: Socket) => {
    connections.add(socket);
    socket.on("close", () => connections.delete(socket));
  });

  // ─── Graceful Shutdown ─────────────────────────────────────────────────
  let isShuttingDown = false;

  const shutdown = async (signal: string): Promise<void> => {
    // Guard against double invocation (e.g. SIGTERM + SIGINT at the same time)
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.info(`${signal} received. Starting graceful shutdown...`);

    // Force-kill safety net — unref'd so it doesn't hold the event loop open
    // if everything shuts down cleanly before the timeout fires
    const forceExit = setTimeout(() => {
      logger.error("Forced shutdown after timeout — terminating process");
      process.exit(1);
    }, 10_000);
    forceExit.unref();

    // Destroy all tracked open (keep-alive) sockets so server.close()
    // resolves promptly rather than waiting for idle clients
    connections.forEach((socket) => socket.destroy());

    server.close(async () => {
      try {
        logger.info("HTTP server closed");
        await disconnectDB();
        logger.info("Database disconnected");
        logger.info("Graceful shutdown complete");
        process.exit(0);
      } catch (err) {
        logger.error("Error during shutdown cleanup", { err });
        process.exit(1);
      }
    });
  };

  // ─── OS Signals ───────────────────────────────────────────────────────
  // SIGTERM: sent by Docker, Kubernetes, PM2, Heroku on container/process stop
  // SIGINT:  sent by Ctrl+C during local development
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));

  // ─── Unhandled Errors ─────────────────────────────────────────────────
  // App is in an unknown/corrupt state at this point — do NOT attempt async
  // cleanup. Log the error and exit immediately so the process manager
  // (PM2, Docker, Kubernetes) can restart the process cleanly.
  process.on("uncaughtException", (err: Error) => {
    logger.error("Uncaught exception — forcing exit", {
      error: err.message,
      stack: err.stack,
    });
    process.exit(1);
  });

  process.on("unhandledRejection", (reason: unknown) => {
    logger.error("Unhandled rejection — forcing exit", { reason });
    process.exit(1);
  });
};

// ─── Bootstrap ──────────────────────────────────────────────────────────────
// Use .catch() instead of void so startup failures (DB connection, bad config)
// are logged clearly rather than silently swallowed
bootstrap().catch((error: unknown) => {
  logger.error("Failed to start server", {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });
  process.exit(1);
});
