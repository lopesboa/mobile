// @flow

import * as React from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import hoistNonReactStatic from 'hoist-non-react-statics';

type VibrationType =
  | 'selection'
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy'
  | 'notificationSuccess'
  | 'notificationWarning'
  | 'notificationError';

export const VIBRATION_TYPE: {
  [
    | 'SELECTION'
    | 'IMPACT_LIGHT'
    | 'IMPACT_MEDIUM'
    | 'IMPACT_HEAVY'
    | 'NOTIFICATION_SUCCESS'
    | 'NOTIFICATION_WARNING'
    | 'NOTIFICATION_ERROR']: VibrationType
} = {
  SELECTION: 'selection',
  IMPACT_LIGHT: 'impactLight',
  IMPACT_MEDIUM: 'impactMedium',
  IMPACT_HEAVY: 'impactHeavy',
  NOTIFICATION_SUCCESS: 'notificationSuccess',
  NOTIFICATION_WARNING: 'notificationWarning',
  NOTIFICATION_ERROR: 'notificationError'
};

export type Vibration = {|
  VIBRATION_TYPE: typeof VIBRATION_TYPE,
  vibrate: (VibrationType | void) => void
|};

export type WithVibrationProps = {|
  vibration: Vibration
|};

function withVibration<P>(
  WrappedComponent: React$ComponentType<P>
): React$ComponentType<$Exact<{|...WithVibrationProps, ...P|}>> {
  type Props = $Exact<{|
    ...P,
    ...WithVibrationProps
  |}>;

  const vibration: Vibration = {
    VIBRATION_TYPE,
    vibrate: (vibrationType?: VibrationType = VIBRATION_TYPE.IMPACT_LIGHT) =>
      ReactNativeHapticFeedback.trigger(vibrationType, {
        enableVibrateFallback: false,
        ignoreAndroidSystemSettings: false
      })
  };

  const ComponentWithVibration = (props: Props) => (
    <WrappedComponent {...props} vibration={vibration} />
  );

  return hoistNonReactStatic(ComponentWithVibration, WrappedComponent);
}

export default withVibration;
