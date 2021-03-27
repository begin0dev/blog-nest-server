import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class Local {
  @Prop({ sparse: true, unique: true, index: true })
  refreshToken: string;

  @Prop({ type: Date })
  expiredAt: string;
}

@Schema()
class Social {
  @Prop({ sparse: true, unique: true, index: true })
  id: string;
}

@Schema()
class OAuth {
  @Prop()
  local: Local;

  @Prop()
  facebook?: Social;

  @Prop()
  kakao?: Social;

  @Prop()
  google?: Social;

  @Prop()
  github?: Social;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  displayName: string;

  @Prop()
  profileImageURL?: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop()
  oAuth: OAuth;
}

export type TUserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform({ _id, displayName, profileImageURL, isAdmin }: TUserDocument) {
    return {
      _id,
      displayName,
      profileImageURL,
      isAdmin,
    };
  },
});
