import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Trip } from './all-trips.entity';

@Injectable()
export class AllTripsRepository extends Repository<Trip> {
  constructor(private dataSource: DataSource) {
    super(Trip, dataSource.createEntityManager());
  }
}
