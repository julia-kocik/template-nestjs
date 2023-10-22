import { Body, Controller, Get, Post } from '@nestjs/common';
import { Trip } from './all-trips.entity';
import { AllTripsService } from './all-trips.service';
import { CreateTripDto } from './dto/create-trip.dto';

@Controller('all-trips')
export class AllTripsController {
  constructor(private tripsService: AllTripsService) {}

  @Get()
  getAllTrips(): Promise<Trip[]> {
    return this.tripsService.getAllTrips();
  }

  @Post()
  createTrip(@Body() createTripDto: CreateTripDto): Promise<Trip> {
    return this.tripsService.createTrip(createTripDto);
  }
}
