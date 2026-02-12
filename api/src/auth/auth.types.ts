import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthUser {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  emailVerified: boolean;
}

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field(() => AuthUser)
  user: AuthUser;
}

@ObjectType()
export class MessagePayload {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
