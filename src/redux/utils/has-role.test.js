// @flow

import {hasGodMode} from './has-role';

describe('Godmode', () => {
  it('should return true if user is has godmode role', () => {
    const token = {
      user: '23456789',
      grants: {
        mooc: {
          grants: {
            up: {
              roles: ['admin', 'user', 'godmode']
            }
          }
        }
      },
      host: 'https://up.coorpacademy.com',
      usage: 'mobile',
      iat: 1234567,
      exp: 234567,
      iss: 'ERTYU-jwt'
    };

    // $FlowFixMe
    const result = hasGodMode(token, 'up');
    expect(result).toEqual(true);
  });
  it('should return false if user has not godmode role', () => {
    const token = {
      user: '23456789',
      grants: {
        mooc: {
          grants: {
            up: {
              roles: ['admin', 'user', 'system']
            }
          }
        }
      },
      host: 'https://up.coorpacademy.com',
      usage: 'mobile',
      iat: 1234567,
      exp: 234567,
      iss: 'ERTYU-jwt'
    };

    // $FlowFixMe
    const result = hasGodMode(token, 'up');
    expect(result).toEqual(false);
  });
});
