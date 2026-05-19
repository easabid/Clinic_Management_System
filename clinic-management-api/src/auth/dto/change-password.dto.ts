import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'CurrentPass123' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'NewPass123' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}