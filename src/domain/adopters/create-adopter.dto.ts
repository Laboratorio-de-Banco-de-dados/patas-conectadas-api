import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateAdopterDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  @Matches(/^[0-9]{11}$/)
  cpf: string;

  @IsString()
  @IsNotEmpty()
  endereco: string;

  @IsString()
  @IsNotEmpty()
  contato: string;
}
