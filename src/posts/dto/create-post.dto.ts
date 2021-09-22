import { OmitType } from '@nestjs/swagger';

import { Post } from '~app/schemas/post.schema';

export class CreatePostDto extends OmitType(Post, ['userId'] as const) {}
