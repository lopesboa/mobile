import type {Completion} from '../layer/data/_types';

const createCompletion = ({stars, current = 0}: Completion): Completion => {
  return {
    stars,
    current,
  };
};

export default createCompletion;
