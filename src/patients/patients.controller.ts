import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  async findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const patient = await this.patientsService.findOne(+id);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }
}
