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
  name: string;

  @property({
    type: 'string',
  })
  data1?: string;

  @property({
    type: 'string',
  })
  data2?: string;

  @property({
    type: 'number',
    required: true,
  })
  userProfileId: number;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  locationTwos: object[];


  constructor(data?: Partial<LocationData>) {
    super(data);
  }
}

export interface LocationDataRelations {
  // describe navigational properties here
}

export type LocationDataWithRelations = LocationData & LocationDataRelations;
