import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateAdopterDto } from './create-adopter.dto';
import { UpdateAdopterDto } from './update-adopter.dto';

@Injectable()
export class AdoptersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.adotante.findMany({
      include: {
        adocao: {
          include: {
            animal: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.adotante.findUnique({
      where: { id_adotante: id },
      include: {
        adocao: {
          include: {
            animal: true,
          },
        },
      },
    });
  }

  async create(data: CreateAdopterDto) {
    return await this.prisma.adotante.create({ data });
  }

  async update(id: number, data: UpdateAdopterDto) {
    return await this.prisma.adotante.update({
      where: { id_adotante: id },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.adotante.delete({
      where: { id_adotante: id },
    });
  }
}
