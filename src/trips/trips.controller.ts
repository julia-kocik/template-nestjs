import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { UpdateTripDto } from './dto/update-task-status.dto';
import { Favourite } from './trip.entity';
import { TripsService } from './trips.service';

@Controller('favourites')
@UseGuards(AuthGuard())
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Get()
  getAllTrips(@GetUser() user: User): Promise<Favourite[]> {
    return this.tripsService.getAllTrips(user);
  }

  @Get('/:id')
  getTripById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Favourite> {
    return this.tripsService.getTripById(id, user);
  }

  @Delete('/:id')
  deleteById(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tripsService.deleteById(id, user);
  }

  @Post('/:id')
  createTrip(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Favourite> {
    return this.tripsService.createTrip(id, user);
  }

  @Patch('/:id/status')
  updateTrip(
    @Param('id') id: string,
    @Body() updateTripDto: UpdateTripDto,
    @GetUser() user: User,
  ): Promise<Favourite> {
    const { status } = updateTripDto;
    return this.tripsService.updateTrip(id, status, user);
  }
}
