import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

const mockAppController = {
  getHello: jest.fn(),
};

describe('App Controller', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getHello', () => {
    it('should successfully return Hello', () => {
      jest
        .spyOn(controller, 'getHello')
        .mockImplementation(() => "Hello");
      const result = controller.getHello();
      expect(controller.getHello).toHaveBeenCalled();
      expect(result).toEqual("Hello");
    });
  });

});