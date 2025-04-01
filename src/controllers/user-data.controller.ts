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
import {UserData} from '../models';
import {UserDataRepository} from '../repositories';

export class UserDataController {
  constructor(
    @repository(UserDataRepository)
    public userDataRepository : UserDataRepository,
  ) {}

  @post('/user-data')
  @response(200, {
    description: 'UserData model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserData)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserData, {
            title: 'NewUserData',
            exclude: ['id'],
          }),
        },
      },
    })
    userData: Omit<UserData, 'id'>,
  ): Promise<UserData> {
    return this.userDataRepository.create(userData);
  }

  @get('/user-data/count')
  @response(200, {
    description: 'UserData model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserData) where?: Where<UserData>,
  ): Promise<Count> {
    return this.userDataRepository.count(where);
  }

  @get('/user-data')
  @response(200, {
    description: 'Array of UserData model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserData, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserData) filter?: Filter<UserData>,
  ): Promise<UserData[]> {
    return this.userDataRepository.find(filter);
  }

  @patch('/user-data')
  @response(200, {
    description: 'UserData PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserData, {partial: true}),
        },
      },
    })
    userData: UserData,
    @param.where(UserData) where?: Where<UserData>,
  ): Promise<Count> {
    return this.userDataRepository.updateAll(userData, where);
  }

  @get('/user-data/{id}')
  @response(200, {
    description: 'UserData model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserData, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(UserData, {exclude: 'where'}) filter?: FilterExcludingWhere<UserData>
  ): Promise<UserData> {
    return this.userDataRepository.findById(id, filter);
  }

  @patch('/user-data/{id}')
  @response(204, {
    description: 'UserData PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserData, {partial: true}),
        },
      },
    })
    userData: UserData,
  ): Promise<void> {
    await this.userDataRepository.updateById(id, userData);
  }

  @put('/user-data/{id}')
  @response(204, {
    description: 'UserData PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() userData: UserData,
  ): Promise<void> {
    await this.userDataRepository.replaceById(id, userData);
  }

  @del('/user-data/{id}')
  @response(204, {
    description: 'UserData DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userDataRepository.deleteById(id);
  }
}
