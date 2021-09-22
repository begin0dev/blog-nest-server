import { Dayjs } from 'dayjs';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDate, IsString, Length, ValidateNested } from 'class-validator';
import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';

class Local {
  @IsString()
  @Optional()
  @Prop({ sparse: true, unique: true, index: true })
  refreshToken?: string;

  @IsDate()
  @Optional()
  @Prop({ type: Date })
  expiredAt?: Date | Dayjs;

  @IsString()
  @Optional()
  @Prop({ sparse: true, unique: true, index: true })
  verifyCode?: string;

  @IsDate()
  @Optional()
  @Prop({ type: Date })
  verifyCodeSendAt?: Date | Dayjs;
}

class Social {
  @IsString()
  @Prop({ sparse: true, unique: true, index: true })
  id: string;
}

class OAuth {
  @ValidateNested()
  @Type(() => Local)
  @Optional()
  @Prop()
  local?: Local;

  @ValidateNested()
  @Type(() => Social)
  @Optional()
  @Prop()
  facebook?: Social;

  @ValidateNested()
  @Type(() => Social)
  @Optional()
  @Prop()
  kakao?: Social;

  @ValidateNested()
  @Type(() => Social)
  @Optional()
  @Prop()
  google?: Social;

  @ValidateNested()
  @Type(() => Social)
  @Optional()
  @Prop()
  github?: Social;
}

@Schema({ timestamps: true })
export class User {
  @IsString()
  @Length(3, 20)
  @Prop({ required: true })
  displayName: string;

  @IsString()
  @Optional()
  @Prop()
  profileImageUrl?: string;

  @IsBoolean()
  @Optional()
  @Prop({ default: false })
  isAdmin: boolean;

  @ValidateNested()
  @Type(() => OAuth)
  @Prop()
  oAuth: OAuth;
}

export type TUserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
