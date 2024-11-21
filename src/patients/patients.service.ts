import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from '../schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { AutoIncrementService } from '../util/autoincrement.service';
import { plainToInstance } from 'class-transformer';
import { PatientDto } from './dto/patient.dto';

@Injectable()
export class PatientsService {
  constructor(@InjectModel(Patient.name) private patientModel: Model<Patient>,
  private readonly autoIncrementService: AutoIncrementService,) {}

  async create(patientData: CreatePatientDto): Promise<PatientDto> {
    // Get the next ID before saving the new patient
    const nextId = await this.autoIncrementService.getNextId('Patient', 'id');
    const patient = await new this.patientModel({
      ...patientData,
      id: nextId, // Set the auto-incremented ID
    }).save();
    return plainToInstance(PatientDto, patient.toJSON());
  }

  async findAll(): Promise<PatientDto[]> {
    const patients = await this.patientModel.find().lean();
    return plainToInstance(PatientDto, patients);
  }

  async findOne(id: number): Promise<PatientDto> {
    const patient = this.patientModel.findOne({ id }).lean();
    return plainToInstance(PatientDto, patient);
  }
}
