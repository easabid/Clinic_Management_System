import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Appointment } from './appointment.entity';
import { DoctorProfile } from './doctor-profile.entity';

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
}

@Entity('users') 
export class User {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @Column({ unique: true }) 
  email: string;

  @Column()
  password: string; 

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  role: UserRole;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordTokenHash: string | null;

  @Column({ type: 'datetime', nullable: true })
  resetPasswordTokenExpires: Date | null;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @OneToOne(() => DoctorProfile, (profile) => profile.doctor)
  doctorProfile: DoctorProfile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}