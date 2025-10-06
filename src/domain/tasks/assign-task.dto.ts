import { IsInt, IsNotEmpty } from 'class-validator';

export class AssignTaskDto {
  @IsInt()
  @IsNotEmpty()
  id_voluntario: number;
}
