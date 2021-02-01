import { Test, TestingModule } from '@nestjs/testing';
import { TranslationService } from './translation.service';
const mockI18n = () => ({});
describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationService,
        { provide: 'I18nService', useFactory: mockI18n },
      ],
    }).compile();

    service = module.get<TranslationService>(TranslationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
