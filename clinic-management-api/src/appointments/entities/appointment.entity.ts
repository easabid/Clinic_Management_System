import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DoctorProfile } from '../../doctors/entities/doctor-profile.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // MANY appointments belong to ONE patient
  @ManyToOne(() => User, (user) => user.appointments, { eager: true })
  @JoinColumn()
  patient: User;

  // MANY appointments belong to ONE doctor profile
  @ManyToOne(() => DoctorProfile, (profile) => profile.appointments, {
    eager: true,
  })
  @JoinColumn()
  doctor: DoctorProfile;

  @Column({ type: 'date' })
  date: string;

  @Column()
  timeSlot: string; // e.g. "10:00 AM", "02:30 PM"

  @Column({
    type: 'simple-enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({ nullable: true })
  cancellationReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}