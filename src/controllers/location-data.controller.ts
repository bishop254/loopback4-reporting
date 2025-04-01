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
import {LocationData} from '../models';
import {LocationDataRepository} from '../repositories';

export class LocationDataController {
  constructor(
    @repository(LocationDataRepository)
    public locationDataRepository : LocationDataRepository,
  ) {}

  @post('/location-data')
  @response(200, {
    description: 'LocationData model instance',
    content: {'application/json': {schema: getModelSchemaRef(LocationData)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LocationData, {
            title: 'NewLocationData',
            exclude: ['id'],
          }),
        },
      },
    })
    locationData: Omit<LocationData, 'id'>,
  ): Promise<LocationData> {
    return this.locationDataRepository.create(locationData);
  }

  @get('/location-data/count')
  @response(200, {
    description: 'LocationData model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(LocationData) where?: Where<LocationData>,
  ): Promise<Count> {
    return this.locationDataRepository.count(where);
  }

  @get('/location-data')
  @response(200, {
    description: 'Array of LocationData model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LocationData, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(LocationData) filter?: Filter<LocationData>,
  ): Promise<LocationData[]> {
    return this.locationDataRepository.find(filter);
  }

  @patch('/location-data')
  @response(200, {
    description: 'LocationData PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LocationData, {partial: true}),
        },
      },
    })
    locationData: LocationData,
    @param.where(LocationData) where?: Where<LocationData>,
  ): Promise<Count> {
    return this.locationDataRepository.updateAll(locationData, where);
  }

  @get('/location-data/{id}')
  @response(200, {
    description: 'LocationData model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(LocationData, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(LocationData, {exclude: 'where'}) filter?: FilterExcludingWhere<LocationData>
  ): Promise<LocationData> {
    return this.locationDataRepository.findById(id, filter);
  }

  @patch('/location-data/{id}')
  @response(204, {
    description: 'LocationData PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LocationData, {partial: true}),
        },
      },
    })
    locationData: LocationData,
  ): Promise<void> {
    await this.locationDataRepository.updateById(id, locationData);
  }

  @put('/location-data/{id}')
  @response(204, {
    description: 'LocationData PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() locationData: LocationData,
  ): Promise<void> {
    await this.locationDataRepository.replaceById(id, locationData);
  }

  @del('/location-data/{id}')
  @response(204, {
    description: 'LocationData DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.locationDataRepository.deleteById(id);
  }
}
