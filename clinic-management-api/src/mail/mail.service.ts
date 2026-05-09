import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  // Called when a patient books an appointment
  async sendAppointmentConfirmation(data: {
    patientEmail: string;
    patientName: string;
    doctorName: string;
    specialization: string;
    date: string;
    timeSlot: string;
    consultationFee: number;
  }) {
    try {
      await this.mailerService.sendMail({
        to: data.patientEmail,
        subject: `Appointment Confirmed – Dr. ${data.doctorName}`,
        template: 'appointment-confirmed', // maps to appointment-confirmed.hbs
        context: data, // all fields in data become {{variables}} in template
      });
      this.logger.log(`Confirmation email sent to ${data.patientEmail}`);
    } catch (error) {
      // Log but don't throw — a mail failure shouldn't break the booking
      this.logger.error(`Failed to send confirmation email: ${error.message}`);
    }
  }

  // Called when an appointment is cancelled
  async sendAppointmentCancellation(data: {
    patientEmail: string;
    patientName: string;
    doctorName: string;
    date: string;
    timeSlot: string;
    reason?: string;
  }) {
    try {
      await this.mailerService.sendMail({
        to: data.patientEmail,
        subject: `Appointment Cancelled – ${data.date}`,
        template: 'appointment-cancelled',
        context: data,
      });
      this.logger.log(`Cancellation email sent to ${data.patientEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send cancellation email: ${error.message}`);
    }
  }
}