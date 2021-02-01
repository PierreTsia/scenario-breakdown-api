import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
const mockItemModel = () => ({});
const mockTranslationService = () => ({});

describe('ItemsService', () => {
  let service: ItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        { provide: 'ItemModel', useFactory: mockItemModel },
        { provide: 'TranslationService', useFactory: mockTranslationService },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
