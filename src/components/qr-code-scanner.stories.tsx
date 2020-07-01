import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';

import {__TEST__} from '../modules/environment';
import {handleFakePress} from '../utils/tests';
import QRCodeScanner from './qr-code-scanner';

storiesOf('QRCodeScanner', module)
  .add('Default', () => <QRCodeScanner hasPermission={false} onScan={handleFakePress} />)
  .add('With permission', () => <QRCodeScanner hasPermission onScan={handleFakePress} />);

if (__TEST__) {
  describe('QRCodeScanner', () => {
    describe('onScan', () => {
      it('with data', () => {
        const handleScan = jest.fn();
        const component = renderer.create(<QRCodeScanner hasPermission onScan={handleScan} />);
        // hack to retrieve the QRCode-scanner without testID
        const qrCodeScanner = component.root.find((el) => el.props.onRead);
        qrCodeScanner.props.onRead({data: 'foobarbaz'});
        expect(handleScan.mock.calls.length).toBe(1);
        expect(handleScan.mock.calls[0]).toEqual(['foobarbaz']);
      });

      it('without data', () => {
        const handleScan = jest.fn();
        const component = renderer.create(<QRCodeScanner hasPermission onScan={handleScan} />);
        // hack to retrieve the QRCode-scanner without testID
        const qrCodeScanner = component.root.find((el) => el.props.onRead);
        qrCodeScanner.props.onRead({});
        expect(handleScan.mock.calls.length).toBe(1);
        expect(handleScan.mock.calls[0]).toEqual([undefined]);
      });
    });
  });
}
