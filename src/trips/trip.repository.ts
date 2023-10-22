import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Favourite } from './trip.entity';

@Injectable()
export class FavouriteRepository extends Repository<Favourite> {
  constructor(private dataSource: DataSource) {
    super(Favourite, dataSource.createEntityManager());
  }
}
