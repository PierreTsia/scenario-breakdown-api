import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { TranslationBuilder } from './translation.builder';

@Injectable()
export class TranslationService {
  private builder: TranslationBuilder = new TranslationBuilder();
  private logger = new Logger('TranslateService');
  constructor(private i18n: I18nService) {}
  private async t(key: string, args: any): Promise<string> {
    try {
      return await this.i18n.translate(key, { args });
    } catch (e: any) {
      this.logger.error(
        `Translation Error for ${key}: ${JSON.stringify(args)}`,
        e,
      );
      throw new InternalServerErrorException();
    }
  }

  async translate(keyArgs: string): Promise<string> {
    const { key, args } = this.builder.parseKey(keyArgs);
    return await this.t(key, args);
  }
}
