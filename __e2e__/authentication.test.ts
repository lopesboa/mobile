import {by, expect, element} from 'detox';
import translations from '../src/translations/en';
import {reloadApp, waitForExist} from './utils';

const signOut = async (el: Detox.Element) => {
  await el(by.id('header-logo')).longPress();
  await el(by.text('OK')).tap();
  await waitForExist('authentication');
};

describe('Authentication', () => {
  it('should see the authentication elements', async () => {
    await waitForExist('authentication');
    await expect(element(by.id('authentication-logo'))).toBeVisible();
    await expect(element(by.id('authentication-content-header'))).toBeVisible();
    await expect(element(by.id('authentication-content-description'))).toBeVisible();
    await expect(element(by.id('authentication-content-footer'))).toBeVisible();
    await expect(element(by.id('button-sign-in-desktop'))).toBeVisible();
    await expect(element(by.id('button-sign-in-mobile'))).toBeVisible();
    await expect(element(by.id('authentication-footer-start-demo'))).toBeVisible();
    await expect(element(by.id('authentication-footer-need-help'))).toBeVisible();
  });
  describe('Magic link', () => {
    beforeAll(async () => {
      await element(by.id('button-sign-in-mobile')).tap();
    });

    it('should see magic link elements', async () => {
      await waitForExist('authentication-details-magic-link');
      await expect(element(by.id('authentication-details-magic-link-header'))).toBeVisible();
      await expect(element(by.id('authentication-details-magic-link-title'))).toBeVisible();
      await waitForExist('authentication-steps');
      await expect(element(by.id('authentication-step-1'))).toBeVisible();
      await expect(element(by.id('authentication-details-magic-link-button'))).toBeVisible();
      await expect(
        element(by.id('authentication-details-magic-link-footer-start-demo')),
      ).toBeVisible();
      await expect(
        element(by.id('authentication-details-magic-link-footer-need-help')),
      ).toBeVisible();
    });

    it('should be able to swipe between steps', async () => {
      await element(by.id('authentication-steps')).swipe('left');
      await expect(element(by.id('authentication-step-2'))).toBeVisible();
      await expect(element(by.id('authentication-step-1'))).toBeNotVisible();
      await element(by.id('authentication-steps')).swipe('left');
      await expect(element(by.id('authentication-step-3'))).toBeVisible();
      await expect(element(by.id('authentication-step-2'))).toBeNotVisible();
    });

    it('should be able to back', async () => {
      await element(by.id('authentication-details-magic-link-button-close')).tap();
      await waitForExist('authentication');
    });
  });

  describe('QR code', () => {
    describe('Permission refused', () => {
      beforeAll(async () => {
        await reloadApp({camera: 'NO'}, true);
        await element(by.id('button-sign-in-desktop')).tap();
      });
      it('should see QR code elements', async () => {
        await waitForExist('authentication-details-qr-code');
        await expect(element(by.id('authentication-details-qr-code-header'))).toBeVisible();
        await expect(element(by.id('authentication-details-qr-code-title'))).toBeVisible();
        await waitForExist('authentication-steps');
        await expect(element(by.id('authentication-step-1'))).toBeVisible();
        await expect(element(by.id('authentication-details-qr-code-button'))).toBeVisible();
        await expect(
          element(by.id('authentication-details-qr-code-footer-start-demo')),
        ).toBeVisible();
        await expect(
          element(by.id('authentication-details-qr-code-footer-need-help')),
        ).toBeVisible();
      });

      it('should be able to swipe between steps', async () => {
        await element(by.id('authentication-steps')).swipe('left');
        await expect(element(by.id('authentication-step-2'))).toBeVisible();
        await expect(element(by.id('authentication-step-1'))).toBeNotVisible();
        await element(by.id('authentication-steps')).swipe('left');
        await expect(element(by.id('authentication-step-3'))).toBeVisible();
        await expect(element(by.id('authentication-step-2'))).toBeNotVisible();
      });

      it('should be able to cancel', async () => {
        await element(by.id('authentication-details-qr-code-button')).tap();
        await waitForExist('qr-code-scanner');
        await waitForExist(translations.permissionCamera, true);
        await expect(element(by.text(translations.quit))).toBeVisible();
        await element(by.text(translations.quit)).tap();
        await waitForExist(translations.openSettings, true);
        await expect(element(by.text(translations.quit))).toBeVisible();
        await element(by.text(translations.quit)).tap();
        await waitForExist('authentication-details-qr-code');
      });
    });

    describe('Permission accepted', () => {
      beforeAll(async () => {
        await reloadApp({camera: 'YES'}, true);
        await element(by.id('button-sign-in-desktop')).tap();
      });

      it('should be able to sign in', async () => {
        await element(by.id('authentication-details-qr-code-button')).tap();
        await waitForExist('qr-code-scanner');
        await element(by.id('qr-code-screen')).longPress();
        await waitForExist('home');
      });
    });
  });

  describe('Authenticated', () => {
    beforeAll(async () => {
      await reloadApp();
    });

    it('should be redirect to home', async () => {
      await waitForExist('home');
    });

    it('should be able to sign out', async () => {
      await signOut(element);
    });
  });
});
