import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TripsService } from './trips.service';
import { FavouriteRepository } from './trip.repository';
import { TripStatus } from './trip-status.enum';
import { AllTripsRepository } from '../all-trips/all-trips.repository';
import { Favourite } from './trip.entity';
import { User } from '../auth/user.entity';
import { NotFoundException } from '@nestjs/common';

const mockFavRepository = {
  getAllTrips: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

const mockTripsRepository = {
  findOne: jest.fn(),
};

const mockUser: User = {
  id: '123',
  username: 'user2',
  password: 'Test1234',
  trips: [],
};

const mockTrip: Favourite = {
  id: '123',
  name: 'Trip 1',
  description: 'Description 1',
  destination: 'Destination 1',
  price: 100,
  places: 10,
  status: TripStatus.AVAILABLE,
  user: mockUser,
};

describe('TripsService', () => {
  let service: TripsService;
  let repository: FavouriteRepository;
  let allTripsRepo: AllTripsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripsService,
        {
          provide: getRepositoryToken(FavouriteRepository),
          useValue: mockFavRepository,
        },
        {
          provide: getRepositoryToken(AllTripsRepository),
          useValue: mockTripsRepository,
        },
      ],
    }).compile();

    service = module.get<TripsService>(TripsService);
    repository = module.get(getRepositoryToken(FavouriteRepository));
    allTripsRepo = module.get<AllTripsRepository>(
      getRepositoryToken(AllTripsRepository),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(allTripsRepo).toBeDefined();
  });

  describe('getAllTrips method', () => {
    it('return seccessfully allTrips', async () => {
      jest
        .spyOn(repository, 'find')
        .mockImplementation(() => [mockTrip] as any);

      expect(await service.getAllTrips(mockUser)).toStrictEqual([mockTrip]);
    });
  });

  describe('createTrip', () => {
    it('should create a new trip and return it', async () => {
      jest
        .spyOn(allTripsRepo, 'findOne')
        .mockImplementation(() => mockTrip as any);
      jest
        .spyOn(repository, 'create')
        .mockImplementation(() => mockTrip as any);
      jest.spyOn(repository, 'save').mockImplementation(() => mockTrip as any);

      const result = await service.createTrip(mockTrip.id, mockUser);
      expect(result).toEqual(mockTrip);
    });

    it('throws NotFound exception if no element is found', async () => {
      const mockError = new NotFoundException(
        `Trip with id 1234 does not exist`,
      );
      jest.spyOn(allTripsRepo, 'findOne').mockRejectedValue(mockError);

      await expect(service.createTrip(mockTrip.id, mockUser)).rejects.toThrow(
        new NotFoundException(`Trip with id 1234 does not exist`),
      );
    });
  });

  describe('getTripById', () => {
    it('should succesfully getTripById', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(() => mockTrip as any);

      const result = await service.getTripById(mockTrip.id, mockUser);
      expect(result).toEqual(mockTrip);
    });

    it('throws NotFound exception if no element is found', async () => {
      jest.spyOn(repository, 'findOne').mockImplementation(() => undefined);

      await expect(service.getTripById(mockTrip.id, mockUser)).rejects.toThrow(
        new NotFoundException(`Trip with id: ${mockTrip.id} not found`),
      );
    });
  });

  describe('deleteById', () => {
    it('should succesfully deleteById', async () => {
      const mockResult = { affected: 1 };
      jest
        .spyOn(repository, 'delete')
        .mockImplementation(() => mockResult as any);

      await expect(
        service.deleteById(mockTrip.id, mockUser),
      ).resolves.toBeUndefined();
    });

    it('throws NotFound exception if no element is found', async () => {
      const mockResult = { affected: 0 };

      jest
        .spyOn(repository, 'delete')
        .mockImplementation(() => mockResult as any);

      await expect(service.deleteById(mockTrip.id, mockUser)).rejects.toThrow(
        new NotFoundException(`Trip with id: ${mockTrip.id} not found`),
      );
    });
  });

  describe('updateTrip', () => {
    it('should succesfully updateTrip', async () => {
      const updatedTrip = { ...mockTrip, status: TripStatus.SOLD };
      jest
        .spyOn(service, 'getTripById')
        .mockImplementation(() => mockTrip as any);

      const result = await service.updateTrip(
        mockTrip.id,
        TripStatus.SOLD,
        mockUser,
      );
      expect(result).toEqual(updatedTrip);
    });
  });
});
