import { Test, TestingModule } from '@nestjs/testing';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { PassportModule } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { NotFoundException } from '@nestjs/common';
import { TripStatus } from './trip-status.enum';
import { UpdateTripDto } from './dto/update-task-status.dto';

const mockTripsService = {
  getAllTrips: jest.fn(),
  createTrip: jest.fn(),
  getTripById: jest.fn(),
  deleteById: jest.fn(),
  updateTrip: jest.fn(),
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

const mockUser: User = {
  id: '123',
  username: 'user2',
  password: 'Test1234',
  trips: [],
};

describe('Trips Controller', () => {
  let controller: TripsController;
  let service: TripsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [TripsController],
      providers: [
        {
          provide: TripsService,
          useValue: mockTripsService,
        },
      ],
    }).compile();

    controller = module.get<TripsController>(TripsController);
    service = module.get<TripsService>(TripsService);
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
      const result = await controller.getAllTrips(mockUser);
      expect(service.getAllTrips).toHaveBeenCalled();
      expect(result).toEqual([mockTrip]);
    });
  });

  describe('createTrip', () => {
    it('should create a new trip and return it', async () => {
      jest
        .spyOn(service, 'createTrip')
        .mockImplementation(() => mockTrip as any);

      const result = await controller.createTrip(mockTrip.id, mockUser);
      expect(service.createTrip).toHaveBeenCalled();
      expect(result).toEqual(mockTrip);
    });

    it('throws NotFound exception if no element is found', async () => {
      const mockError = new NotFoundException(
        `Trip with id 1234 does not exist`,
      );
      jest.spyOn(service, 'createTrip').mockRejectedValue(mockError);
      expect(service.createTrip).toHaveBeenCalled();

      await expect(
        controller.createTrip(mockTrip.id, mockUser),
      ).rejects.toThrow(mockError);
    });
  });

  describe('getTripById', () => {
    it('should succesfully getTripById', async () => {
      jest
        .spyOn(service, 'getTripById')
        .mockImplementation(() => mockTrip as any);

      const result = await controller.getTripById(mockTrip.id, mockUser);
      expect(service.getTripById).toHaveBeenCalled();
      expect(result).toEqual(mockTrip);
    });

    it('throws NotFound exception if no element is found', async () => {
      const mockError = new NotFoundException(
        `Trip with id: ${mockTrip.id} not found`,
      );
      jest.spyOn(service, 'getTripById').mockRejectedValue(mockError);

      await expect(
        controller.getTripById(mockTrip.id, mockUser),
      ).rejects.toThrow(mockError);
    });
  });

  describe('deleteById', () => {
    it('should successfully deleteById', async () => {
      const deleteByIdSpy = jest
        .spyOn(service, 'deleteById')
        .mockResolvedValue();

      await controller.deleteById(mockTrip.id, mockUser);

      expect(deleteByIdSpy).toHaveBeenCalledWith(mockTrip.id, mockUser);
    });

    it('throws NotFound exception if no element is found', async () => {
      const mockError = new NotFoundException(
        `Trip with id: ${mockTrip.id} not found`,
      );

      jest.spyOn(service, 'deleteById').mockRejectedValue(mockError);
      expect(service.deleteById).toHaveBeenCalled();
      await expect(
        controller.deleteById(mockTrip.id, mockUser),
      ).rejects.toThrow(
        new NotFoundException(`Trip with id: ${mockTrip.id} not found`),
      );
    });
  });

  describe('updateTrip', () => {
    it('should succesfully updateTrip', async () => {
      const updateTripDto: UpdateTripDto = {
        status: TripStatus.SOLD,
      };
      const updatedTrip = { ...mockTrip, status: TripStatus.SOLD };
      jest
        .spyOn(service, 'updateTrip')
        .mockImplementation(() => updatedTrip as any);

      const result = await controller.updateTrip(
        mockTrip.id,
        updateTripDto,
        mockUser,
      );
      expect(service.updateTrip).toHaveBeenCalled();
      expect(result).toEqual(updatedTrip);
      expect(result.status).toEqual(updatedTrip.status);
    });
  });
});
