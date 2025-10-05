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
}
