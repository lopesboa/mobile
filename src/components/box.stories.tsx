import * as React from 'react';
import {Text, View} from 'react-native';
import {storiesOf} from '@storybook/react-native';

import Box from './box';

const wrapperStyle = {
  padding: 12,
};

const textStyle = {
  backgroundColor: '#fff',
  padding: 12,
};

storiesOf('Box', module).add('Default', () => (
  <View style={wrapperStyle}>
    <Box>
      <Text style={textStyle}>Foo bar baz</Text>
    </Box>
  </View>
));
