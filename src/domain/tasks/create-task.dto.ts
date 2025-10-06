import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsInt,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsString()
  @IsOptional()
  target_entity?: string;

  @IsDateString()
  @IsOptional()
  due_date?: string;

  @IsInt()
  @IsOptional()
  id_animal?: number;
}
