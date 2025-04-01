import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {UserDataDataSource} from '../datasources';
import {UserData, UserDataRelations} from '../models';

export class UserDataRepository extends DefaultCrudRepository<
  UserData,
  typeof UserData.prototype.id,
  UserDataRelations
> {
  constructor(
    @inject('datasources.userData') dataSource: UserDataDataSource,
  ) {
    super(UserData, dataSource);
  }
}
