import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorProfile } from './entities/doctor-profile.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(DoctorProfile)
    private doctorProfileRepository: Repository<DoctorProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateDoctorProfileDto) {
    const { userId, ...profileData } = createDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.role !== UserRole.DOCTOR) {
      throw new BadRequestException('User must have the doctor role');
    }

    const existingProfile = await this.doctorProfileRepository.findOne({
      where: { doctor: { id: userId } },
    });
    if (existingProfile) {
      throw new BadRequestException('Doctor profile already exists for this user');
    }

    const profile = this.doctorProfileRepository.create({
      ...profileData,
      doctor: user,
    });

    return this.doctorProfileRepository.save(profile);
  }

  async findAll() {
    return this.doctorProfileRepository.find({
      relations: ['doctor'],
      select: {
        id: true,
        specialization: true,
        qualification: true,
        consultationFee: true,
        availableDays: true,
        doctor: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
        },
      },
    });
  }

  async findOne(id: string) {
    const profile = await this.doctorProfileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.doctor', 'doctor')
      .leftJoin('profile.appointments', 'appointments')
      .addSelect('COUNT(appointments.id)', 'appointmentCount')
      .where('profile.id = :id', { id })
      .groupBy('profile.id')
      .addGroupBy('doctor.id')
      .getRawAndEntities();

    if (!profile.entities[0]) {
      throw new NotFoundException('Doctor profile not found');
    }

    return {
      ...profile.entities[0],
      appointmentCount: parseInt(profile.raw[0]?.appointmentCount || '0'),
    };
  }

  async update(id: string, updateDto: UpdateDoctorProfileDto) {
    const profile = await this.doctorProfileRepository.findOne({
      where: { id },
    });
    if (!profile) throw new NotFoundException('Doctor profile not found');

    Object.assign(profile, updateDto);
    return this.doctorProfileRepository.save(profile);
  }

  async remove(id: string) {
    const profile = await this.doctorProfileRepository.findOne({
      where: { id },
    });
    if (!profile) throw new NotFoundException('Doctor profile not found');

    await this.doctorProfileRepository.remove(profile);
    return { message: 'Doctor profile deleted successfully' };
  }
}