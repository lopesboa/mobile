// @flow

import {ROLES, SCOPES, hasRole} from '@coorpacademy/acl';
import type {JWT} from '../../types';

export const hasGodMode = (jwt: JWT, brandName: string): boolean => {
  return hasRole(SCOPES.MOOC(brandName), ROLES.GODMODE, jwt);
};
