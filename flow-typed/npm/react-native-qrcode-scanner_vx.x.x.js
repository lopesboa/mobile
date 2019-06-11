// @flow

// Inspired from https://github.com/moaazsidat/react-native-qrcode-scanner/blob/master/index.d.ts

declare module 'react-native-qrcode-scanner' {
  declare type BarCodeType = 'aztec' | 'code128' | 'code39' | 'code39mod43' | 'code93' | 'ean13' | 'ean8' | 'pdf417' | 'qr' | 'upce' | 'interleaved2of5' | 'itf14' | 'datamatrix';

  declare type Point<T: number | string = number> = {|
    x: T,
    y: T
  |};

  declare type Size<T: string | number = number> = {|
    width: T,
    height: T
  |};

  declare export type Event = {|
    data: any,
    type: BarCodeType,
    bounds: [Point<string>, Point<string>] | {origin: Point<string>, size: Size<string>}
  |};

  declare type Props = {|
    onRead: (e: Event) => void,
    vibrate?: boolean,
    reactivate?: boolean,
    reactivateTimeout?: number,
    fadeIn?: boolean,
    showMarker?: boolean,
    cameraType?: 'front' | 'back',
    customMarker?: React$Node,
    containerStyle?: ViewStyleProp,
    cameraStyle?: ViewStyleProp,
    markerStyle?: ViewStyleProp,
    topViewStyle?: ViewStyleProp,
    bottomViewStyle?: ViewStyleProp,
    topContent?: React$Node | string,
    bottomContent?: React$Node | string,
    notAuthorizedView?: React$Node,
    permissionDialogTitle?: string,
    permissionDialogMessage?: string,
    checkAndroid6Permissions?: boolean,
    cameraProps?: Object
  |};

  declare type State = {|
    scanning: boolean,
    fadeInOpacity: any,
    isAuthorized: boolean,
    isAuthorizationChecked: boolean,
    disableVibrationByUser: boolean
  |};

  declare class QRCodeScanner extends React$Component<Props, State> {
    disable(): void;
    enable(): void;
    _setScanning(value: boolean): void;
    _handleBarCodeRead(e: Event): void;
    _renderTopContent(): React$Node | null;
    _renderBottomContent(): React$Node | null;
    _renderCameraMarker(): React$Node | null;
    _renderCamera(): React$Node;
    reactivate(): void;
  }

  declare export default typeof QRCodeScanner
}
