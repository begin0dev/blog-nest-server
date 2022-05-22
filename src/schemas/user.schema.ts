import { Dayjs } from 'dayjs';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDate, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Local {
  @Prop({ sparse: true, unique: true, index: true })
  @IsString()
  @IsOptional()
  refreshToken?: string;

  @Prop({ type: Date })
  @IsDate()
  @IsOptional()
  expiredAt?: Date | Dayjs;

  @Prop({ sparse: true, unique: true, index: true })
  @IsString()
  @IsOptional()
  verifyCode?: string;

  @Prop({ type: Date })
  @IsDate()
  @IsOptional()
  verifyCodeSendAt?: Date | Dayjs;
}

class Social {
  @Prop({ sparse: true, unique: true, index: true })
  @IsString()
  id: string;
}

class OAuth {
  @Prop()
  @Type(() => Local)
  @ValidateNested()
  @IsOptional()
  local?: Local;

  @Prop()
  @Type(() => Social)
  @ValidateNested()
  @IsOptional()
  facebook?: Social;

  @Prop()
  @Type(() => Social)
  @ValidateNested()
  @IsOptional()
  kakao?: Social;

  @Prop()
  @Type(() => Social)
  @ValidateNested()
  @IsOptional()
  google?: Social;

  @Prop()
  @Type(() => Social)
  @ValidateNested()
  @IsOptional()
  github?: Social;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  @IsString()
  @Length(3, 20)
  displayName: string;

  @Prop()
  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @Prop({ default: false })
  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;

  @Prop()
  @Type(() => OAuth)
  @ValidateNested()
  oAuth: OAuth;
}

export type TUserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
