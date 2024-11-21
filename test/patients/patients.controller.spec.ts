import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PatientsController } from '../../src/patients/patients.controller';
import { PatientsService } from '../../src/patients/patients.service';
import { CreatePatientDto } from '../../src/patients/dto/create-patient.dto';

describe('PatientsController', () => {
  let controller: PatientsController;
  let patientsService: PatientsService;

  const mockPatientsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [
        {
          provide: PatientsService,
          useValue: mockPatientsService,
        },
      ],
    }).compile();

    controller = module.get<PatientsController>(PatientsController);
    patientsService = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /patients', () => {
    it('should create a new patient', async () => {
      const createPatientDto: CreatePatientDto = {
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        contact: '555-1234'
      };
      const result = { ...createPatientDto, id: 1 };
      mockPatientsService.create.mockResolvedValue(result);

      const response = await controller.create(createPatientDto);

      expect(patientsService.create).toHaveBeenCalledWith(createPatientDto);
      expect(response).toEqual(result);
    });
  });

  describe('GET /patients', () => {
    it('should return an array of patients', async () => {
      const patients = [
        { name: 'John Doe', id: 1 },
        { name: 'Jane Doe', id: 2 },
      ];
      mockPatientsService.findAll.mockResolvedValue(patients);

      const result = await controller.findAll();

      expect(patientsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(patients);
    });
  });

  describe('GET /patients/:id', () => {
    it('should return a patient when found', async () => {
      const patient = { name: 'John Doe', id: 1 };
      mockPatientsService.findOne.mockResolvedValue(patient);

      const result = await controller.findOne('1');

      expect(patientsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(patient);
    });

    it('should throw a NotFoundException when patient is not found', async () => {
      mockPatientsService.findOne.mockResolvedValue(null);

      try {
        await controller.findOne('999');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toBe('Patient not found');
      }
    });
  });
});
