import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { PostsService } from './posts.service';
import { Post, PostSchema, TPostDocument } from '~app/schemas/post.schema';

describe('PostsService', () => {
  let module: TestingModule;
  let postsService: PostsService;
  let mongoServer: MongoMemoryServer;
  let postModel: Model<TPostDocument>;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoURI = mongoServer.getUri();

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoURI),
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
      ],
      providers: [PostsService],
    }).compile();

    postsService = module.get(PostsService);
    postModel = module.get<Model<TPostDocument>>(getModelToken(Post.name));
  });

  afterEach(async () => {
    await module.close();
    await mongoServer.stop();
  });

  it('should be defined', () => {
    expect(postsService).toBeDefined();
  });
});
