import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePreferencesDto {
  @IsArray()
  @IsNotEmpty({ message: 'A lista de preferências não pode estar vazia' })
  @IsString({ each: true })
  preferences: string[];
}
