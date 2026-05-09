import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PatientsController } from './patients.controller';
import { Appointment } from './entities/appointment.entity';
import { DoctorProfile } from '../doctors/entities/doctor-profile.entity';
import { User } from '../users/entities/user.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, DoctorProfile, User]),
    MailModule, 
  ],
  controllers: [AppointmentsController, PatientsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}