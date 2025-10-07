import { Module } from '@nestjs/common';
import { AdoptionsController } from './adoption.controller';
import { AdoptionsService } from './adoption.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [AdoptionsController],
  providers: [AdoptionsService, PrismaService],
  exports: [AdoptionsService],
})
export class AdoptionModule {}
