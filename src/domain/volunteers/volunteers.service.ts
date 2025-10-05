import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateVolunteerDto } from './create-volunteer.dto';
import { UpdateVolunteerDto } from './update-volunteer.dto';

@Injectable()
export class VolunteersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVolunteerDto: CreateVolunteerDto) {
    try {
      const volunteer = await this.prisma.voluntario.create({
        data: {
          nome: createVolunteerDto.name,
          cpf: createVolunteerDto.cpf,
          email: createVolunteerDto.email,
          telefone: createVolunteerDto.phone,
          habilidades: createVolunteerDto.skills?.join(', ') || null,
        },
      });
      return this.formatVolunteer(volunteer);
    } catch (error: any) {
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0];
        throw new ConflictException(
          `${field === 'cpf' ? 'CPF' : 'Email'} já cadastrado`,
        );
      }
      throw error;
    }
  }

  async findAll() {
    const volunteers = await this.prisma.voluntario.findMany({
      orderBy: { created_at: 'desc' },
    });
    return volunteers.map((v) => this.formatVolunteer(v));
  }

  async findOne(id: number) {
    const volunteer = await this.prisma.voluntario.findUnique({
      where: { id_voluntario: id },
      include: {
        preferencia: true,
        tarefa: true,
      },
    });

    if (!volunteer) {
      throw new NotFoundException('Voluntário não encontrado');
    }

    return this.formatVolunteer(volunteer);
  }

  async update(id: number, updateVolunteerDto: UpdateVolunteerDto) {
    try {
      const volunteer = await this.prisma.voluntario.update({
        where: { id_voluntario: id },
        data: {
          ...(updateVolunteerDto.name && { nome: updateVolunteerDto.name }),
          ...(updateVolunteerDto.cpf && { cpf: updateVolunteerDto.cpf }),
          ...(updateVolunteerDto.email && { email: updateVolunteerDto.email }),
          ...(updateVolunteerDto.phone && { telefone: updateVolunteerDto.phone }),
          ...(updateVolunteerDto.skills && {
            habilidades: updateVolunteerDto.skills.join(', '),
          }),
        },
      });
      return this.formatVolunteer(volunteer);
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Voluntário não encontrado');
      }
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0];
        throw new ConflictException(
          `${field === 'cpf' ? 'CPF' : 'Email'} já cadastrado`,
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.voluntario.delete({
        where: { id_voluntario: id },
      });
      return { message: 'Voluntário removido com sucesso' };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Voluntário não encontrado');
      }
      throw error;
    }
  }

  private formatVolunteer(volunteer: any) {
    return {
      id: volunteer.id_voluntario,
      name: volunteer.nome,
      cpf: volunteer.cpf,
      email: volunteer.email,
      phone: volunteer.telefone,
      skills: volunteer.habilidades
        ? volunteer.habilidades.split(', ').filter((s: string) => s)
        : [],
      preferences: volunteer.preferencia
        ? volunteer.preferencia.map((p: any) => ({
            id: p.id_preferencia,
            preference: p.preference,
          }))
        : undefined,
      tasks: volunteer.tarefa
        ? volunteer.tarefa.map((t: any) => ({
            id: t.id_tarefa,
            title: t.title,
            status: t.status,
          }))
        : undefined,
      created_at: volunteer.created_at,
      updated_at: volunteer.updated_at,
    };
  }
}
