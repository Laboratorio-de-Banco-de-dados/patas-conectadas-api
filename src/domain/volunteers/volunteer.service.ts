import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateVolunteerDto } from './create-volunteer.dto';
import { UpdateVolunteerDto } from './update-volunteer.dto';

@Injectable()
export class VolunteersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.voluntario.findMany({
      include: {
        tarefa: true,
        gamificacao: true,
        participacao: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.voluntario.findUnique({
      where: { id_voluntario: id },
      include: {
        tarefa: true,
        gamificacao: true,
        participacao: true,
      },
    });
  }

  async create(data: CreateVolunteerDto) {
    return await this.prisma.voluntario.create({ data });
  }

  async update(id: number, data: UpdateVolunteerDto) {
    return await this.prisma.voluntario.update({
      where: { id_voluntario: id },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.voluntario.delete({
      where: { id_voluntario: id },
    });
  }
}
