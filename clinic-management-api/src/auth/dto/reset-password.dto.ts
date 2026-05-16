import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'a1b2c3d4e5f6' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'NewStrongPass123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}