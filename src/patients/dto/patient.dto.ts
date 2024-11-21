import { Exclude } from 'class-transformer';
import { IsNumber, IsString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class PatientDto {
    @IsNumber()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @Min(0)
    age: number;

    @IsString()
    @IsNotEmpty()
    gender: string;

    @IsString()
    @IsNotEmpty()
    contact: string;

    @Exclude() // Exclude _id from serialization
    _id?: string;
  
    @Exclude() // Exclude __v from serialization
    __v?: number;
}
