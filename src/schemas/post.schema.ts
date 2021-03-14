import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { User } from '@app/schemas/user.schema';

@Schema()
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  isShow: boolean;

  @Prop({ required: true })
  category: TCategories;

  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop({ required: true })
  thumbnail: string;

  @Prop()
  tags: string[];
}

export type TCategories = 'javascript' | 'react' | 'node' | 'etc';
export type TPostDocument = Post & mongoose.Document;
export const PostSchema = SchemaFactory.createForClass(Post);
