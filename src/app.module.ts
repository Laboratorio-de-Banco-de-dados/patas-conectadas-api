import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AnimalModule } from './domain/animals/animal.module';
import { VolunteerModule } from './domain/volunteers/volunteer.module';
import { TaskModule } from './domain/tasks/task.module';
import { DonorModule } from './domain/donors/donor.module';
import { DonationModule } from './domain/donations/donation.module';
import { EventModule } from './domain/events/event.module';
import { AdopterModule } from './domain/adopters/adopter.module';
import { AdoptionModule } from './domain/adoptions/adoption.module';
import { GamificationModule } from './domain/gamification/gamification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AnimalModule,
    VolunteerModule,
    TaskModule,
    DonorModule,
    DonationModule,
    EventModule,
    AdopterModule,
    AdoptionModule,
    GamificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
