import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from '../schemas/appointment.schema';

@Injectable()
export class QueueConsumerService implements OnModuleInit {

  constructor(
    @Inject('RABBITMQ_CHANNEL') private readonly channel,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
  ) {}

  async onModuleInit() {
    const queue = process.env.RABBITMQ_QUEUE;

    // Start consuming messages
    this.channel.consume(queue, async (msg) => {
      if (msg) {
        const { filepath } = JSON.parse(msg.content.toString());
        await this.processCsv(filepath);
        this.channel.ack(msg); // Acknowledge the message after processing
      }
    });

    console.log(`Consumer is listening on queue: ${queue}`);
  }

  public async processCsv(filepath: string) {
    const appointments = [];
    const path = require('path');
  
    const dirPath = path.join(__dirname, "../../");
    const finalPath = filepath.replace("~/", dirPath);
  
    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(finalPath)
        .pipe(csvParser())
        .on('data', (row) => appointments.push(row))
        .on('end', async () => {
          try {
            // Attempt to insert the appointments
            await this.appointmentModel.insertMany(appointments, { ordered: false }); // ordered: false allows partial inserts
            console.log('Appointments inserted successfully');
          } catch (error) {
            if (error.code === 11000) {
              console.warn('Duplicate key error detected. Some appointment records were skipped.');
            } else {
              console.error('Error inserting appointments:', error);
            }
          } finally {
            resolve(); // Resolve the promise regardless of success or failure
          }
        })
        .on('error', (err) => {
          console.error('Error reading CSV:', err);
          reject(err); // Reject the promise in case of errors
        });
    });
  }
}
