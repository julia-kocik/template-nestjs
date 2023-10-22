import { Injectable } from '@nestjs/common';
import { Trip } from './all-trips.entity';
import { AllTripsRepository } from './all-trips.repository';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripStatus } from './trip-status.enum';

@Injectable()
export class AllTripsService {
  constructor(private readonly tripRepository: AllTripsRepository) {}

  async getAllTrips(): Promise<Trip[]> {
    return await this.tripRepository.find();
  }

  async createTrip(createTripDto: CreateTripDto): Promise<Trip> {
    const { name, description, destination, price, places } = createTripDto;

    const trip = this.tripRepository.create({
      name,
      description,
      destination,
      price,
      places,
      status: TripStatus.AVAILABLE,
    });

    await this.tripRepository.save(trip);
    return trip;
  }
}
