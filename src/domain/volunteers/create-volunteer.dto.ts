import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  Length,
  Matches,
} from 'class-validator';

export class CreateVolunteerDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  @Matches(/^[0-9]{11}$/)
  cpf: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  telefone: string;

  @IsString()
  @IsOptional()
  habilidades?: string;

  @IsString()
  @IsOptional()
  preferencias_atuacao?: string;
}
