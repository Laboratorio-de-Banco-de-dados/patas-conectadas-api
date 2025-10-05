import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AnimalModule } from './domain/animals/animal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AnimalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
