import * as React from 'react';
import {StyleSheet, ScrollView} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

const CenterView = (story: () => void) => (
  <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    {story()}
  </ScrollView>
);

export default CenterView;
