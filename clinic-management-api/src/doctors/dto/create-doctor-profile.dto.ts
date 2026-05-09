import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorProfileDto {
  @ApiProperty({ example: 'uuid-of-doctor-user' })
  @IsUUID()
  userId: string; 

  @ApiProperty({ example: 'Cardiology' })
  @IsString()
  @IsNotEmpty()
  specialization: string;

  @ApiProperty({ example: 'MBBS, MD' })
  @IsString()
  @IsNotEmpty()
  qualification: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0)
  consultationFee: number;

  @ApiProperty({ example: ['Monday', 'Wednesday', 'Friday'] })
  @IsArray()
  @IsString({ each: true }) 
  availableDays: string[];
}