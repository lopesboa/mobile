import {by, expect, element} from 'detox';
import {reloadApp, bypassAuthentication, waitForVisible, waitForExist} from './utils';

describe('Notifications [Notify Me]', () => {
  beforeAll(async () => {
    await reloadApp({
      notifications: 'YES',
    });
    await bypassAuthentication();
  });

  it('accepts to be notified', async () => {
    await waitForExist('notify-me-screen');
    await element(by.id('notifyme-button')).tap();
    await waitForExist('home');
  });

  it('should have finish-course notification and suggestion set to on', async () => {
    await element(by.id('settings-icon')).tap();
    await waitForVisible('settings-screen');
    await expect(element(by.id('settings-notifications-switch-finish-course-on'))).toBeVisible();
    await expect(element(by.id('settings-notifications-switch-suggestion-on'))).toBeVisible();
  });

  it('deactivates the finish-course notification', async () => {
    await element(by.id('settings-notifications-switch-finish-course-on')).tap();
    await expect(element(by.id('settings-notifications-switch-finish-course-off'))).toBeVisible();
  });

  it('deactivates the suggestion notification', async () => {
    await element(by.id('settings-notifications-switch-suggestion-on')).tap();
    await expect(element(by.id('settings-notifications-switch-suggestion-off'))).toBeVisible();
  });
});
