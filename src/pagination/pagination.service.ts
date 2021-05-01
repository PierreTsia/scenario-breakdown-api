import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ParagraphType } from '../projects/dto/paragraph.type';
import { plainToClass } from 'class-transformer';
import { PaginationMetaType } from './dto/paginated.type';

export class PaginatedResults {
  meta: PaginationMetaType;
  results: any[] = [];
}

@Injectable()
export class PaginationService {
  paginateResults(
    agg: { data: any[]; total: number }[],
    limit: number | null,
    start = 0,
  ): PaginatedResults {
    if (!agg?.length) {
      throw new BadRequestException();
    }
    const { data, total } = agg[0];
    const paragraphs = data.map((p) =>
      plainToClass(ParagraphType, p, { excludeExtraneousValues: true }),
    );
    const pageSize = data.length;
    const pagesCount = Math.ceil(total / pageSize);
    const currentPage = Math.floor(start / pageSize);
    return {
      results: paragraphs,
      meta: {
        result: data.length,
        total,
        pageIndex: currentPage < pagesCount ? currentPage : null,
        pagesCount,
        pageSize,
      },
    };
  }
}
