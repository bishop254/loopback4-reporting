import {Entity, model, property} from '@loopback/repository';

@model()
export class FormData extends Entity {
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
  formData: string;


  constructor(data?: Partial<FormData>) {
    super(data);
  }
}

export interface FormDataRelations {
  // describe navigational properties here
}

export type FormDataWithRelations = FormData & FormDataRelations;
