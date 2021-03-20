import { Module } from '@nestjs/common';

import { UsersController } from '@app/users/users.controller';

@Module({
  controllers: [UsersController],
})
export class UsersModule {}
