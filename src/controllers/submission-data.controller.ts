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
import {SubmissionData} from '../models';
import {SubmissionDataRepository} from '../repositories';

export class SubmissionDataController {
  constructor(
    @repository(SubmissionDataRepository)
    public submissionDataRepository : SubmissionDataRepository,
  ) {}

  @post('/submission-data')
  @response(200, {
    description: 'SubmissionData model instance',
    content: {'application/json': {schema: getModelSchemaRef(SubmissionData)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SubmissionData, {
            title: 'NewSubmissionData',
            
          }),
        },
      },
    })
    submissionData: SubmissionData,
  ): Promise<SubmissionData> {
    return this.submissionDataRepository.create(submissionData);
  }

  @get('/submission-data/count')
  @response(200, {
    description: 'SubmissionData model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SubmissionData) where?: Where<SubmissionData>,
  ): Promise<Count> {
    return this.submissionDataRepository.count(where);
  }

  @get('/submission-data')
  @response(200, {
    description: 'Array of SubmissionData model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SubmissionData, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SubmissionData) filter?: Filter<SubmissionData>,
  ): Promise<SubmissionData[]> {
    return this.submissionDataRepository.find(filter);
  }

  @patch('/submission-data')
  @response(200, {
    description: 'SubmissionData PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SubmissionData, {partial: true}),
        },
      },
    })
    submissionData: SubmissionData,
    @param.where(SubmissionData) where?: Where<SubmissionData>,
  ): Promise<Count> {
    return this.submissionDataRepository.updateAll(submissionData, where);
  }

  @get('/submission-data/{id}')
  @response(200, {
    description: 'SubmissionData model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SubmissionData, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(SubmissionData, {exclude: 'where'}) filter?: FilterExcludingWhere<SubmissionData>
  ): Promise<SubmissionData> {
    return this.submissionDataRepository.findById(id, filter);
  }

  @patch('/submission-data/{id}')
  @response(204, {
    description: 'SubmissionData PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SubmissionData, {partial: true}),
        },
      },
    })
    submissionData: SubmissionData,
  ): Promise<void> {
    await this.submissionDataRepository.updateById(id, submissionData);
  }

  @put('/submission-data/{id}')
  @response(204, {
    description: 'SubmissionData PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() submissionData: SubmissionData,
  ): Promise<void> {
    await this.submissionDataRepository.replaceById(id, submissionData);
  }

  @del('/submission-data/{id}')
  @response(204, {
    description: 'SubmissionData DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.submissionDataRepository.deleteById(id);
  }
}
