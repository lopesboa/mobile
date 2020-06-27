import {$PropertyType} from "utility-types";
import type {DataLayer} from '../layer/data';

export type LoggerService = {
  error: $PropertyType<DataLayer, 'logError'>,
  setProperties: $PropertyType<DataLayer, 'setLoggerProperties'>
};

const service = (dataLayer: DataLayer): LoggerService => ({
  error: dataLayer.logError,
  setProperties: dataLayer.setLoggerProperties
});

export default service;
