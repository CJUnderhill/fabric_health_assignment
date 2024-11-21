import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from '../../src/patients/patients.service';
import { getModelToken } from '@nestjs/mongoose';
import { AutoIncrementService } from '../../src/util/autoincrement.service';
import { plainToInstance } from 'class-transformer';
import { PatientDto } from '../../src/patients/dto/patient.dto';

describe('PatientsService', () => {
  let service: PatientsService;

  const mockPatientStaticMethods = {
    find: jest.fn().mockResolvedValue([
      {
        id: 1,
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        contact: '123-456-7890',
      },
      {
        id: 2,
        name: 'Jane Doe',
        age: 28,
        gender: 'Female',
        contact: '987-654-3210',
      },
    ]),
    findOne: jest.fn().mockResolvedValue({
      id: 1,
      name: 'John Doe',
      age: 30,
      gender: 'Male',
      contact: '123-456-7890',
      lean: jest.fn().mockReturnThis(),
    }),
    lean: jest.fn(),
  };

  const mockAutoIncrementService = {
    getNextId: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        { provide: getModelToken('Patient'), useValue: mockPatientStaticMethods },
        { provide: AutoIncrementService, useValue: mockAutoIncrementService },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all patients', async () => {
      const result = await service.findAll();

      expect(mockPatientStaticMethods.find).toHaveBeenCalled();
      expect(result).toEqual(
        plainToInstance(PatientDto, [
          {
            id: 1,
            name: 'John Doe',
            age: 30,
            gender: 'Male',
            contact: '123-456-7890',
          },
          {
            id: 2,
            name: 'Jane Doe',
            age: 28,
            gender: 'Female',
            contact: '987-654-3210',
          },
        ]),
      );
    });
  });

  describe('findOne', () => {
    it('should return a single patient by ID', async () => {
      const result = await service.findOne(1);

      expect(mockPatientStaticMethods.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(
        plainToInstance(PatientDto, {
          id: 1,
          name: 'John Doe',
          age: 30,
          gender: 'Male',
          contact: '123-456-7890',
        }),
      );
    });

    it('should return null if no patient is found', async () => {
      mockPatientStaticMethods.findOne.mockResolvedValueOnce(null);

      const result = await service.findOne(999);

      expect(mockPatientStaticMethods.findOne).toHaveBeenCalledWith({ id: 999 });
      expect(result).toBeNull();
    });
  });
});