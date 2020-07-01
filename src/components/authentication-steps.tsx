import * as React from 'react';
import type {ViewStyle} from 'react-native';
import {
  NovaLineComputersComputerScreen1 as DesktopIcon,
  NovaLineMobilephoneQrCode1 as QRCodeIcon,
  NovaCompositionCoorpacademyProfile as ProfileIcon,
  NovaCompositionCoorpacademyMailInbox as MailIcon,
  NovaCompositionCoorpacademyMailInboxDocument as MailDocumentIcon,
  NovaCompositionCoorpacademyMagicWand as MagicWandIcon,
} from '@coorpacademy/nova-icons';

import translations from '../translations';
import {ANALYTICS_EVENT_TYPE, AUTHENTICATION_TYPE} from '../const';
import type {AuthenticationType} from '../types';
import withAnalytics from '../containers/with-analytics';
import type {WithAnalyticsProps} from '../containers/with-analytics';
import Carousel from '../containers/carousel';
import AuthenticationStep from './authentication-step';
import type {Props as AuthenticationStepProps} from './authentication-step';

export type Step = {
  icon: Pick<AuthenticationStepProps, 'icon'>;
  description: Pick<AuthenticationStepProps, 'description'>;
};

export interface Props extends WithAnalyticsProps {
  type: AuthenticationType;
  currentIndex: number;
  onChange: (arg0: number) => void;
  style?: ViewStyle;
}

class AuthenticationSteps extends React.PureComponent<Props> {
  renderItem = ({item: {icon, description}, index}: {item: Step; index: number}) => (
    <AuthenticationStep icon={icon} step={index + 1} description={description} />
  );

  handleChange = (index: number) => {
    const {analytics, currentIndex, onChange} = this.props;

    analytics?.logEvent(ANALYTICS_EVENT_TYPE.SWIPE, {
      id: 'authentication-step',
      from: currentIndex,
      to: index,
    });
    onChange(index);
  };

  getSteps = (): Array<Step> => {
    const {type} = this.props;

    const qrCodeSteps = [
      {
        icon: DesktopIcon,
        description: translations.authenticationQRCodeStepOneDescription,
      },
      {
        icon: ProfileIcon,
        description: translations.authenticationQRCodeStepTwoDescription,
      },
      {
        icon: QRCodeIcon,
        description: translations.authenticationQRCodeStepThreeDescription,
      },
    ];
    const magicLinkSteps = [
      {
        icon: MailIcon,
        description: translations.authenticationMagicLinkStepOneDescription,
      },
      {
        icon: MailDocumentIcon,
        description: translations.authenticationMagicLinkStepTwoDescription,
      },
      {
        icon: MagicWandIcon,
        description: translations.authenticationMagicLinkStepThreeDescription,
      },
    ];

    return type === AUTHENTICATION_TYPE.QR_CODE ? qrCodeSteps : magicLinkSteps;
  };

  render() {
    const {currentIndex, style} = this.props;
    const data = this.getSteps();

    return (
      <Carousel
        data={data}
        renderItem={this.renderItem}
        currentIndex={currentIndex}
        onChange={this.handleChange}
        testID="authentication-steps"
        style={style}
      />
    );
  }
}

export {AuthenticationSteps as Component};
export default withAnalytics(AuthenticationSteps);
