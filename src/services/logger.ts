import type {DataLayer} from '../layer/data';

export type LoggerService = {
  error: Pick<DataLayer, 'logError'>;
  setProperties: Pick<DataLayer, 'setLoggerProperties'>;
};

const service = (dataLayer: DataLayer): LoggerService => ({
  error: dataLayer.logError,
  setProperties: dataLayer.setLoggerProperties,
});

export default service;
