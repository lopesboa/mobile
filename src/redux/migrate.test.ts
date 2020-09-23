import createMigration from './migrate';

describe('CreateMigration', () => {
  it('migrates the persited store', () => {
    const versionToMigrateTo = 2;
    const migrations = createMigration();
    const oldState = {
      notifications: {
        scheduledNotifications: {
          'finish-course': [],
        },
        settings: {
          'finish-course': {
            label: 'Currently doing reminder',
            status: 'activated',
          },
          suggestion: {
            label: 'Course recommendations',
            status: 'activated',
          },
        },
      },
    };
    const expected = {
      notifications: {
        scheduledNotifications: {
          'finish-course': [],
          suggestion: [],
        },
        settings: {
          authorizeAll: {
            label: 'Authorize notifications',
            status: 'idle',
          },
          'finish-course': {
            label: 'Currently doing reminder',
            status: 'activated',
          },
          suggestion: {
            label: 'Course recommendations',
            status: 'activated',
          },
        },
      },
    };
    const newState = migrations[versionToMigrateTo](oldState);
    expect(newState).toEqual(expected);
  });
});

export default createMigration;
