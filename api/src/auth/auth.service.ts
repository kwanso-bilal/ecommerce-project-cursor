import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomBytes } from "crypto";
import * as bcrypt from "bcrypt";
import { SignUpInput } from "./dto/sign-up.dto";
import { LoginInput } from "./dto/login.dto";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  emailVerified: boolean;
}

const users = new Map<string, User>();
const resetTokens = new Map<string, { email: string; expires: number }>();
const verificationTokens = new Map<
  string,
  { email: string; expires: number }
>();

const SALT_ROUNDS = 10;
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signUp(input: SignUpInput) {
    const normalizedEmail = input.email.toLowerCase();
    if (users.has(normalizedEmail)) {
      throw new BadRequestException("User with this email already exists");
    }
    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const user: User = {
      id,
      email: normalizedEmail,
      name: input.name,
      passwordHash,
      emailVerified: false,
    };
    users.set(normalizedEmail, user);

    const verifyToken = this.generateToken();
    verificationTokens.set(verifyToken, {
      email: normalizedEmail,
      expires: Date.now() + TOKEN_TTL_MS,
    });
    this.sendVerificationEmail(normalizedEmail, verifyToken);

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      },
    };
  }

  async login(input: LoginInput) {
    const normalizedEmail = input.email.toLowerCase();
    const user = users.get(normalizedEmail);
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw new UnauthorizedException("Invalid email or password");
    }
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      },
    };
  }

  async forgotPassword(email: string) {
    const normalizedEmail = email.toLowerCase();
    if (!users.has(normalizedEmail)) {
      return {
        success: true,
        message: "If an account exists, you will receive an email.",
      };
    }
    const token = this.generateToken();
    resetTokens.set(token, {
      email: normalizedEmail,
      expires: Date.now() + TOKEN_TTL_MS,
    });
    this.sendPasswordResetEmail(normalizedEmail, token);
    return {
      success: true,
      message: "If an account exists, you will receive an email.",
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const record = resetTokens.get(token);
    if (!record || record.expires < Date.now()) {
      throw new BadRequestException("Invalid or expired reset token");
    }
    const user = users.get(record.email);
    if (!user) throw new BadRequestException("Invalid or expired reset token");
    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    users.set(record.email, user);
    resetTokens.delete(token);
    return { success: true, message: "Password has been reset." };
  }

  async verifyEmail(token: string) {
    const record = verificationTokens.get(token);
    if (!record || record.expires < Date.now()) {
      throw new BadRequestException("Invalid or expired verification token");
    }
    const user = users.get(record.email);
    if (!user)
      throw new BadRequestException("Invalid or expired verification token");
    user.emailVerified = true;
    users.set(record.email, user);
    verificationTokens.delete(token);
    return { success: true, message: "Email verified successfully." };
  }

  private generateToken(): string {
    return randomBytes(32).toString("hex");
  }

  private sendVerificationEmail(_email: string, token: string) {
    // In production: send real email with link containing token
    console.log(`[Auth] Verification link (dev): ?token=${token}`);
  }

  private sendPasswordResetEmail(_email: string, token: string) {
    // In production: send real email with reset link containing token
    console.log(`[Auth] Reset link (dev): ?token=${token}`);
  }
}
