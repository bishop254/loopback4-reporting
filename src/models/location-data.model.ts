import {Entity, model, property} from '@loopback/repository';

@model()
export class LocationData extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  locationData: string;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  locationTwos: {
    id: number;
    locationData: string;
    locationThrees: {
      id: number;
      locationData: string;
    }[];
  }[];

  constructor(data?: Partial<LocationData>) {
    super(data);
  }
}

export interface LocationDataRelations {
  // describe navigational properties here
}

export type LocationDataWithRelations = LocationData & LocationDataRelations;
