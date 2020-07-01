import {ExitNode, ExitNodeRef} from '../models';

export type FindById = (id: ExitNodeRef) => Promise<ExitNode>;
export type ExitNodesService = {
  findById: FindById;
};
