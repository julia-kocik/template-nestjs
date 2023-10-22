import { Test, TestingModule } from '@nestjs/testing';
import { AllTripsController } from './all-trips.controller';
import { AllTripsService } from './all-trips.service';
import { Trip } from './all-trips.entity';
import { TripStatus } from './trip-status.enum';
import { CreateTripDto } from './dto/create-trip.dto';

const mockAllTripsService = {
  getAllTrips: jest.fn(),
  createTrip: jest.fn(),
};

const mockTrip = {
  id: '1befbb09-782a-4924-9e51-98f8ec8069ee',
  name: 'New York City Trip',
  description: 'Beautiful memories of city that never sleeps.',
  destination: 'NYC',
  price: 40,
  places: 20,
  status: 'AVAILABLE',
};

describe('All Trips Controller', () => {
  let controller: AllTripsController;
  let service: AllTripsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllTripsController],
      providers: [
        {
          provide: AllTripsService,
          useValue: mockAllTripsService,
        },
      ],
    }).compile();

    controller = module.get<AllTripsController>(AllTripsController);
    service = module.get<AllTripsService>(AllTripsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
  describe('getAllTrips', () => {
    it('should successfully return allTrips', async () => {
      jest
        .spyOn(service, 'getAllTrips')
        .mockImplementation(() => [mockTrip] as any);
      const result = await controller.getAllTrips();
      expect(service.getAllTrips).toHaveBeenCalled();
      expect(result).toEqual([mockTrip]);
    });
  });

  describe('createTrip', () => {
    it('should create a new trip and return it', async () => {
      const createTripDto: CreateTripDto = {
        name: 'Trip 1',
        description: 'Description 1',
        destination: 'Destination 1',
        price: 100,
        places: 10,
      };

      const createdTrip: Trip = {
        id: '123',
        name: createTripDto.name,
        description: createTripDto.description,
        destination: createTripDto.destination,
        price: createTripDto.price,
        places: createTripDto.places,
        status: TripStatus.AVAILABLE,
      };

      jest
        .spyOn(service, 'createTrip')
        .mockImplementation(() => createdTrip as any);
      const result = await controller.createTrip(createTripDto);
      expect(result).toEqual(createdTrip);
    });
  });
});
