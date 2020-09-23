import {by, expect, element} from 'detox';
import {reloadApp, bypassAuthentication, waitForVisible, waitForExist} from './utils';

describe('Notifications [Dont Notify Me]', () => {
  beforeAll(async () => {
    await reloadApp({
      notifications: 'unset',
    });
    await bypassAuthentication();
  });
  it('rejects to be notified', async () => {
    await waitForExist('notify-me-screen');
    await element(by.id('notifyme-later-button')).tap();
    await waitForExist('home');
  });

  it('should have all notifications settings set to false', async () => {
    await element(by.id('settings-icon')).tap();
    await waitForVisible('settings-screen');
    await expect(element(by.id('settings-notifications-switch-authorizeAll-off'))).toBeVisible();
    await expect(element(by.id('settings-notifications-switch-finish-course-off'))).toBeVisible();
    await expect(element(by.id('settings-notifications-switch-suggestion-off'))).toBeVisible();
  });

  // TODO: Figure out a way to tap on the permission's system pop-up
  //   it('activates the finish-course notification', async () => {
  //     await element(by.id('settings-notifications-switch-finish-course-off')).tap();
  //     await element(by.text('Allow')).tap();
  //     await expect(element(by.id('settings-notifications-switch-finish-course-on'))).toBeVisible();
  //   });
});
