import { Test, TestingModule } from '@nestjs/testing';
import { AutoIncrementService } from '../../src/util/autoincrement.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter } from '../../src/schemas/counter.schema';

describe('AutoIncrementService', () => {
    let service: AutoIncrementService;
    let counterModel: Model<Counter>;
  
    beforeEach(async () => {
      const counterModelMock = {
        findOneAndUpdate: jest.fn(),
      };
  
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AutoIncrementService,
          {
            provide: getModelToken(Counter.name),
            useValue: counterModelMock,
          },
        ],
      }).compile();
  
      service = module.get<AutoIncrementService>(AutoIncrementService);
      counterModel = module.get<Model<Counter>>(getModelToken(Counter.name));
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  
    describe('getNextId', () => {
      it('should return the incremented count', async () => {
        const mockCount = 1;
        const mockResponse = { count: mockCount };
        const modelName = 'testModel';
        const fieldName = 'testField';
  
        (counterModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockResponse);
  
        const result = await service.getNextId(modelName, fieldName);
  
        expect(result).toBe(mockCount);
        expect(counterModel.findOneAndUpdate).toHaveBeenCalledWith(
          { modelName, field: fieldName },
          { $inc: { count: 1 } },
          { new: true, upsert: true },
        );
      });
  
      it('should handle counter not found (upsert scenario)', async () => {
        const mockCount = 1;
        const mockResponse = { count: mockCount };
        const modelName = 'testModel';
        const fieldName = 'testField';
  
        (counterModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockResponse);
  
        const result = await service.getNextId(modelName, fieldName);
  
        expect(result).toBe(mockCount);
        expect(counterModel.findOneAndUpdate).toHaveBeenCalledWith(
          { modelName, field: fieldName },
          { $inc: { count: 1 } },
          { new: true, upsert: true },
        );
      });
  
      it('should throw an error if findOneAndUpdate fails', async () => {
        const modelName = 'testModel';
        const fieldName = 'testField';
  
        (counterModel.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));
  
        await expect(service.getNextId(modelName, fieldName)).rejects.toThrowError('Database error');
      });
    });
  });