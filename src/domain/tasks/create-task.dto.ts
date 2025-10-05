import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  description: string;

  @IsString()
  @IsOptional()
  target_entity?: string;

  @IsDateString()
  @IsOptional()
  due_date?: string;
}
