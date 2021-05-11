import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('v1/commons')
@Controller('v1/commons')
export class CommonsController {
  @Get('health')
  health() {
    return { status: 'running' };
  }
}
