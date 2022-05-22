import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';

import { PostsService } from './posts.service';
import { Post, PostSchema, TPostDocument } from '~app/schemas/post.schema';

describe('PostsService', () => {
  let module: TestingModule;
  let postsService: PostsService;
  let postModel: Model<TPostDocument>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(global.mongoURI),
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
      ],
      providers: [PostsService],
    }).compile();

    postsService = module.get(PostsService);
    postModel = module.get<Model<TPostDocument>>(getModelToken(Post.name));
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(postsService).toBeDefined();
  });
});
