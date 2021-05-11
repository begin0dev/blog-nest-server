import { Module } from '@nestjs/common';

import { CommonsController } from '~app/commons/commons.controller';

@Module({
  controllers: [CommonsController],
})
export class CommonsModule {}
