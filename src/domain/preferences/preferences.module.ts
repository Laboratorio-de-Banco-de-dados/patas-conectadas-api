import { Module } from '@nestjs/common';
import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [PreferencesController],
  providers: [PreferencesService, PrismaService],
})
export class PreferencesModule {}
