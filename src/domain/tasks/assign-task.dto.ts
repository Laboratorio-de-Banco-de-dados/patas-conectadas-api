import { IsInt, IsNotEmpty } from 'class-validator';

export class AssignTaskDto {
  @IsInt()
  @IsNotEmpty({ message: 'O ID do voluntário é obrigatório' })
  volunteer_id: number;
}
