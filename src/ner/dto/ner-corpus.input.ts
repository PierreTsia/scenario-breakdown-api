import { Expose, Transform, Type } from 'class-transformer';

class NerAnnotations {
  @Expose({ name: 'value' })
  text: string;
  @Expose()
  @Transform(({ value }) => value.toString())
  attributeId: string;
}
class NerEntity {
  @Expose({ name: '_id' })
  @Transform(({ value }) => value.toString())
  id: string;
  @Expose()
  label: string;
}
class NerAttribute {
  @Expose({ name: '_id' })
  @Transform(({ value }) => value.toString())
  id: string;
  @Expose()
  slug: string;
  @Expose()
  @Type(() => NerEntity)
  entity: NerEntity;
}

export default class NerCorpusInput {
  @Expose({ name: '_id' })
  @Transform(({ value }) => value.toString())
  chapterId: string;
  @Expose()
  @Type(() => NerAttribute)
  attributes: NerAttribute[];
  @Expose()
  @Type(() => NerAnnotations)
  annotations: NerAnnotations[];
}
