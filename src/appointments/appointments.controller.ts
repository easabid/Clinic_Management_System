import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';

@ApiTags('Appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.PATIENT)
  @ApiOperation({ summary: 'Book a new appointment (Patient only)' })
  @ApiResponse({ status: 201, description: 'Appointment booked + email sent' })
  @ApiResponse({ status: 400, description: 'Time slot already booked' })
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @CurrentUser() user: User,
  ) {
    return this.appointmentsService.create(createAppointmentDto, user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all appointments (Admin only)' })
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get('mine')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PATIENT)
  @ApiOperation({ summary: 'Get my appointments (Patient only)' })
  findMyAppointments(@CurrentUser() user: User) {
    return this.appointmentsService.findMyAppointments(user.id);
  }

  @Get('doctor/mine')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get my appointments (Doctor only)' })
  findDoctorAppointments(@CurrentUser() user: User) {
    return this.appointmentsService.findDoctorAppointments(user.id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update appointment status (Doctor or Admin)' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateAppointmentStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.appointmentsService.updateStatus(id, updateDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel appointment (Patient cancels own, Admin cancels any)' })
  cancelAppointment(@Param('id') id: string, @CurrentUser() user: User) {
    return this.appointmentsService.cancelAppointment(id, user);
  }
}