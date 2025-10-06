import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateTaskDto } from './create-task.dto';
import { AssignTaskDto } from './assign-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTaskDto) {
    // Get or create "pending" status
    const pendingStatus = await this.prisma.status_tarefa.upsert({
      where: { status: 'pending' },
      update: {},
      create: { status: 'pending' },
    });

    return await this.prisma.tarefa.create({
      data: {
        title: data.title,
        descricao: data.descricao,
        target_entity: data.target_entity,
        due_date: data.due_date ? new Date(data.due_date) : null,
        data: new Date(), // Current date
        id_status: pendingStatus.id_status,
        id_animal: data.id_animal,
      },
      include: {
        status_tarefa: true,
        animal: true,
      },
    });
  }

  async findAll(status?: string, assigned_to?: number) {
    const where: {
      id_status?: number;
      id_voluntario?: number;
    } = {};

    if (status) {
      const statusRecord = await this.prisma.status_tarefa.findUnique({
        where: { status },
      });
      if (statusRecord) {
        where.id_status = statusRecord.id_status;
      }
    }

    if (assigned_to !== undefined) {
      where.id_voluntario = assigned_to;
    }

    return await this.prisma.tarefa.findMany({
      where,
      include: {
        status_tarefa: true,
        voluntario: true,
        animal: true,
      },
    });
  }

  async assignTask(taskId: number, data: AssignTaskDto) {
    // Check if task exists
    const task = await this.prisma.tarefa.findUnique({
      where: { id_tarefa: taskId },
      include: { status_tarefa: true },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    // Check if volunteer exists
    const volunteer = await this.prisma.voluntario.findUnique({
      where: { id_voluntario: data.id_voluntario },
    });

    if (!volunteer) {
      throw new NotFoundException('Voluntário não encontrado');
    }

    // Check if task is in pending status
    if (task.status_tarefa.status !== 'pending') {
      throw new BadRequestException(
        'Apenas tarefas pendentes podem ser atribuídas',
      );
    }

    // Get or create "assigned" status
    const assignedStatus = await this.prisma.status_tarefa.upsert({
      where: { status: 'assigned' },
      update: {},
      create: { status: 'assigned' },
    });

    return await this.prisma.tarefa.update({
      where: { id_tarefa: taskId },
      data: {
        id_voluntario: data.id_voluntario,
        id_status: assignedStatus.id_status,
      },
      include: {
        status_tarefa: true,
        voluntario: true,
        animal: true,
      },
    });
  }

  async completeTask(taskId: number) {
    // Check if task exists
    const task = await this.prisma.tarefa.findUnique({
      where: { id_tarefa: taskId },
      include: { status_tarefa: true },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    // Check if task is assigned
    if (task.status_tarefa.status !== 'assigned') {
      throw new BadRequestException(
        'Apenas tarefas atribuídas podem ser concluídas',
      );
    }

    // Get or create "completed" status
    const completedStatus = await this.prisma.status_tarefa.upsert({
      where: { status: 'completed' },
      update: {},
      create: { status: 'completed' },
    });

    return await this.prisma.tarefa.update({
      where: { id_tarefa: taskId },
      data: {
        id_status: completedStatus.id_status,
      },
      include: {
        status_tarefa: true,
        voluntario: true,
        animal: true,
      },
    });
  }
}
