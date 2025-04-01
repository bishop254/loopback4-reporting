import {Entity, model, property} from '@loopback/repository';

@model()
export class Todo extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'array',
    itemType: 'number',
    required: true,
  })
  reporter_ids: number[];

  @property({
    type: 'array',
    itemType: 'number',
    default: [],
  })
  reviewer_ids?: number[];

  @property({
    type: 'date',
    required: true,
  })
  start_date: string;

  @property({
    type: 'date',
    required: true,
  })
  end_date: string;

  @property({
    type: 'number',
    required: true,
  })
  frequency: number;

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
    type: 'number',
    required: true,
  })
  userProfileId: number;

  @property({
    type: 'number',
    required: true,
  })
  dcfId: number;

  constructor(data?: Partial<Todo>) {
    super(data);
  }
}

export interface TodoRelations {
  // describe navigational properties here
}

export type TodoWithRelations = Todo & TodoRelations;
