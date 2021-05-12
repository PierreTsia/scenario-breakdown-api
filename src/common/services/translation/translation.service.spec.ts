import { Test, TestingModule } from '@nestjs/testing';
import { TranslationService } from './translation.service';
import { I18nService } from 'nestjs-i18n';
import { InternalServerErrorException } from '@nestjs/common';
const mockI18n = () => ({
  translate: jest.fn(),
});
describe('TranslationService', () => {
  let service: TranslationService;
  let i18nService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationService,
        { provide: 'I18nService', useFactory: mockI18n },
      ],
    }).compile();

    service = module.get<TranslationService>(TranslationService);
    i18nService = module.get<I18nService>(I18nService);
  });

  describe('transcode()', () => {
    it('should return i18n translate result', async () => {
      i18nService.translate.mockImplementationOnce((...args) => args);
      const args = { prop: 'test' };

      expect(i18nService.translate).not.toHaveBeenCalled();
      const result = await service.transcode('test.TRAD', args);
      expect(i18nService.translate).toHaveBeenCalledWith('test.TRAD', { args });
      expect(result).toEqual(['test.TRAD', { args }]);
    });
  });

  describe('translate()', () => {
    it('should return i18n translate result', async () => {
      i18nService.translate.mockImplementationOnce((...args) => args);
      const args = { prop: 'test' };

      expect(i18nService.translate).not.toHaveBeenCalled();
      const result = await service.translate(
        `test.TRAD%%${JSON.stringify(args)}`,
      );
      expect(i18nService.translate).toHaveBeenCalledWith('test.TRAD', { args });
      expect(result).toEqual(['test.TRAD', { args }]);
    });

    it('should throw server exception if i18n fails', async () => {
      i18nService.translate.mockRejectedValue(undefined);
      expect(i18nService.translate).not.toHaveBeenCalled();
      const args = { prop: 'test' };

      await expect(
        service.translate(`test.TRAD%%${JSON.stringify(args)}`),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('encode()', () => {
    it('should return encoded key string', async () => {
      const args = { prop: 'test' };
      const key = 'test.TRAD';

      const res = service.encode(key, args);
      expect(res).toEqual(`${key}%%${JSON.stringify(args)}`);
    });
  });
});
