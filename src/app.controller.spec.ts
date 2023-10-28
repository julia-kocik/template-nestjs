import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

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
      const result = controller.getHello();
      expect(result).toEqual("Hello");
    });
  });

});