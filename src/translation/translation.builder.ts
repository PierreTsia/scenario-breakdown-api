import { SEPARATOR } from '../utils/constants';
export class TranslationBuilder {
  generateKey(i18nKey: string, args: any = {}): string {
    return `${i18nKey}${SEPARATOR}${JSON.stringify(args)}`;
  }
  parseKey(raw: string): { key: string; args: any } {
    const [key, stringArgs] = raw.split(SEPARATOR);
    const args = stringArgs?.length ? JSON.parse(stringArgs) : {};
    return { key, args };
  }
}
