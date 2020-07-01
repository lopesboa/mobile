import * as React from 'react';
import {View, Text} from 'react-native';

type Props = {
  showApp: () => void;
};

const styles = {
  wrapper: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    fontSize: 18,
    marginBottom: 18,
  },
  content: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 18,
  },
};

export default class Welcome extends React.Component<Props> {
  // @todo check if this function is really usefull
  // and move to stateless component if possible
  showApp(e: Event) {
    e.preventDefault();
    if (this.props.showApp) this.props.showApp();
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.header}>Welcome to the ADM Storybook</Text>
        <Text style={styles.content}>
          This is a UI Component development environment for your React Native app. Here you can
          display and interact with your UI components as stories. A story is a single state of one
          or more UI components. You can have as many stories as you want. In other words a story is
          like a visual test case.
        </Text>
      </View>
    );
  }
}
