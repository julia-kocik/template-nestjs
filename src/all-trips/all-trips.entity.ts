import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TripStatus } from './trip-status.enum';

@Entity()
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  destination: string;

  @Column()
  price: number;

  @Column()
  places: number;

  @Column()
  status: TripStatus;
}
