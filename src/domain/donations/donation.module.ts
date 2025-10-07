import { Module } from '@nestjs/common';
import { DonationsController } from './donation.controller';
import { DonationsService } from './donation.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [DonationsController],
  providers: [DonationsService, PrismaService],
  exports: [DonationsService],
})
export class DonationModule {}
