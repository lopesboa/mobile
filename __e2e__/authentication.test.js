// @flow strict

import translations from '../src/translations/en';
import {reloadApp} from './utils';

const signOut = async (el: DetoxElement) => {
  await el(by.id('catalog-logo')).longPress();
  await el(by.text('OK')).tap();
  await waitFor(el(by.id('authentication'))).toBeVisible();
  await weExpect(el(by.id('authentication'))).toBeVisible();
};

describe('Authentication', () => {
  it('should see the authentication elements', async () => {
    await waitFor(element(by.id('authentication'))).toBeVisible();
    await weExpect(element(by.id('authentication'))).toBeVisible();
    await weExpect(element(by.id('authentication-logo'))).toBeVisible();
    await weExpect(element(by.id('authentication-content-header'))).toBeVisible();
    await weExpect(element(by.id('authentication-content-description'))).toBeVisible();
    await weExpect(element(by.id('authentication-content-footer'))).toBeVisible();
    await weExpect(element(by.id('button-sign-in-desktop'))).toBeVisible();
    await weExpect(element(by.id('button-sign-in-mobile'))).toBeVisible();
    await weExpect(element(by.id('authentication-footer-start-demo'))).toBeVisible();
    await weExpect(element(by.id('authentication-footer-need-help'))).toBeVisible();
  });
  describe('Magic link', () => {
    beforeAll(async () => {
      await element(by.id('button-sign-in-mobile')).tap();
    });

    it('should see magic link elements', async () => {
      await waitFor(element(by.id('authentication-details-magic-link'))).toBeVisible();
      await weExpect(element(by.id('authentication-details-magic-link'))).toBeVisible();
      await weExpect(element(by.id('authentication-details-magic-link-header'))).toBeVisible();
      await weExpect(element(by.id('authentication-details-magic-link-title'))).toBeVisible();
      await waitFor(element(by.id('authentication-steps'))).toBeVisible();
      await weExpect(element(by.id('authentication-steps'))).toBeVisible();
      await weExpect(element(by.id('authentication-step-1'))).toBeVisible();
      await weExpect(element(by.id('authentication-details-magic-link-button'))).toBeVisible();
      await weExpect(
        element(by.id('authentication-details-magic-link-footer-start-demo'))
      ).toBeVisible();
      await weExpect(
        element(by.id('authentication-details-magic-link-footer-need-help'))
      ).toBeVisible();
    });

    it('should be able to swipe between steps', async () => {
      await element(by.id('authentication-steps')).swipe('left');
      await weExpect(element(by.id('authentication-step-2'))).toBeVisible();
      await weExpect(element(by.id('authentication-step-1'))).toBeNotVisible();
      await element(by.id('authentication-steps')).swipe('left');
      await weExpect(element(by.id('authentication-step-3'))).toBeVisible();
      await weExpect(element(by.id('authentication-step-2'))).toBeNotVisible();
    });

    it('should be able to back', async () => {
      await element(by.id('authentication-details-magic-link-button-close')).tap();
      await waitFor(element(by.id('authentication'))).toBeVisible();
      await weExpect(element(by.id('authentication'))).toBeVisible();
    });
  });
  describe('QR code', () => {
    describe('Permission refused', () => {
      beforeAll(async () => {
        await reloadApp({camera: 'NO'});
        await element(by.id('button-sign-in-desktop')).tap();
      });

      it('should see QR code elements', async () => {
        await waitFor(element(by.id('authentication-details-qr-code'))).toBeVisible();
        await weExpect(element(by.id('authentication-details-qr-code'))).toBeVisible();
        await weExpect(element(by.id('authentication-details-qr-code-header'))).toBeVisible();
        await weExpect(element(by.id('authentication-details-qr-code-title'))).toBeVisible();
        await waitFor(element(by.id('authentication-steps'))).toBeVisible();
        await weExpect(element(by.id('authentication-steps'))).toBeVisible();
        await weExpect(element(by.id('authentication-step-1'))).toBeVisible();
        await weExpect(element(by.id('authentication-details-qr-code-button'))).toBeVisible();
        await weExpect(
          element(by.id('authentication-details-qr-code-footer-start-demo'))
        ).toBeVisible();
        await weExpect(
          element(by.id('authentication-details-qr-code-footer-need-help'))
        ).toBeVisible();
      });

      it('should be able to swipe between steps', async () => {
        await element(by.id('authentication-steps')).swipe('left');
        await weExpect(element(by.id('authentication-step-2'))).toBeVisible();
        await weExpect(element(by.id('authentication-step-1'))).toBeNotVisible();
        await element(by.id('authentication-steps')).swipe('left');
        await weExpect(element(by.id('authentication-step-3'))).toBeVisible();
        await weExpect(element(by.id('authentication-step-2'))).toBeNotVisible();
      });

      it('should be able to cancel', async () => {
        await element(by.id('authentication-details-qr-code-button')).tap();
        await waitFor(element(by.id('qr-code-scanner'))).toBeVisible();
        await weExpect(element(by.id('qr-code-scanner'))).toBeVisible();
        await waitFor(element(by.text(translations.permissionCamera))).toBeVisible();
        await weExpect(element(by.text(translations.permissionCamera))).toBeVisible();
        await weExpect(element(by.text(translations.quit))).toBeVisible();
        await element(by.text(translations.quit)).tap();
        await waitFor(element(by.id('authentication-details-qr-code'))).toBeVisible();
        await weExpect(element(by.id('authentication-details-qr-code'))).toBeVisible();
      });
    });
    describe('Permission accepted', () => {
      beforeAll(async () => {
        await reloadApp({camera: 'YES'}, true);
        await element(by.id('button-sign-in-desktop')).tap();
      });

      it('should be able to sign in', async () => {
        await element(by.id('authentication-details-qr-code-button')).tap();
        await waitFor(element(by.id('qr-code-scanner'))).toExist();
        await weExpect(element(by.id('qr-code-scanner'))).toExist();
        await element(by.id('qr-code-screen')).longPress();
        await waitFor(element(by.id('home'))).toExist();
        await weExpect(element(by.id('home'))).toExist();
      });
    });
  });
  describe('Authenticated', () => {
    beforeAll(async () => {
      await reloadApp();
    });

    it('should be redirect to home', async () => {
      await waitFor(element(by.id('home'))).toExist();
      await weExpect(element(by.id('home'))).toExist();
    });

    it('should be able to sign out', async () => {
      await signOut(element);
    });
  });
});
