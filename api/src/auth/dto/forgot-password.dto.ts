import { IsEmail } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ForgotPasswordInput {
  @Field()
  @IsEmail()
  email: string;
}
