import { Module } from '@nestjs/common';
import { VolunteersController } from './volunteer.controller';
import { VolunteersService } from './volunteer.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [VolunteersController],
  providers: [VolunteersService, PrismaService],
  exports: [VolunteersService],
})
export class VolunteerModule {}
