import { Prop, Schema,  SchemaFactory } from '@nestjs/mongoose';
import { Document, model } from 'mongoose';

@Schema()
export class Counter extends Document {
  @Prop({ required: true })
  modelName: string;

  @Prop({ required: true })
  field: string;

  @Prop({ required: true, default: 0 })
  count: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);

// Index for faster lookups
CounterSchema.index({ model: 1, field: 1 });

export const CounterModel = model('Counter', CounterSchema);
