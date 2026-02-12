import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { SignUpInput } from "./dto/sign-up.dto";
import { LoginInput } from "./dto/login.dto";
import { ForgotPasswordInput } from "./dto/forgot-password.dto";
import { ResetPasswordInput } from "./dto/reset-password.dto";
import { VerifyEmailInput } from "./dto/verify-email.dto";
import { AuthPayload, MessagePayload } from "./auth.types";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async signUp(@Args("input") input: SignUpInput) {
    return this.authService.signUp(input);
  }

  @Mutation(() => AuthPayload)
  async login(@Args("input") input: LoginInput) {
    return this.authService.login(input);
  }

  @Mutation(() => MessagePayload)
  async forgotPassword(@Args("input") input: ForgotPasswordInput) {
    return this.authService.forgotPassword(input.email);
  }

  @Mutation(() => MessagePayload)
  async resetPassword(@Args("input") input: ResetPasswordInput) {
    return this.authService.resetPassword(input.token, input.newPassword);
  }

  @Mutation(() => MessagePayload)
  async verifyEmail(@Args("input") input: VerifyEmailInput) {
    return this.authService.verifyEmail(input.token);
  }
}
