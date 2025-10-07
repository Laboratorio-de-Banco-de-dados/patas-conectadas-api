import { Module } from '@nestjs/common';
import { DonorsController } from './donor.controller';
import { DonorsService } from './donor.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [DonorsController],
  providers: [DonorsService, PrismaService],
  exports: [DonorsService],
})
export class DonorModule {}
