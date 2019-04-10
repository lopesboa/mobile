// @flow strict

import {reloadApp} from './utils';

describe('Authentication', () => {
  describe('Permission undetermined', () => {
    beforeAll(async () => {
      await reloadApp({camera: 'NO'});
    });

    it('should see the authentication screen', async () => {
      await waitFor(element(by.id('authentication-screen'))).toExist();
      // await waitFor(element(by.id('button-scan-qr-code'))).toExist();
      // await weExpect(element(by.id('button-scan-qr-code'))).toExist();
      // await waitFor(element(by.id('logo-header'))).toExist();
      // await weExpect(element(by.id('logo-header'))).toExist();
      // await waitFor(element(by.id('sign-in-header'))).toExist();
      // await weExpect(element(by.id('sign-in-header'))).toExist();
      // await waitFor(element(by.id('carousel'))).toExist();
      await weExpect(element(by.id('carousel'))).toExist();
    });

    it('should be able to swipe the carousel and see all the steps', async () => {
      await weExpect(element(by.text('STEP 01'))).toBeVisible();
      await element(by.id('carousel')).swipe('left', 'slow');
      await weExpect(element(by.text('STEP 02'))).toBeVisible();
      await element(by.id('carousel')).swipe('left', 'slow');
      await weExpect(element(by.text('STEP 03'))).toBeVisible();
    });

    // it('should try to scan a qr code and unsuccessfully quit', async () => {
    //   await element(by.id('button-scan-qr-code')).tap();
    //   await waitFor(element(by.id('qr-code-screen'))).toBeVisible();
    //   await weExpect(element(by.id('qr-code-screen'))).toBeVisible();
    // await weExpect(
    //   await element(
    //     by.text(
    //       'We need access to your camera in order to scan your QR code and authenticate you.'
    //     )
    //   )
    // ).toBeVisible();
    // await weExpect(element(by.text('Quit'))).toBeVisible();
    // await element(by.text('Quit')).tap();
    // await waitFor(element(by.id('authentication-screen'))).toBeVisible();
    // await weExpect(element(by.id('authentication-screen'))).toBeVisible();
    // });
  });

  describe('Permission authorized', () => {
    beforeAll(async () => {
      await reloadApp();
      await waitFor(element(by.id('authentication-screen'))).toBeVisible();
      await waitFor(element(by.id('button-scan-qr-code'))).toBeVisible();
    });

    it('should scan a qr code', async () => {
      await element(by.id('button-scan-qr-code')).tap();
      await waitFor(element(by.id('qr-code-screen'))).toBeVisible();
      await weExpect(element(by.id('qr-code-screen'))).toBeVisible();
      await element(by.id('qr-code-screen')).longPress();
      await weExpect(element(by.id('home-screen'))).toBeVisible();
    });
  });

  describe('Authenticated', () => {
    beforeAll(async () => {
      await reloadApp();
      await waitFor(element(by.id('home-screen'))).toBeVisible();
    });

    it('should successfully be redirect to home', async () => {
      await waitFor(element(by.id('home-screen'))).toBeVisible();
      await weExpect(element(by.id('home-screen'))).toBeVisible();
    });
  });

  describe('Reset authentication', () => {
    beforeAll(async () => {
      // to empty async storage
      await device.launchApp({delete: true});
    });

    it('should see authentication screen', async () => {
      await waitFor(element(by.id('authentication-screen'))).toBeVisible();
      await waitFor(element(by.id('button-scan-qr-code'))).toBeVisible();
    });
  });
});
