import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Dayjs } from 'dayjs';

@Schema()
class Local {
  @Prop({ sparse: true, unique: true, index: true })
  refreshToken: string;

  @Prop({ type: Date })
  expiredAt: Date | Dayjs;

  @Prop({ sparse: true, unique: true, index: true })
  verifyCode?: string;

  @Prop({ type: Date })
  verifyCodeSendAt?: Date | Dayjs;
}

@Schema()
class Social {
  @Prop({ sparse: true, unique: true, index: true })
  id: string;
}

@Schema()
class OAuth {
  @Prop()
  local?: Local;

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
  profileImageUrl?: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop()
  oAuth: OAuth;
}

export type TUserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform({ _id, displayName, profileImageUrl, isAdmin }: TUserDocument) {
    return {
      _id: _id.toHexString(),
      displayName,
      profileImageUrl,
      isAdmin,
    };
  },
});
