import {
  IsInt,
  IsString,
  IsOptional,
  IsDateString,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CreateGamificationDto {
  @IsInt()
  @IsNotEmpty()
  id_voluntario: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  pontos: number;

  @IsString()
  @IsOptional()
  badge?: string;

  @IsDateString()
  @IsNotEmpty()
  data: string;
}
