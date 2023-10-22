import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from '../all-trips/all-trips.entity';
import { AllTripsModule } from '../all-trips/all-trips.module';
import { AuthModule } from '../auth/auth.module';
import { Favourite } from './trip.entity';
import { FavouriteRepository } from './trip.repository';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { AllTripsRepository } from '../all-trips/all-trips.repository';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Favourite]),
    AuthModule,
    TypeOrmModule.forFeature([Trip]),
    AllTripsModule,
  ],
  controllers: [TripsController],
  providers: [TripsService, FavouriteRepository, AllTripsRepository],
})
export class TripsModule {}
