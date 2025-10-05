import { Module } from '@nestjs/common';

import { AnimalsController } from './animal.controller';
import { AnimalsService } from './animal.service';

import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [AnimalsController],
  providers: [AnimalsService, PrismaService],
})
export class AnimalModule {}
