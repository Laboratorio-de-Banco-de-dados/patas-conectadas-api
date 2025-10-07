import { Module } from '@nestjs/common';
import { AdoptersController } from './adopter.controller';
import { AdoptersService } from './adopter.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [AdoptersController],
  providers: [AdoptersService, PrismaService],
  exports: [AdoptersService],
})
export class AdopterModule {}
