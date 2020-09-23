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

  it('should have all notifications settings set to on', async () => {
    await element(by.id('settings-icon')).tap();
    await waitForVisible('settings-screen');
    await expect(element(by.id('settings-notifications-switch-authorizeAll-on'))).toBeVisible();
    await expect(element(by.id('settings-notifications-switch-finish-course-on'))).toBeVisible();
    await expect(element(by.id('settings-notifications-switch-suggestion-on'))).toBeVisible();
  });

  it('deactivates the authorize notifications settings and so the others', async () => {
    await element(by.id('settings-notifications-switch-authorizeAll-on')).tap();
    await expect(element(by.id('settings-notifications-switch-authorizeAll-off'))).toBeVisible();
    await expect(element(by.id('settings-notifications-switch-finish-course-off'))).toBeVisible();
    await expect(element(by.id('settings-notifications-switch-suggestion-off'))).toBeVisible();
  });

  it('activates and deactivates the finish-course notifications settings', async () => {
    // activates
    await element(by.id('settings-notifications-switch-finish-course-off')).tap();
    await expect(element(by.id('settings-notifications-switch-authorizeAll-on'))).toBeVisible();
    await expect(element(by.id('settings-notifications-switch-finish-course-on'))).toBeVisible();

    // deactivates
    await element(by.id('settings-notifications-switch-finish-course-on')).tap();
    await expect(element(by.id('settings-notifications-switch-authorizeAll-off'))).toBeVisible();
    await expect(element(by.id('settings-notifications-switch-finish-course-off'))).toBeVisible();
  });

  it('activates and deactivates the suggestion notifications settings', async () => {
    // activates
    await element(by.id('settings-notifications-switch-suggestion-off')).tap();
    await expect(element(by.id('settings-notifications-switch-authorizeAll-on'))).toBeVisible();
    await expect(element(by.id('settings-notifications-switch-suggestion-on'))).toBeVisible();

    // deactivates
    await element(by.id('settings-notifications-switch-suggestion-on')).tap();
    await expect(element(by.id('settings-notifications-switch-authorizeAll-off'))).toBeVisible();
    await expect(element(by.id('settings-notifications-switch-suggestion-off'))).toBeVisible();
  });

  it('only deactivates a single notification and keeps the rest as is', async () => {
    // activates
    await element(by.id('settings-notifications-switch-suggestion-off')).tap();
    await element(by.id('settings-notifications-switch-finish-course-off')).tap();
    await expect(element(by.id('settings-notifications-switch-authorizeAll-on'))).toBeVisible();
    await expect(element(by.id('settings-notifications-switch-suggestion-on'))).toBeVisible();
    await expect(element(by.id('settings-notifications-switch-finish-course-on'))).toBeVisible();

    // deactivates
    await element(by.id('settings-notifications-switch-suggestion-on')).tap();
    await expect(element(by.id('settings-notifications-switch-authorizeAll-on'))).toBeVisible();
    await expect(element(by.id('settings-notifications-switch-finish-course-on'))).toBeVisible();
    await expect(element(by.id('settings-notifications-switch-suggestion-off'))).toBeVisible();
  });
});
