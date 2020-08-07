import * as React from 'react';
import {StatusBar} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';
import Pdf from '../components/pdf';
import Screen from '../components/screen';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';

export type Params = {
  Pdf: {title?: string; source: File | {uri: string}};
};

export type Props = StackScreenProps<Params, 'Pdf'>;

const PdfScreen = (props: Props) => {
  const {source} = props.route?.params;

  return (
    <Screen testID="pdf-screen" noScroll noSafeArea>
      <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
      <Pdf source={source} />
    </Screen>
  );
};

export default React.memo(PdfScreen);
