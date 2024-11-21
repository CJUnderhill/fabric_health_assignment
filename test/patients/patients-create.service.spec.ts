import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from '../../src/patients/patients.service';
import { getModelToken } from '@nestjs/mongoose';
import { AutoIncrementService } from '../../src/util/autoincrement.service';
import { plainToInstance } from 'class-transformer';
import { CreatePatientDto } from '../../src/patients/dto/create-patient.dto';
import { PatientDto } from '../../src/patients/dto/patient.dto';

describe('PatientsService', () => {
  let service: PatientsService;

  const mockPatientModel = jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue({
      id: 1,
      name: 'John Doe',
      age: 30,
      gender: 'Male',
      contact: '123-456-7890',
      toJSON: jest.fn().mockReturnValue({
        id: 1,
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        contact: '123-456-7890',
      }),
    }),
  }));

  const mockAutoIncrementService = {
    getNextId: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        { provide: getModelToken('Patient'), useValue: mockPatientModel },
        { provide: AutoIncrementService, useValue: mockAutoIncrementService },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new patient with an auto-incremented ID', async () => {
      const createPatientDto: CreatePatientDto = {
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        contact: '123-456-7890',
      };

      const result = await service.create(createPatientDto);

      expect(mockAutoIncrementService.getNextId).toHaveBeenCalledWith('Patient', 'id');
      expect(mockPatientModel).toHaveBeenCalledWith({
        ...createPatientDto,
        id: 1,
      });
      expect(result).toEqual(
        plainToInstance(PatientDto, {
          id: 1,
          ...createPatientDto,
        }),
      );
    });
  });
});