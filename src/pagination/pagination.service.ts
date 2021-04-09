import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Paragraph } from '../schema/paragraph.schema';
export type PaginationMeta = {
  result: number;
  total: number;
  pageNumber: number;
  pagesCount: number;
  pageSize: number;
};

@Injectable()
export class PaginationService {
  paginateResults(
    agg: { data: Paragraph[]; total: number }[],
    opts: { pageSize: number; pageNumber: number },
  ): { results: any[]; meta: PaginationMeta } {
    if (!agg?.length) {
      throw new InternalServerErrorException();
    }
    const { data, total } = agg[0];
    return {
      results: data,
      meta: {
        result: data.length,
        total,
        pageNumber: opts.pageNumber,
        pagesCount: Math.ceil(total / opts.pageSize),
        pageSize: opts.pageSize,
      },
    };
  }
}
