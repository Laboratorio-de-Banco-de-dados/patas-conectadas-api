import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsDateString()
  @IsNotEmpty()
  data: string;

  @IsInt()
  @IsNotEmpty()
  id_status: number;

  @IsInt()
  @IsOptional()
  id_voluntario?: number;

  @IsInt()
  @IsOptional()
  id_animal?: number;
}
