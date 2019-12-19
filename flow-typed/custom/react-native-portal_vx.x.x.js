// @flow

declare module 'react-native-portal' {
  declare type PortalProviderProps = {|
    children: React$Node
  |};
  declare type BlackPortalProps = {|
    name: string,
    style?: ViewStyleProp,
    children?: React$Node
  |};
  declare type WhitePortalProps = {|
    name: string,
    style?: ViewStyleProp,
    children?: React$Node,
    childrenProps?: Object
  |};
  declare class PortalProvider extends React$Component<PortalProviderProps> {}
  declare class BlackPortal extends React$Component<BlackPortalProps> {}
  declare class WhitePortal extends React$Component<WhitePortalProps> {}
}
