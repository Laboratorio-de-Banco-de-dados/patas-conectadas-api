import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  especie: string;

  @IsString()
  @IsOptional()
  raca?: string;

  @IsInt()
  @IsOptional()
  idade_aproximada?: number;

  @IsString()
  @IsOptional()
  porte?: string;

  @IsDateString()
  @IsNotEmpty()
  data_resgate: string; // ISO date string

  @IsInt()
  @IsNotEmpty()
  id_status: number;

  @IsString()
  @IsOptional()
  historico_medico?: string;
}
