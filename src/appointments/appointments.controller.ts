import { Controller, Get, Post, Body, Param, Query, NotFoundException, HttpCode } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Get()
  async findAll(@Query('patient_id') patient_id?: string, @Query('doctor') doctor?: string) {
    return this.appointmentsService.findAll({ patient_id, doctor });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const appointment = await this.appointmentsService.findOne(+id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  @Post()
  @HttpCode(200)
  async create(@Body('filepath') filepath: string) {
    this.appointmentsService.processFile(filepath);
  }
}
