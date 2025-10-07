import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateDonorDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 14)
  @Matches(/^[0-9]{11,14}$/)
  cpf_cnpj: string;

  @IsString()
  @IsNotEmpty()
  contato: string;
}
