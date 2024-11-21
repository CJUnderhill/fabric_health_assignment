import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from '../schemas/appointment.schema';
import { QueueService } from '../queue/queue.service';
import { AppointmentDto } from './dto/appointment.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    private readonly queueService: QueueService,
  ) { }

  async findAll(filters: any): Promise<AppointmentDto[]> {
    const query: any = {};
    if (filters.patient_id) query.patient_id = filters.patient_id;
    if (filters.doctor) query.doctor = filters.doctor;

    const appointments = await this.appointmentModel.find(query).lean();
    return plainToInstance(AppointmentDto, appointments);
  }

  async findOne(id: number): Promise<AppointmentDto | null> {
    const appointment = await this.appointmentModel.findOne({ id }).lean();
    if (!appointment) return null;
    return plainToInstance(AppointmentDto, appointment);
  }

  async processFile(filepath: string): Promise<string> {
    await this.queueService.publish(process.env.RABBITMQ_QUEUE, { filepath });
    return 'File submitted for processing';
  }
}
