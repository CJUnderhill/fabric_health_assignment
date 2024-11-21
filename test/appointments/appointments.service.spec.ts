import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from '../../src/appointments/appointments.service';
import { getModelToken } from '@nestjs/mongoose';
import { QueueService } from '../../src/queue/queue.service';
import { plainToInstance } from 'class-transformer';
import { AppointmentDto } from '../../src/appointments/dto/appointment.dto';
import { Model } from 'mongoose';

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  const mockAppointmentModel = {
    find: jest.fn(),
    findOne: jest.fn().mockImplementation(() => ({
      lean: jest.fn().mockReturnValue({

      })})),
    lean: jest.fn(),
  };

  const mockQueueService = {
    publish: jest.fn(),
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: getModelToken('Appointment'), useValue: mockAppointmentModel },
        { provide: QueueService, useValue: mockQueueService },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all appointments matching the filters', async () => {
      const mockAppointments = [
        { id: 1, doctor: 'Dr. Smith', patient_id: '123', notes: 'Checkup' },
        { id: 2, doctor: 'Dr. Adams', patient_id: '124', notes: 'Follow-up' },
      ];
      mockAppointmentModel.find.mockResolvedValue(mockAppointments);
      mockAppointmentModel.lean.mockResolvedValue(mockAppointments);

      const filters = { patient_id: '123', doctor: 'Dr. Smith' };
      const result = await service.findAll(filters);

      expect(mockAppointmentModel.find).toHaveBeenCalledWith({ patient_id: '123', doctor: 'Dr. Smith' });
      expect(result).toEqual(plainToInstance(AppointmentDto, mockAppointments));
    });

    it('should return an empty array if no appointments match the filters', async () => {
      mockAppointmentModel.find.mockResolvedValue([]);
      mockAppointmentModel.lean.mockResolvedValue([]);

      const filters = { patient_id: '999', doctor: 'Unknown' };
      const result = await service.findAll(filters);

      expect(mockAppointmentModel.find).toHaveBeenCalledWith(filters);
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return the appointment if found', async () => {
      const mockAppointment = { id: 1, doctor: 'Dr. Smith', patient_id: '123', notes: 'Checkup' };
      mockAppointmentModel.findOne.mockResolvedValue(mockAppointment);
      mockAppointmentModel.lean.mockResolvedValue(mockAppointment);

      const result = await service.findOne(1);

      expect(mockAppointmentModel.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(plainToInstance(AppointmentDto, mockAppointment));
    });

    it('should return null if no appointment is found', async () => {
      mockAppointmentModel.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(mockAppointmentModel.findOne).toHaveBeenCalledWith({ id: 999 });
      expect(result).toBeNull();
    });
  });

  describe('processFile', () => {
    it('should call queueService.publish with the correct queue and message', async () => {
      const filepath = 'test.csv';
      process.env.RABBITMQ_QUEUE = 'test_queue';

      const result = await service.processFile(filepath);

      expect(mockQueueService.publish).toHaveBeenCalledWith('test_queue', { filepath });
      expect(result).toBe('File submitted for processing');
    });
  });
});
