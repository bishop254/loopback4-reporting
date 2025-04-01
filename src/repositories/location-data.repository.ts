import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {LocationDataDataSource} from '../datasources';
import {LocationData, LocationDataRelations} from '../models';

export class LocationDataRepository extends DefaultCrudRepository<
  LocationData,
  typeof LocationData.prototype.id,
  LocationDataRelations
> {
  constructor(
    @inject('datasources.locationData') dataSource: LocationDataDataSource,
  ) {
    super(LocationData, dataSource);
  }
}
