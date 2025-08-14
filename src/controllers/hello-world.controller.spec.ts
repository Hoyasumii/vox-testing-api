import { Test, TestingModule } from '@nestjs/testing';
import { HelloWorldController } from './hello-world.controller';

describe('AppController', () => {
  let appController: HelloWorldController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HelloWorldController],
      providers: [],
    }).compile();

    appController = app.get<HelloWorldController>(HelloWorldController);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      await expect(appController.getHello()).resolves.toBe('Hello World!');
    });
  });
});
