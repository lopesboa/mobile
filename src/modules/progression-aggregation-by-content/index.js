// @flow
// from https://github.com/CoorpAcademy/api-progression/blob/master/lambda/aggregations/completion.js#L28

import moment from 'moment';
import type {Progression as ProgressionBase} from '@coorpacademy/progression-engine';
import type {ProgressionAggregationByContent} from '../../layer/data/_types';

type Progression = {|
  ...ProgressionBase,
  meta: {
    updatedAt: string,
    createdAt: string
  }
|};

const isOlder = (
  aggregationToCheck: ProgressionAggregationByContent,
  aggregationAsBase: ProgressionAggregationByContent
): boolean => moment(aggregationToCheck.updatedAt).isBefore(aggregationAsBase.updatedAt);

const getLatest = (
  aggregation1: ProgressionAggregationByContent,
  aggregation2: ProgressionAggregationByContent
): ProgressionAggregationByContent =>
  isOlder(aggregation1, aggregation2) ? aggregation2 : aggregation1;

const updateForUnfinishedContent = (
  currentAggregation: ProgressionAggregationByContent,
  newRecord: ProgressionAggregationByContent
): ProgressionAggregationByContent => {
  const latestAggregation = getLatest(currentAggregation, newRecord);
  const updatedAt = latestAggregation.updatedAt;

  if (newRecord.success === true) return {...newRecord, updatedAt};

  if (newRecord.success === false && isOlder(newRecord, currentAggregation)) {
    return {...currentAggregation, updatedAt};
  }

  if (newRecord.success === false && newRecord.latestNbQuestions === 0) {
    // if incoming document is in failure (so completion 0) it should be updated
    return {...newRecord, updatedAt};
  }
  // if incoming document version is higher it should be updated
  if (parseInt(currentAggregation.content.version) < parseInt(newRecord.content.version)) {
    return {...newRecord, updatedAt};
  }
  if (parseInt(currentAggregation.content.version) > parseInt(newRecord.content.version)) {
    return {...currentAggregation, updatedAt};
  }

  // if a new completion is higher
  if (currentAggregation.latestNbQuestions <= newRecord.latestNbQuestions) {
    return {...newRecord, updatedAt};
  }

  return {...currentAggregation, updatedAt};
};

const updateForFinishedContent = (
  currentAggregation: ProgressionAggregationByContent,
  newRecord: ProgressionAggregationByContent
): ProgressionAggregationByContent => {
  const latestAggregation = getLatest(currentAggregation, newRecord);
  const updatedAt = latestAggregation.updatedAt;

  if (newRecord.success === false) return {...currentAggregation, updatedAt};

  // if existing document in dynamoDB is already in success we update only if new stars are greater than prev's
  if (currentAggregation.stars < newRecord.stars) {
    return {...newRecord, updatedAt};
  }
  if (currentAggregation.stars > newRecord.stars) {
    return {...currentAggregation, updatedAt};
  }

  if (isOlder(newRecord, currentAggregation)) {
    return {...currentAggregation, updatedAt};
  }

  return {...newRecord, updatedAt};
};

export const reduce = (
  currentAggregation: ProgressionAggregationByContent,
  newRecord: ProgressionAggregationByContent
) => {
  // if not found, document should be created
  if (!currentAggregation) {
    return newRecord;
  }

  if (currentAggregation.success === true) {
    return updateForFinishedContent(currentAggregation, newRecord);
  } else {
    return updateForUnfinishedContent(currentAggregation, newRecord);
  }
};

export const mapValue = (record: {content: Progression}): ProgressionAggregationByContent => {
  const {
    state = {},
    content,
    meta: {updatedAt}
  } = record.content;

  const {stars = 0, step = {}, nextContent = {type: 'node'}} = state;
  const {current} = step;

  const aggregValue = {
    content: Object.assign({version: '1', ref: content.ref, type: content.type}),
    latestNbQuestions: current ? current - 1 : 0,
    success: false,
    stars,
    updatedAt
  };

  if (nextContent.type === 'failure') {
    return {...aggregValue, latestNbQuestions: 0};
  }
  if (nextContent.type === 'success') {
    return {...aggregValue, success: true};
  }
  return aggregValue;
};
