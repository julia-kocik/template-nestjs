import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TripStatus } from './trip-status.enum';

@Entity()
export class Favourite {
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

  @ManyToOne((_type) => User, (user) => user.trips, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
