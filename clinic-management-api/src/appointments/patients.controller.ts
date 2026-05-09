import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.DOCTOR)
@Controller('patients')
export class PatientsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get(':id/history')
  @ApiOperation({ summary: 'Get patient appointment history (Doctor or Admin)' })
  getPatientHistory(@Param('id') id: string) {
    return this.appointmentsService.getPatientHistory(id);
  }
}