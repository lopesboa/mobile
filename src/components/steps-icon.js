// @flow

import * as React from 'react';
import {
  NovaLineComputersComputerScreen1 as ComputerScreenSvg,
  NovaLineShoppingQrCode as QRCodeSvg,
  NovaCompositionCoorpacademySettings as SettingsSvg,
  NovaCompositionCoorpacademyTarget as TargetSvg
} from '@coorpacademy/nova-icons';

export type IconName = 'computer' | 'settings' | 'qr-code' | 'target';

type Props = {|
  iconName: IconName,
  color: string,
  height: number,
  width: number
|};

export const COMPUTER: IconName = 'computer';
export const SETTINGS: IconName = 'settings';
export const QR_CODE: IconName = 'qr-code';
export const TARGET: IconName = 'target';

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
