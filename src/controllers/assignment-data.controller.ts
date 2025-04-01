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
import {AssignmentData} from '../models';
import {AssignmentDataRepository} from '../repositories';

export class AssignmentDataController {
  constructor(
    @repository(AssignmentDataRepository)
    public assignmentDataRepository: AssignmentDataRepository,
  ) {}

  @get('/assignment-data/count')
  @response(200, {
    description: 'AssignmentData model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(AssignmentData) where?: Where<AssignmentData>,
  ): Promise<Count> {
    return this.assignmentDataRepository.count(where);
  }

  @get('/assignment-data')
  @response(200, {
    description: 'Array of AssignmentData model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AssignmentData, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(AssignmentData) filter?: Filter<AssignmentData>,
  ): Promise<AssignmentData[]> {
    return this.assignmentDataRepository.find(filter);
  }

  @get('/assignment-data/{id}')
  @response(200, {
    description: 'AssignmentData model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AssignmentData, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(AssignmentData, {exclude: 'where'})
    filter?: FilterExcludingWhere<AssignmentData>,
  ): Promise<AssignmentData> {
    return this.assignmentDataRepository.findById(id, filter);
  }
}
