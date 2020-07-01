import * as React from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import kebabCase from 'lodash/fp/kebabCase';

import type {Resource} from '../types';
import theme from '../modules/theme';
import {BrandThemeContext} from './brand-theme-provider';
import Html from './html';
import Space from './space';
import Touchable from './touchable';
import Preview from './preview';

interface Props {
  onChange: (id: string) => void;
  selected?: string;
  resources: Array<Resource>;
}

const THUMBNAIL_PADDING = 2;
const THUMBNAIL_BORDER_WIDTH = 2;
const THUMBNAIL_WIDTH = 70;
const THUMBNAIL_HEIGHT = 45;

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.small,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.small,
  },
  thumbnailContainer: {
    height: THUMBNAIL_HEIGHT + THUMBNAIL_PADDING * 2 + THUMBNAIL_BORDER_WIDTH * 2,
    width: THUMBNAIL_WIDTH + THUMBNAIL_PADDING * 2 + THUMBNAIL_BORDER_WIDTH * 2,
    padding: 2,
    resizeMode: 'stretch',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    width: THUMBNAIL_WIDTH,
    height: THUMBNAIL_HEIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  icon: {
    position: 'absolute',
  },
  descriptionContainer: {
    flex: 1,
  },
  description: {
    color: theme.colors.gray.dark,
  },
  descriptionSelected: {
    fontWeight: theme.fontWeight.bold,
  },
});

class ResourcesBrowser extends React.PureComponent<Props> {
  handlePress = (resource: Resource) => () => this.props.onChange(resource._id);

  keyExtractor = (item: Resource) => item._id;

  renderSeparator = () => <Space />;

  renderItem = ({item: resource}: {item: Resource}) => {
    const {selected} = this.props;
    const isSelected = selected === resource._id;
    const selectedSuffix = (isSelected && '-selected') || '';
    const testID = `resource-${kebabCase(resource.ref)}`;

    return (
      <Touchable
        onPress={this.handlePress(resource)}
        key={testID}
        style={styles.item}
        testID={`${testID}${selectedSuffix}`}
        analyticsID="resource"
        analyticsParams={{type: resource.type}}
      >
        <BrandThemeContext.Consumer>
          {(brandTheme) => {
            const selectedStyle = {
              borderColor: brandTheme.colors.primary,
            };

            const selectedTextStyle = {
              color: brandTheme.colors.primary,
            };

            return (
              <React.Fragment>
                <View
                  style={[styles.thumbnailContainer, isSelected && selectedStyle]}
                  testID={`${testID}-thumbnail`}
                >
                  <Preview
                    type={resource.type}
                    source={{uri: resource.poster}}
                    hasOverlay={!isSelected}
                    iconWidth={20}
                    iconHeight={20}
                    isIconVisible={!isSelected}
                    style={styles.thumbnail}
                    testID={`${testID}-thumbnail-preview`}
                  />
                </View>
                <Space type="small" />
                <Html
                  testID={`${testID}-description`}
                  fontSize={theme.fontSize.regular}
                  containerStyle={styles.descriptionContainer}
                  style={[
                    styles.description,
                    isSelected && selectedTextStyle,
                    isSelected && styles.descriptionSelected,
                  ]}
                >
                  {resource.description}
                </Html>
              </React.Fragment>
            );
          }}
        </BrandThemeContext.Consumer>
      </Touchable>
    );
  };

  render() {
    const {selected, resources} = this.props;

    if (!resources || resources.length < 2) {
      return null;
    }

    return (
      <FlatList
        style={styles.container}
        data={resources}
        extraData={selected}
        keyExtractor={this.keyExtractor}
        ItemSeparatorComponent={this.renderSeparator}
        renderItem={this.renderItem}
        testID="resources-browser"
      />
    );
  }
}

export default ResourcesBrowser;
