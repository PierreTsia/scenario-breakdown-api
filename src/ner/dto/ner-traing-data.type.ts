import { Expose, Transform, Type } from 'class-transformer';

export default class NerTrainingData {
  @Expose()
  text: string;

  @Expose()
  entityType: string;

  @Expose()
  uid: string;
}
