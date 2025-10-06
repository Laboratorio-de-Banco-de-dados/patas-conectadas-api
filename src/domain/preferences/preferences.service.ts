import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreatePreferenceDto } from './create-preference.dto';

@Injectable()
export class PreferencesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(volunteerId: number, data: CreatePreferenceDto) {
    // Check if volunteer exists
    const volunteer = await this.prisma.voluntario.findUnique({
      where: { id_voluntario: volunteerId },
    });

    if (!volunteer) {
      throw new NotFoundException('Voluntário não encontrado');
    }

    return await this.prisma.preferencia.create({
      data: {
        id_voluntario: volunteerId,
        tipo: data.tipo,
        valor: data.valor,
      },
    });
  }

  async findAll(volunteerId: number) {
    // Check if volunteer exists
    const volunteer = await this.prisma.voluntario.findUnique({
      where: { id_voluntario: volunteerId },
    });

    if (!volunteer) {
      throw new NotFoundException('Voluntário não encontrado');
    }

    return await this.prisma.preferencia.findMany({
      where: { id_voluntario: volunteerId },
    });
  }

  async remove(volunteerId: number, preferenceId: number) {
    // Check if preference exists and belongs to volunteer
    const preference = await this.prisma.preferencia.findFirst({
      where: {
        id_preferencia: preferenceId,
        id_voluntario: volunteerId,
      },
    });

    if (!preference) {
      throw new NotFoundException('Preferência não encontrada');
    }

    return await this.prisma.preferencia.delete({
      where: { id_preferencia: preferenceId },
    });
  }
}
