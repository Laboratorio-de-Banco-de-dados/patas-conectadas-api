import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreatePreferencesDto } from './create-preferences.dto';

@Injectable()
export class PreferencesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(volunteerId: number, createPreferencesDto: CreatePreferencesDto) {
    // Check if volunteer exists
    const volunteer = await this.prisma.voluntario.findUnique({
      where: { id_voluntario: volunteerId },
    });

    if (!volunteer) {
      throw new NotFoundException('Voluntário não encontrado');
    }

    // Create preferences in batch
    const preferences = await Promise.all(
      createPreferencesDto.preferences.map((pref) =>
        this.prisma.preferencia.create({
          data: {
            id_voluntario: volunteerId,
            preference: pref,
          },
        }),
      ),
    );

    return preferences.map((p) => this.formatPreference(p));
  }

  async findAll(volunteerId: number) {
    // Check if volunteer exists
    const volunteer = await this.prisma.voluntario.findUnique({
      where: { id_voluntario: volunteerId },
    });

    if (!volunteer) {
      throw new NotFoundException('Voluntário não encontrado');
    }

    const preferences = await this.prisma.preferencia.findMany({
      where: { id_voluntario: volunteerId },
      orderBy: { created_at: 'desc' },
    });

    return preferences.map((p) => this.formatPreference(p));
  }

  async remove(volunteerId: number, preferenceId: number) {
    try {
      await this.prisma.preferencia.delete({
        where: {
          id_preferencia: preferenceId,
          id_voluntario: volunteerId,
        },
      });
      return { message: 'Preferência removida com sucesso' };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Preferência não encontrada');
      }
      throw error;
    }
  }

  private formatPreference(preference: any) {
    return {
      id: preference.id_preferencia,
      volunteerId: preference.id_voluntario,
      preference: preference.preference,
      created_at: preference.created_at,
      updated_at: preference.updated_at,
    };
  }
}
