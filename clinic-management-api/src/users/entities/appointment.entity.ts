import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { DoctorProfile } from './doctor-profile.entity';

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

  @ManyToOne(() => User, (user) => user.appointments, { eager: true })
  @JoinColumn()
  patient: User;

  @ManyToOne(() => DoctorProfile, (profile) => profile.appointments, {
    eager: true,
  })
  @JoinColumn()
  doctor: DoctorProfile;

  @Column({ type: 'date' })
  date: string;

  @Column()
  timeSlot: string; 

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