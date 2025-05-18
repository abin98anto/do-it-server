import { IUser } from "../../core/entities/IUser";
import { JwtData } from "../../core/entities/misc/JwtData";

declare global {
  namespace Express {
    interface Request {
      user: Partial<IUser>;
    }
  }
}

export {};
