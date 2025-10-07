import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma.service';

import { CreateAnimalDto } from './create-animal.dto';
import { UpdateAnimalDto } from './update-animal.dto';

@Injectable()
export class AnimalsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.animal.findMany({
      include: { status_animal: true }, // ajustar conforme necessidade
    });
  }

  async findOne(id: number) {
    return await this.prisma.animal.findUnique({ where: { id_animal: id } });
  }

  async create(data: CreateAnimalDto) {
    // converter data_resgate para Date caso necessário (Prisma aceita ISO string)
    data.data_resgate = data.data_resgate.trim().length
      ? new Date(data.data_resgate).toISOString()
      : new Date().toISOString();

    return await this.prisma.animal.create({ data });
  }

  async update(id: number, data: UpdateAnimalDto) {
    return await this.prisma.animal.update({
      where: { id_animal: id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.animal.delete({ where: { id_animal: id } });
  }

  async getMedicalHistory(id: number) {
    const animal = await this.prisma.animal.findUnique({
      where: { id_animal: id },
      select: {
        id_animal: true,
        nome: true,
        especie: true,
        historico_medico: true,
      },
    });
    return animal;
  }

  async updateStatus(id: number, statusId: number) {
    return await this.prisma.animal.update({
      where: { id_animal: id },
      data: { id_status: statusId },
    });
  }
}
