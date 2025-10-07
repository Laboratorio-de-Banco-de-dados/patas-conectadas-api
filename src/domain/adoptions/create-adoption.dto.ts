import { IsInt, IsDateString, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateAdoptionDto {
  @IsDateString()
  @IsNotEmpty()
  data_adocao: string;

  @IsBoolean()
  @IsNotEmpty()
  termo_responsabilidade: boolean;

  @IsInt()
  @IsNotEmpty()
  id_animal: number;

  @IsInt()
  @IsNotEmpty()
  id_adotante: number;
}
