import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class CreateParticipationDto {
  @IsInt()
  @IsNotEmpty()
  id_evento: number;

  @IsInt()
  @IsOptional()
  id_voluntario?: number;

  @IsInt()
  @IsOptional()
  id_doador?: number;

  @IsString()
  @IsNotEmpty()
  funcao: string;
}
