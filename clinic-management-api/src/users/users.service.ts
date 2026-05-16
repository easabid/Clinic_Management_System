import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { DoctorProfile } from '../doctors/entities/doctor-profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(DoctorProfile)
    private doctorProfileRepository: Repository<DoctorProfile>,
  ) {}

  async findAll() {
    const users = await this.userRepository.find({
      select: ['id', 'email', 'fullName', 'role', 'phone', 'createdAt'],
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'fullName', 'role', 'phone', 'dateOfBirth', 'createdAt'],
    });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    const doctorProfile = await this.doctorProfileRepository.findOne({
      where: { doctor: { id: user.id } },
    });

    if (doctorProfile) {
      await this.appointmentRepository.delete({ doctor: { id: doctorProfile.id } });
      await this.doctorProfileRepository.delete({ id: doctorProfile.id });
    }

    await this.appointmentRepository.delete({ patient: { id: user.id } });
    await this.userRepository.delete(user.id);

    return { message: 'User deleted successfully' };
  }
}