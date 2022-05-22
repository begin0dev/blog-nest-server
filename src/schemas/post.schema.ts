import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { User } from '~app/schemas/user.schema';
import { IsBoolean, IsString, Length } from 'class-validator';

@Schema()
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  @IsBoolean()
  isShow: boolean;

  @Prop({ required: true })
  category: TCategories;

  @Prop({ required: true })
  @IsString()
  @Length(3, 30)
  title: string;

  @Prop()
  @IsString()
  content: string;

  @Prop({ required: true })
  @IsString()
  thumbnail: string;

  @Prop()
  @IsString({ each: true })
  tags: string[];
}

export type TCategories = 'javascript' | 'react' | 'node' | 'etc';
export type TPostDocument = Post & mongoose.Document;
export const PostSchema = SchemaFactory.createForClass(Post);
