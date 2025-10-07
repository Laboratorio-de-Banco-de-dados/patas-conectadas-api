import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateDonorDto } from './create-donor.dto';
import { UpdateDonorDto } from './update-donor.dto';

@Injectable()
export class DonorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.doador.findMany({
      include: {
        doacao: true,
        participacao: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.doador.findUnique({
      where: { id_doador: id },
      include: {
        doacao: true,
        participacao: true,
      },
    });
  }

  async create(data: CreateDonorDto) {
    return await this.prisma.doador.create({ data });
  }

  async update(id: number, data: UpdateDonorDto) {
    return await this.prisma.doador.update({
      where: { id_doador: id },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.doador.delete({
      where: { id_doador: id },
    });
  }
}
