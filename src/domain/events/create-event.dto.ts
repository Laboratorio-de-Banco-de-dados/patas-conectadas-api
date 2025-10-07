import {
  IsString,
  IsOptional,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsDateString()
  @IsNotEmpty()
  data: string;

  @IsString()
  @IsNotEmpty()
  local: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsOptional()
  meta?: string;
}
