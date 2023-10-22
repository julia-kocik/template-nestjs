import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AllTripsService } from './all-trips.service';
import { AllTripsRepository } from './all-trips.repository';
import { TripStatus } from './trip-status.enum';
import { CreateTripDto } from './dto/create-trip.dto';
import { Trip } from './all-trips.entity';

const mockAllTripsService = {
  getAllTrips: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};
const mockAllTripsResponse = [
  {
    id: '1befbb09-782a-4924-9e51-98f8ec8069ee',
    name: 'New York City Trip',
    description: 'Beautiful memories of city that never sleeps.',
    destination: 'NYC',
    price: 40,
    places: 20,
    status: 'AVAILABLE',
  },
];

describe('AllTripsService', () => {
  let service: AllTripsService;
  let repository: AllTripsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllTripsService,
        {
          provide: getRepositoryToken(AllTripsRepository),
          useValue: mockAllTripsService,
        },
      ],
    }).compile();

    service = module.get<AllTripsService>(AllTripsService);
    repository = module.get<AllTripsRepository>(
      getRepositoryToken(AllTripsRepository),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('getAllTrips method', () => {
    it('return seccessfully allTrips', async () => {
      jest
        .spyOn(repository, 'find')
        .mockImplementation(() => mockAllTripsResponse as any);

      expect(await service.getAllTrips()).toBe(mockAllTripsResponse);
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
        .spyOn(repository, 'create')
        .mockImplementation(() => createdTrip as any);
      jest
        .spyOn(repository, 'save')
        .mockImplementation(() => createdTrip as any);

      const result = await service.createTrip(createTripDto);
      expect(result).toEqual(createdTrip);
    });
  });
});
