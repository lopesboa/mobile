// @flow strict

import type {DataLayer} from '../layer/data';
import type {User} from '../types';

export type UsersService = {|
  find: (token: string) => Promise<User>
|};

const service = (dataLayer: DataLayer): UsersService => ({
  find: dataLayer.fetchUser
});

export default service;
