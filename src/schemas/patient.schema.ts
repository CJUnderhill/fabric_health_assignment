import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({})
export class Patient extends Document {
  @Prop({ unique: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  contact: string;
}

const PatientSchema = SchemaFactory.createForClass(Patient);

PatientSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});


export { PatientSchema };