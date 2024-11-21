// appointment.dto.ts
import { Exclude } from 'class-transformer';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class AppointmentDto {
  @IsNumber()
  id: number;

  @IsString()
  doctor: string;

  @IsString()
  patient_id: string;

  @IsOptional()
  @IsString()
  notes?: string;
  
  @Exclude() // Exclude _id from serialization
  _id?: string;

  @Exclude() // Exclude __v from serialization
  __v?: number;
}
