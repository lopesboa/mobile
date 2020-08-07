import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {HEADER_HEIGHT, HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
import {getStatusBarHeight} from '../modules/status-bar';
import HeaderBackIcon from '../components/header-back-icon';
import Touchable from '../components/touchable';
import theme, {getHitSlop} from '../modules/theme';
import HeaderSlideTitle from './header-slide-title';
import HeaderSlideRight from './header-slide-right';
import Progression from './progression';

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT + getStatusBarHeight(),
    backgroundColor: HEADER_BACKGROUND_COLOR,
  },
  sides: {
    paddingTop: getStatusBarHeight(),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    paddingLeft: theme.spacing.base,
    paddingRight: theme.spacing.tiny,
  },
  progression: {
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
    width: '100%',
    bottom: 0,
  },
});

type Props = StackScreenProps<never>;

const QuestionHeader = (props: Props): React.ReactNode => {
  function handleGoBack() {
    return props.navigation.goBack();
  }
  return (
    <View style={styles.container}>
      <View style={styles.sides}>
        <View style={styles.back}>
          <Touchable
            hitSlop={getHitSlop()}
            onPress={handleGoBack}
            testID="question-header-back"
            analyticsID="question-header-back"
          >
            <HeaderBackIcon height={20} width={20} color={theme.colors.gray.dark} />
          </Touchable>
        </View>
        <HeaderSlideTitle />
        <HeaderSlideRight />
      </View>
      <View style={styles.progression}>
        <Progression />
      </View>
    </View>
  );
};

export default QuestionHeader;
