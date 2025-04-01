import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SubmissionDataDataSource} from '../datasources';
import {SubmissionData, SubmissionDataRelations} from '../models';

export class SubmissionDataRepository extends DefaultCrudRepository<
  SubmissionData,
  typeof SubmissionData.prototype.id,
  SubmissionDataRelations
> {
  constructor(
    @inject('datasources.submissionData') dataSource: SubmissionDataDataSource,
  ) {
    super(SubmissionData, dataSource);
  }
}
