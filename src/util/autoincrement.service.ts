import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter } from '../schemas/counter.schema';

@Injectable()
export class AutoIncrementService {
  constructor(
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
  ) {}

  async getNextId(modelName: string, fieldName: string): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { modelName: modelName, field: fieldName },
      { $inc: { count: 1 } },
      { new: true, upsert: true },
    );

    return counter.count;
  }
}
