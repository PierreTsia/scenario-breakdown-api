import {
  ExceptionFilter,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  Injectable,
} from '@nestjs/common';

import { ApolloError } from 'apollo-server-errors';
import { MongoError } from 'mongodb';
import { TranslationService } from '../translation/translation.service';

const logger = new Logger('ExceptionFilter');

const extractMessage = (exception): string => {
  if (exception instanceof MongoError) {
    return exception.message;
  }
  return Array.isArray(exception?.response?.message)
    ? exception?.response?.message[0]
    : exception?.response?.message;
};

@Catch(HttpException)
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private $t: TranslationService) {}
  async catch(exception: HttpException) {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMsg = await this.$t.translate(extractMessage(exception));
    logger.error(errorMsg, exception.stack);
    throw new ApolloError(errorMsg, status.toString());
  }
}
