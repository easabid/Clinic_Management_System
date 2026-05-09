import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'uuid-of-doctor-profile' })
  @IsUUID()
  doctorId: string;

  @ApiProperty({ example: '2025-08-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '10:00 AM' })
  @IsString()
  @IsNotEmpty()
  timeSlot: string;
}