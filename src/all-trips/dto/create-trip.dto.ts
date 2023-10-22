import { IsNotEmpty } from 'class-validator';

export class CreateTripDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  destination: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  places: number;
}
