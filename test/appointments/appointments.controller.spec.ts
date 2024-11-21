import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from '../../src/appointments/appointments.controller';
import { AppointmentsService } from '../../src/appointments/appointments.service';
import { NotFoundException } from '@nestjs/common';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: AppointmentsService;

  const mockAppointmentsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    processFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: mockAppointmentsService,
        },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('GET /appointments', () => {
    it('should call service.findAll with correct query params', async () => {
      const mockAppointments = [
        { id: 1, doctor: 'Dr. Smith', patient_id: '123', notes: 'Checkup' },
        { id: 2, doctor: 'Dr. Adams', patient_id: '124', notes: 'Follow-up' },
      ];
      mockAppointmentsService.findAll.mockResolvedValue(mockAppointments);

      const query = { patient_id: '123', doctor: 'Dr. Smith' };
      const result = await controller.findAll(query.patient_id, query.doctor);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockAppointments);
    });

    it('should return an empty array if no appointments found', async () => {
      mockAppointmentsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalledWith({ patient_id: undefined, doctor: undefined });
      expect(result).toEqual([]);
    });
  });

  describe('GET /appointments/:id', () => {
    it('should return the appointment if found', async () => {
      const mockAppointment = { id: 1, doctor: 'Dr. Smith', patient_id: '123', notes: 'Checkup' };
      mockAppointmentsService.findOne.mockResolvedValue(mockAppointment);

      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAppointment);
    });

    it('should throw NotFoundException if appointment not found', async () => {
      mockAppointmentsService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('POST /appointments', () => {
    it('should call service.processFile with the correct filepath', async () => {
      const filepath = 'test.csv';

      await controller.create(filepath);
      expect(service.processFile).toHaveBeenCalledWith(filepath);
    });

    it('should return status 200 on successful processing', async () => {
      const filepath = 'test.csv';

      await expect(controller.create(filepath)).resolves.toBeUndefined();
      expect(service.processFile).toHaveBeenCalledWith(filepath);
    });
  });
});
