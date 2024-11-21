// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsController } from './appointments/appointments.controller';
import { AppointmentsService } from './appointments/appointments.service';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';
import { PatientsController } from './patients/patients.controller';
import { PatientsService } from './patients/patients.service';
import { Patient, PatientSchema } from './schemas/patient.schema';
import { QueueConsumerService } from './queue/queue.consumer.service';
import { QueueService } from './queue/queue.service';
import { RabbitMQModule } from './queue/rabbitmq.module';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { Connection } from 'mongoose';
import { AutoIncrementService } from './util/autoincrement.service';
import { Counter, CounterSchema } from './schemas/counter.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, }),
    RabbitMQModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      {
        name: Appointment.name, schema: AppointmentSchema
      },
      {
        name: Patient.name, schema: PatientSchema
      },
      {
        name: Counter.name, schema: CounterSchema
      },
    ]),
  ],
  controllers: [AppointmentsController, PatientsController],
  providers: [AppointmentsService, PatientsService, QueueService, QueueConsumerService, AutoIncrementService],
})
export class AppModule { }
