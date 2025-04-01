import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {FormData} from '../models';
import {FormDataRepository} from '../repositories';

export class FormDataController {
  constructor(
    @repository(FormDataRepository)
    public formDataRepository : FormDataRepository,
  ) {}

  @post('/form-data')
  @response(200, {
    description: 'FormData model instance',
    content: {'application/json': {schema: getModelSchemaRef(FormData)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FormData, {
            title: 'NewFormData',
            exclude: ['id'],
          }),
        },
      },
    })
    formData: Omit<FormData, 'id'>,
  ): Promise<FormData> {
    return this.formDataRepository.create(formData);
  }

  @get('/form-data/count')
  @response(200, {
    description: 'FormData model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(FormData) where?: Where<FormData>,
  ): Promise<Count> {
    return this.formDataRepository.count(where);
  }

  @get('/form-data')
  @response(200, {
    description: 'Array of FormData model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FormData, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(FormData) filter?: Filter<FormData>,
  ): Promise<FormData[]> {
    return this.formDataRepository.find(filter);
  }

  @patch('/form-data')
  @response(200, {
    description: 'FormData PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FormData, {partial: true}),
        },
      },
    })
    formData: FormData,
    @param.where(FormData) where?: Where<FormData>,
  ): Promise<Count> {
    return this.formDataRepository.updateAll(formData, where);
  }

  @get('/form-data/{id}')
  @response(200, {
    description: 'FormData model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FormData, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(FormData, {exclude: 'where'}) filter?: FilterExcludingWhere<FormData>
  ): Promise<FormData> {
    return this.formDataRepository.findById(id, filter);
  }

  @patch('/form-data/{id}')
  @response(204, {
    description: 'FormData PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FormData, {partial: true}),
        },
      },
    })
    formData: FormData,
  ): Promise<void> {
    await this.formDataRepository.updateById(id, formData);
  }

  @put('/form-data/{id}')
  @response(204, {
    description: 'FormData PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() formData: FormData,
  ): Promise<void> {
    await this.formDataRepository.replaceById(id, formData);
  }

  @del('/form-data/{id}')
  @response(204, {
    description: 'FormData DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.formDataRepository.deleteById(id);
  }
}
