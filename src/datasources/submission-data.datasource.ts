import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'submissionData',
  connector: 'memory',
  localStorage: '',
  file: './data/submissionData.json'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class SubmissionDataDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'submissionData';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.submissionData', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
