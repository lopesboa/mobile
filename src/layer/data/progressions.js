// @todo add flow coverage
// @todo remove lodash
import reduce from 'lodash/fp/reduce';
// @todo remove lodash
import set from 'lodash/fp/set';
import {createState} from '@coorpacademy/progression-engine';

const progressionStore = reduce(
  (progressionMap, progression) => {
    const newState = createState(progression);
    progressionMap.set(progression._id, set('state', newState, progression));
    return progressionMap;
  },
  new Map(),
  {}
);

const lastProgressionIds = new Map();
const buildLastProgressionKey = (engineRef, contentRef) =>
  `last_progression_${engineRef}_${contentRef}`;

// eslint-disable-next-line require-await
const findById = async id => {
  if (!progressionStore.has(id)) throw new Error('Progression not found');
  return progressionStore.get(id);
};

const getAll = () => {
  return [...progressionStore.values()];
};

const save = async progression => {
  await Promise.all([
    progressionStore.set(progression._id, progression),
    lastProgressionIds.set(
      buildLastProgressionKey(progression.engine.ref, progression.content.ref),
      progression._id
    )
  ]);

  return progression;
};

const findLast = (engineRef, contentRef) => {
  const key = buildLastProgressionKey(engineRef, contentRef);
  const progressionId = lastProgressionIds.get(key);
  if (!progressionId) return Promise.resolve(null);

  const progression = progressionStore.get(progressionId);
  if (!progression) return Promise.resolve(null);

  // if Progression is on successNode, failureNode or extraLifeNode
  // then skip resuming
  const {nextContent} = progression.state;
  if (
    nextContent.type === 'success' ||
    nextContent.type === 'failure' ||
    (nextContent.type === 'node' && nextContent.ref === 'extraLife')
  )
    return Promise.resolve(null);

  return Promise.resolve(progression);
};

export {save, getAll, findById, findLast};
