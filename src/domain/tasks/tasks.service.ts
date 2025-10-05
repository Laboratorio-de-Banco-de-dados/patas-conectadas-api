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

  async create(createTaskDto: CreateTaskDto) {
    // Get the default "pending" status from status_tarefa
    const pendingStatus = await this.prisma.status_tarefa.findFirst({
      where: { status: 'pending' },
    });

    if (!pendingStatus) {
      throw new BadRequestException(
        'Status "pending" não encontrado. Configure os status de tarefa.',
      );
    }

    const task = await this.prisma.tarefa.create({
      data: {
        title: createTaskDto.title,
        descricao: createTaskDto.description,
        data: new Date(),
        id_status: pendingStatus.id_status,
        status: 'pending',
        target_entity: createTaskDto.target_entity || null,
        due_date: createTaskDto.due_date
          ? new Date(createTaskDto.due_date)
          : null,
      },
    });

    return this.formatTask(task);
  }

  async findAll(status?: string, assigned_to?: number) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (assigned_to) {
      where.id_voluntario = assigned_to;
    }

    const tasks = await this.prisma.tarefa.findMany({
      where,
      include: {
        voluntario: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return tasks.map((t) => this.formatTask(t));
  }

  async findByVolunteer(volunteerId: number) {
    const volunteer = await this.prisma.voluntario.findUnique({
      where: { id_voluntario: volunteerId },
    });

    if (!volunteer) {
      throw new NotFoundException('Voluntário não encontrado');
    }

    const tasks = await this.prisma.tarefa.findMany({
      where: { id_voluntario: volunteerId },
      orderBy: { created_at: 'desc' },
    });

    return tasks.map((t) => this.formatTask(t));
  }

  async assign(taskId: number, assignTaskDto: AssignTaskDto) {
    // Check if volunteer exists
    const volunteer = await this.prisma.voluntario.findUnique({
      where: { id_voluntario: assignTaskDto.volunteer_id },
    });

    if (!volunteer) {
      throw new NotFoundException('Voluntário não encontrado');
    }

    // Check if task exists
    const task = await this.prisma.tarefa.findUnique({
      where: { id_tarefa: taskId },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    // Get assigned status
    const assignedStatus = await this.prisma.status_tarefa.findFirst({
      where: { status: 'assigned' },
    });

    const updatedTask = await this.prisma.tarefa.update({
      where: { id_tarefa: taskId },
      data: {
        id_voluntario: assignTaskDto.volunteer_id,
        status: 'assigned',
        ...(assignedStatus && { id_status: assignedStatus.id_status }),
      },
      include: {
        voluntario: true,
      },
    });

    return this.formatTask(updatedTask);
  }

  async complete(taskId: number) {
    const task = await this.prisma.tarefa.findUnique({
      where: { id_tarefa: taskId },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    if (task.status === 'completed') {
      throw new BadRequestException('Tarefa já foi concluída');
    }

    // Get completed status
    const completedStatus = await this.prisma.status_tarefa.findFirst({
      where: { status: 'completed' },
    });

    const updatedTask = await this.prisma.tarefa.update({
      where: { id_tarefa: taskId },
      data: {
        status: 'completed',
        ...(completedStatus && { id_status: completedStatus.id_status }),
      },
      include: {
        voluntario: true,
      },
    });

    return this.formatTask(updatedTask);
  }

  private formatTask(task: any) {
    return {
      id: task.id_tarefa,
      title: task.title,
      description: task.descricao,
      status: task.status,
      target_entity: task.target_entity,
      due_date: task.due_date,
      assigned_to: task.id_voluntario
        ? {
            id: task.id_voluntario,
            name: task.voluntario?.nome,
          }
        : null,
      created_at: task.created_at,
      updated_at: task.updated_at,
    };
  }
}
