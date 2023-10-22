import { Module } from '@nestjs/common';
import { AllTripsService } from './all-trips.service';
import { AllTripsController } from './all-trips.controller';
import { AllTripsRepository } from './all-trips.repository';
import { Trip } from './all-trips.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Trip])],
  providers: [AllTripsService, AllTripsRepository],
  controllers: [AllTripsController],
})
export class AllTripsModule {}
