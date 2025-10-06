import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePreferenceDto {
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsString()
  @IsNotEmpty()
  valor: string;
}
