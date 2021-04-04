import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    description: '인증성공 oAuth 코드',
  })
  public code?: string;

  @ApiProperty({
    description: '인증실패 에러',
  })
  public error?: string;

  @ApiProperty({
    description: '인증실패 에러 내용',
  })
  public error_description?: string;
}
