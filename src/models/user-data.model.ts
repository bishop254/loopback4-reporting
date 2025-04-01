import {Entity, model, property} from '@loopback/repository';

@model()
export class UserData extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'object',
    required: true,
  })
  information: Record<string, any>;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  constructor(data?: Partial<UserData>) {
    super(data);
  }
}

export interface UserDataRelations {
  // describe navigational properties here
}

export type UserDataWithRelations = UserData & UserDataRelations;
