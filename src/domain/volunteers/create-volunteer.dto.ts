import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  Matches,
  IsArray,
} from 'class-validator';

export class CreateVolunteerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{11}$/, { message: 'CPF deve conter exatamente 11 dígitos' })
  cpf: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsArray()
  @IsOptional()
  skills?: string[];
}
