import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Appointment extends Document {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true })
  patient_id: number;

  @Prop({ required: true })
  doctor: string;

  @Prop({ required: true })
  appointment_date: string;

  @Prop({ required: true })
  reason: string;
}

const AppointmentSchema = SchemaFactory.createForClass(Appointment);

AppointmentSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export { AppointmentSchema };