import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { User } from '~app/schemas/user.schema';
import { IsBoolean, IsString, Length } from 'class-validator';

@Schema()
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @IsBoolean()
  @Prop({ required: true })
  isShow: boolean;

  @Prop({ required: true })
  category: TCategories;

  @IsString()
  @Length(3, 30)
  @Prop({ required: true })
  title: string;

  @IsString()
  @Prop()
  content: string;

  @IsString()
  @Prop({ required: true })
  thumbnail: string;

  @IsString({ each: true })
  @Prop()
  tags: string[];
}

export type TCategories = 'javascript' | 'react' | 'node' | 'etc';
export type TPostDocument = Post & mongoose.Document;
export const PostSchema = SchemaFactory.createForClass(Post);
