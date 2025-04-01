import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {FormDataDataSource} from '../datasources';
import {FormData, FormDataRelations} from '../models';

export class FormDataRepository extends DefaultCrudRepository<
  FormData,
  typeof FormData.prototype.id,
  FormDataRelations
> {
  constructor(
    @inject('datasources.formData') dataSource: FormDataDataSource,
  ) {
    super(FormData, dataSource);
  }
}
