import {Entity, model, property} from '@loopback/repository';

@model()
export class SubmissionData extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  id: number;

  @property({
    type: 'number',
    required: true,
  })
  dcfId: number;

  @property({
    type: 'number',
    required: true,
  })
  level: number;

  @property({
    type: 'number',
    required: true,
  })
  locationId: number;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  reporting_period: string[];

  @property({
    type: 'number',
    default: 0,
  })
  type?: number;


  constructor(data?: Partial<SubmissionData>) {
    super(data);
  }
}

export interface SubmissionDataRelations {
  // describe navigational properties here
}

export type SubmissionDataWithRelations = SubmissionData & SubmissionDataRelations;
