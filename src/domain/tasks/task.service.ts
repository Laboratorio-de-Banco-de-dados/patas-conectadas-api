import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.tarefa.findMany({
      include: {
        status_tarefa: true,
        voluntario: true,
        animal: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.tarefa.findUnique({
      where: { id_tarefa: id },
      include: {
        status_tarefa: true,
        voluntario: true,
        animal: true,
      },
    });
  }

  async create(data: CreateTaskDto) {
    return await this.prisma.tarefa.create({ data });
  }

  async update(id: number, data: UpdateTaskDto) {
    return await this.prisma.tarefa.update({
      where: { id_tarefa: id },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.tarefa.delete({
      where: { id_tarefa: id },
    });
  }

  async assignToVolunteer(taskId: number, volunteerId: number) {
    return await this.prisma.tarefa.update({
      where: { id_tarefa: taskId },
      data: { id_voluntario: volunteerId },
    });
  }

  async completeTask(taskId: number, statusId: number) {
    return await this.prisma.tarefa.update({
      where: { id_tarefa: taskId },
      data: { id_status: statusId },
    });
  }
}
