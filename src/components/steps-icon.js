// @flow

import * as React from 'react';
import {
  NovaLineComputersComputerScreen1 as ComputerScreenSvg,
  NovaLineShoppingQrCode as QRCodeSvg,
  NovaCompositionCoorpacademySettings as SettingsSvg,
  NovaCompositionCoorpacademyTarget as TargetSvg
} from '@coorpacademy/nova-icons';

type Props = {|
  iconName: string,
  color: string,
  height: number,
  width: number
|};

export const COMPUTER: string = 'computer';
export const SETTINGS: string = 'settings';
export const QR_CODE: string = 'qr-code';
export const TARGET: string = 'target';

const StepsIcon = ({iconName, color, width, height}: Props) => {
  switch (iconName) {
    case COMPUTER:
      return <ComputerScreenSvg color={color} height={height} width={width} />;
    case SETTINGS:
      return <SettingsSvg color={color} height={height} width={width} />;
    case QR_CODE:
      return <QRCodeSvg color={color} height={height} width={width} />;
    case TARGET:
      return <TargetSvg color={color} height={height} width={width} />;
  }
};

export default StepsIcon;
