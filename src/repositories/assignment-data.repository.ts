import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AssignmentDataDataSource} from '../datasources';
import {AssignmentData, AssignmentDataRelations} from '../models';

export class AssignmentDataRepository extends DefaultCrudRepository<
  AssignmentData,
  typeof AssignmentData.prototype.id,
  AssignmentDataRelations
> {
  constructor(
    @inject('datasources.assignmentData') dataSource: AssignmentDataDataSource,
  ) {
    super(AssignmentData, dataSource);
  }
}
