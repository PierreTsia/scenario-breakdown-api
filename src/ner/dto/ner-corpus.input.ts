import { Expose, Type } from 'class-transformer';

class NerAnnotations {
  @Expose({ name: 'value' })
  text: string;
  @Expose()
  attributeId: string;
}
class NerEntity {
  @Expose({ name: '_id' })
  id: string;
  @Expose()
  slug: string;
}
class NerAttribute {
  @Expose({ name: '_id' })
  id: string;

  @Expose()
  slug: string;

  @Expose()
  @Type(() => NerEntity)
  entity: NerEntity;
}

export default class NerCorpusInput {
  @Expose({ name: '_id' })
  chapterId: string;

  @Expose()
  @Type(() => NerAttribute)
  attributes: NerAttribute[];

  @Expose()
  @Type(() => NerAnnotations)
  annotations: NerAnnotations[];
}
