import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { CreateParticipationDto } from './create-participation.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.evento.findMany({
      include: {
        participacao: {
          include: {
            voluntario: true,
            doador: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.evento.findUnique({
      where: { id_evento: id },
      include: {
        participacao: {
          include: {
            voluntario: true,
            doador: true,
          },
        },
      },
    });
  }

  async create(data: CreateEventDto) {
    return await this.prisma.evento.create({ data });
  }

  async update(id: number, data: UpdateEventDto) {
    return await this.prisma.evento.update({
      where: { id_evento: id },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.evento.delete({
      where: { id_evento: id },
    });
  }

  async addParticipation(data: CreateParticipationDto) {
    return await this.prisma.participacao.create({ data });
  }

  async getParticipations(eventId: number) {
    return await this.prisma.participacao.findMany({
      where: { id_evento: eventId },
      include: {
        voluntario: true,
        doador: true,
      },
    });
  }
}
