import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateDonationDto {
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsString()
  @IsNotEmpty()
  valor_quantidade: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsDateString()
  @IsNotEmpty()
  data: string;

  @IsInt()
  @IsNotEmpty()
  id_doador: number;
}
