import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateVolunteerDto } from './create-volunteer.dto';
import { UpdateVolunteerDto } from './update-volunteer.dto';

@Injectable()
export class VolunteersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateVolunteerDto) {
    // Check if CPF already exists
    const existingCpf = await this.prisma.voluntario.findUnique({
      where: { cpf: data.cpf },
    });
    if (existingCpf) {
      throw new ConflictException('CPF já cadastrado');
    }

    // Check if email already exists
    const existingEmail = await this.prisma.voluntario.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email já cadastrado');
    }

    return await this.prisma.voluntario.create({ data });
  }

  async findAll() {
    return await this.prisma.voluntario.findMany({
      include: {
        preferencia: true,
      },
    });
  }

  async findOne(id: number) {
    const volunteer = await this.prisma.voluntario.findUnique({
      where: { id_voluntario: id },
      include: {
        preferencia: true,
      },
    });

    if (!volunteer) {
      throw new NotFoundException('Voluntário não encontrado');
    }

    return volunteer;
  }

  async update(id: number, data: UpdateVolunteerDto) {
    await this.findOne(id); // Check if exists

    // If updating CPF, check if new CPF is unique
    if (data.cpf) {
      const existingCpf = await this.prisma.voluntario.findUnique({
        where: { cpf: data.cpf },
      });
      if (existingCpf && existingCpf.id_voluntario !== id) {
        throw new ConflictException('CPF já cadastrado');
      }
    }

    // If updating email, check if new email is unique
    if (data.email) {
      const existingEmail = await this.prisma.voluntario.findUnique({
        where: { email: data.email },
      });
      if (existingEmail && existingEmail.id_voluntario !== id) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    return await this.prisma.voluntario.update({
      where: { id_voluntario: id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists
    return await this.prisma.voluntario.delete({
      where: { id_voluntario: id },
    });
  }

  async getVolunteerTasks(id: number) {
    await this.findOne(id); // Check if volunteer exists
    return await this.prisma.tarefa.findMany({
      where: { id_voluntario: id },
      include: {
        status_tarefa: true,
        animal: true,
      },
    });
  }
}
