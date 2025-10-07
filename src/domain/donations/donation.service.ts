import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateDonationDto } from './create-donation.dto';
import { UpdateDonationDto } from './update-donation.dto';

@Injectable()
export class DonationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.doacao.findMany({
      include: {
        doador: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.doacao.findUnique({
      where: { id_doacao: id },
      include: {
        doador: true,
      },
    });
  }

  async create(data: CreateDonationDto) {
    return await this.prisma.doacao.create({ data });
  }

  async update(id: number, data: UpdateDonationDto) {
    return await this.prisma.doacao.update({
      where: { id_doacao: id },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.doacao.delete({
      where: { id_doacao: id },
    });
  }

  async getPeriodicReport(startDate: string, endDate: string) {
    const donations = await this.prisma.doacao.findMany({
      where: {
        data: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        doador: true,
      },
    });

    const totalDonations = donations.length;
    const donationsByType = donations.reduce(
      (acc, donation) => {
        acc[donation.tipo] = (acc[donation.tipo] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      period: { startDate, endDate },
      totalDonations,
      donationsByType,
      donations,
    };
  }
}
