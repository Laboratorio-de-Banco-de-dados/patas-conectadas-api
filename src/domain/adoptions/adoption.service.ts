import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateAdoptionDto } from './create-adoption.dto';
import { UpdateAdoptionDto } from './update-adoption.dto';

@Injectable()
export class AdoptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.adocao.findMany({
      include: {
        animal: true,
        adotante: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.adocao.findUnique({
      where: { id_adocao: id },
      include: {
        animal: true,
        adotante: true,
      },
    });
  }

  async create(data: CreateAdoptionDto) {
    return await this.prisma.adocao.create({ data });
  }

  async update(id: number, data: UpdateAdoptionDto) {
    return await this.prisma.adocao.update({
      where: { id_adocao: id },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.adocao.delete({
      where: { id_adocao: id },
    });
  }

  async getAnnualReport(year: number) {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const adoptions = await this.prisma.adocao.findMany({
      where: {
        data_adocao: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        animal: true,
        adotante: true,
      },
    });

    const totalAdoptions = adoptions.length;
    const adoptionsBySpecies = adoptions.reduce(
      (acc, adoption) => {
        const species = adoption.animal.especie;
        acc[species] = (acc[species] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      year,
      totalAdoptions,
      adoptionsBySpecies,
      adoptions,
    };
  }
}
