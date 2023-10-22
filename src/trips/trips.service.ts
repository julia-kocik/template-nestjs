import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { TripStatus } from './trip-status.enum';
import { Favourite } from './trip.entity';
import { FavouriteRepository } from './trip.repository';
import { AllTripsRepository } from '../all-trips/all-trips.repository';

@Injectable()
export class TripsService {
  constructor(
    private readonly tripRepository: FavouriteRepository,
    private readonly allTripsRepository: AllTripsRepository,
  ) {}

  async getAllTrips(user: User): Promise<Favourite[]> {
    return await this.tripRepository.find({ where: { user } });
  }

  async createTrip(id: string, user: User): Promise<Favourite> {
    const found = await this.allTripsRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Trip with id ${id} does not exist`);
    }
    const { name, description, destination, price, places, status } = found;

    const trip = this.tripRepository.create({
      name,
      description,
      destination,
      price,
      places,
      status,
      user,
    });

    await this.tripRepository.save(trip);
    return trip;
  }

  async getTripById(id: string, user: User): Promise<Favourite> {
    const found = await this.tripRepository.findOne({
      where: {
        id,
        user,
      },
    });
    if (!found) {
      throw new NotFoundException(`Trip with id: ${id} not found`);
    }
    return found;
  }

  async deleteById(id: string, user: User): Promise<void> {
    const result = await this.tripRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Trip with id: ${id} not found`);
    }
  }

  async updateTrip(
    id: string,
    status: TripStatus,
    user: User,
  ): Promise<Favourite> {
    const trip = await this.getTripById(id, user);
    trip.status = status;
    await this.tripRepository.save(trip);
    return trip;
  }
}
