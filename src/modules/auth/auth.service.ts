import { User } from "@models/User";
import { logger } from "@utils/logger";

interface SyncUserDto {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export class AuthService {
  async syncUser(dto: SyncUserDto) {
    const { clerkId, email, firstName, lastName } = dto;

    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        $setOnInsert: {
          clerkId,
          email,
          firstName,
          lastName,
          cv: {
            title: "",
            summary: "",
            skills: [],
            experiences: [],
            education: [],
            projects: [],
            languages: [],
            certifications: [],
            updatedAt: new Date(),
          },
          preferences: {
            jobTypes: [],
            preferredLocations: [],
            expectedSalary: { currency: "USD" },
            remoteOnly: false,
          },
        },
      },
      { upsert: true, new: true },
    );

    logger.info(`User synced: ${clerkId}`);
    return user;
  }

  async getMe(clerkId: string) {
    return User.findOne({ clerkId }).select("-__v");
  }
}

export const authService = new AuthService();
