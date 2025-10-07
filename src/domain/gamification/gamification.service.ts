import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateGamificationDto } from './create-gamification.dto';
import { UpdateGamificationDto } from './update-gamification.dto';

@Injectable()
export class GamificationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.gamificacao.findMany({
      include: {
        voluntario: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.gamificacao.findUnique({
      where: { id_pontuacao: id },
      include: {
        voluntario: true,
      },
    });
  }

  async create(data: CreateGamificationDto) {
    return await this.prisma.gamificacao.create({ data });
  }

  async update(id: number, data: UpdateGamificationDto) {
    return await this.prisma.gamificacao.update({
      where: { id_pontuacao: id },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.gamificacao.delete({
      where: { id_pontuacao: id },
    });
  }

  async getVolunteerPoints(volunteerId: number) {
    const records = await this.prisma.gamificacao.findMany({
      where: { id_voluntario: volunteerId },
      include: {
        voluntario: true,
      },
    });

    const totalPoints = records.reduce((sum, record) => sum + record.pontos, 0);
    const badges = records
      .filter((record) => record.badge)
      .map((record) => record.badge);

    return {
      volunteerId,
      totalPoints,
      badges,
      records,
    };
  }

  async getRanking() {
    const gamification = await this.prisma.gamificacao.findMany({
      include: {
        voluntario: true,
      },
    });

    const volunteerPoints = gamification.reduce(
      (acc, record) => {
        const volunteerId = record.id_voluntario;
        if (!acc[volunteerId]) {
          acc[volunteerId] = {
            id_voluntario: volunteerId,
            nome: record.voluntario.nome,
            totalPoints: 0,
            badges: [],
          };
        }
        acc[volunteerId].totalPoints += record.pontos;
        if (record.badge) {
          acc[volunteerId].badges.push(record.badge);
        }
        return acc;
      },
      {} as Record<
        number,
        {
          id_voluntario: number;
          nome: string;
          totalPoints: number;
          badges: string[];
        }
      >,
    );

    return Object.values(volunteerPoints).sort(
      (a, b) => b.totalPoints - a.totalPoints,
    );
  }
}
