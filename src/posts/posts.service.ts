import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, TPostDocument } from '~app/schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<TPostDocument>) {}

  findAll() {
    return `This action returns all posts`;
  }

  findById(_id: string) {
    return this.postModel.findOne({ _id });
  }

  create(createPostDto: CreatePostDto) {
    return this.postModel.create(createPostDto);
  }

  update(_id: string, updatePostDto: UpdatePostDto) {
    return this.postModel.updateOne({ _id }, { $set: updatePostDto });
  }

  remove(_id: string) {
    return this.postModel.deleteOne({ _id });
  }
}
