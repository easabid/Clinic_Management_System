import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { DoctorProfile } from '../doctors/entities/doctor-profile.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(DoctorProfile)
    private doctorProfileRepository: Repository<DoctorProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailService,
  ) {}

  async create(createDto: CreateAppointmentDto, patientId: string) {
    const { doctorId, date, timeSlot } = createDto;

    const doctorProfile = await this.doctorProfileRepository.findOne({
      where: { id: doctorId },
      relations: ['doctor'],
    });
    if (!doctorProfile) throw new NotFoundException('Doctor not found');

    const patient = await this.userRepository.findOne({
      where: { id: patientId },
    });
    if (!patient) throw new NotFoundException('Patient not found');

    const conflict = await this.appointmentRepository.findOne({
      where: {
        doctor: { id: doctorId },
        date,
        timeSlot,
        status: AppointmentStatus.PENDING,
      },
    });

    if (conflict) {
      throw new BadRequestException(
        'This time slot is already booked. Please choose a different time.',
      );
    }

    const confirmedConflict = await this.appointmentRepository.findOne({
      where: {
        doctor: { id: doctorId },
        date,
        timeSlot,
        status: AppointmentStatus.CONFIRMED,
      },
    });

    if (confirmedConflict) {
      throw new BadRequestException(
        'This time slot is already confirmed. Please choose a different time.',
      );
    }

    const appointment = this.appointmentRepository.create({
      patient,
      doctor: doctorProfile,
      date,
      timeSlot,
    });

    const saved = await this.appointmentRepository.save(appointment);

    this.mailService.sendAppointmentConfirmation({
      patientEmail: patient.email,
      patientName: patient.fullName,
      doctorName: doctorProfile.doctor.fullName,
      specialization: doctorProfile.specialization,
      date,
      timeSlot,
      consultationFee: doctorProfile.consultationFee,
    });

    return saved;
  }

  async findMyAppointments(patientId: string) {
    return this.appointmentRepository.find({
      where: { patient: { id: patientId } },
      relations: ['doctor', 'doctor.doctor'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(
    id: string,
    updateDto: UpdateAppointmentStatusDto,
    currentUser: User,
  ) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor', 'doctor.doctor'],
    });

    if (!appointment) throw new NotFoundException('Appointment not found');

    if (currentUser.role === UserRole.DOCTOR) {
      const doctorProfile = await this.doctorProfileRepository.findOne({
        where: { doctor: { id: currentUser.id } },
      });
      if (!doctorProfile || appointment.doctor.id !== doctorProfile.id) {
        throw new ForbiddenException('You can only update your own appointments');
      }
    }

    const wasCancelled =
      updateDto.status === AppointmentStatus.CANCELLED &&
      appointment.status !== AppointmentStatus.CANCELLED;

    appointment.status = updateDto.status;
    if (updateDto.cancellationReason) {
      appointment.cancellationReason = updateDto.cancellationReason;
    }

    const updated = await this.appointmentRepository.save(appointment);

    if (wasCancelled) {
      this.mailService.sendAppointmentCancellation({
        patientEmail: appointment.patient.email,
        patientName: appointment.patient.fullName,
        doctorName: appointment.doctor.doctor.fullName,
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        reason: updateDto.cancellationReason,
      });
    }

    return updated;
  }

  async getPatientHistory(patientId: string) {
    const patient = await this.userRepository.findOne({
      where: { id: patientId },
    });
    if (!patient) throw new NotFoundException('Patient not found');

    return this.appointmentRepository.find({
      where: { patient: { id: patientId } },
      relations: ['doctor', 'doctor.doctor'],
      order: { date: 'DESC' },
    });
  }

  async cancelAppointment(id: string, currentUser: User) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor', 'doctor.doctor'],
    });

    if (!appointment) throw new NotFoundException('Appointment not found');

    if (
      currentUser.role === UserRole.PATIENT &&
      appointment.patient.id !== currentUser.id
    ) {
      throw new ForbiddenException('You can only cancel your own appointments');
    }

    if (
      appointment.status === AppointmentStatus.COMPLETED ||
      appointment.status === AppointmentStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot cancel an appointment with status: ${appointment.status}`,
      );
    }

    appointment.status = AppointmentStatus.CANCELLED;
    const updated = await this.appointmentRepository.save(appointment);

    this.mailService.sendAppointmentCancellation({
      patientEmail: appointment.patient.email,
      patientName: appointment.patient.fullName,
      doctorName: appointment.doctor.doctor.fullName,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
    });

    return updated;
  }

  async findAll() {
    return this.appointmentRepository.find({
      relations: ['patient', 'doctor', 'doctor.doctor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findDoctorAppointments(doctorUserId: string) {
    const doctorProfile = await this.doctorProfileRepository.findOne({
      where: { doctor: { id: doctorUserId } },
    });

    if (!doctorProfile) {
      throw new NotFoundException('Doctor profile not found');
    }

    return this.appointmentRepository.find({
      where: { doctor: { id: doctorProfile.id } },
      relations: ['patient', 'doctor', 'doctor.doctor'],
      order: { date: 'DESC' },
    });
  }
}