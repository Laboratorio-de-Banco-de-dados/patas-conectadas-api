import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AnimalModule } from './domain/animals/animal.module';
import { VolunteersModule } from './domain/volunteers/volunteers.module';
import { PreferencesModule } from './domain/preferences/preferences.module';
import { TasksModule } from './domain/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AnimalModule,
    VolunteersModule,
    PreferencesModule,
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
