import { User, IUser } from "@models/User";
import { NotFoundError } from "@utils/AppError";
import { UpdateCVDto } from "@validators/cv.validator";

export class CVService {
  async getCV(userId: string): Promise<IUser["cv"]> {
    const user = await User.findOne({ clerkId: userId }).select("cv");
    if (!user) throw new NotFoundError("User profile");
    return user.cv;
  }

  async updateCV(userId: string, dto: UpdateCVDto): Promise<IUser["cv"]> {
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new NotFoundError("User profile");

    // Deep merge CV fields
    if (dto.title !== undefined) user.cv.title = dto.title;
    if (dto.summary !== undefined) user.cv.summary = dto.summary;
    if (dto.skills !== undefined) user.cv.skills = dto.skills;
    if (dto.experiences !== undefined)
      user.cv.experiences = dto.experiences as any;
    if (dto.education !== undefined) user.cv.education = dto.education as any;
    if (dto.projects !== undefined) user.cv.projects = dto.projects as any;
    if (dto.languages !== undefined) user.cv.languages = dto.languages;
    if (dto.certifications !== undefined)
      user.cv.certifications = dto.certifications;

    user.cv.updatedAt = new Date();
    await user.save();

    return user.cv;
  }
}

export const cvService = new CVService();
