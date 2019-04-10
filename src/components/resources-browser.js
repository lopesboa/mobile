// @flow strict

import * as React from 'react';
import {FlatList, ImageBackground, View, StyleSheet} from 'react-native';
import {
  NovaSolidAudioAudioControlPlay as PlayIcon,
  NovaLineFilesOfficeFileOfficePdf as PDFIcon
} from '@coorpacademy/nova-icons';

import type {Resource} from '../types';
import {RESOURCE_TYPE} from '../const';
import theme from '../modules/theme';
import {getCleanUri} from '../modules/uri';
import {BrandThemeContext} from './brand-theme-provider';
import Html from './html';
import Space from './space';
import ResourceOverlay from './resource-overlay';
import Touchable from './touchable';

type Props = {|
  onChange: (id: string) => void,
  selected?: string,
  resources: Array<Resource>
|};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.small
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.small
  },
  thumbnail: {
    width: 70,
    height: 45,
    padding: 2,
    resizeMode: 'stretch',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  icon: {
    position: 'absolute'
  },
  descriptionContainer: {
    flex: 1
  },
  description: {
    color: theme.colors.gray.dark
  },
  descriptionSelected: {
    fontWeight: theme.fontWeight.bold
  }
});

class ResourcesBrowser extends React.PureComponent<Props> {
  props: Props;

  handlePress = (resource: Resource) => () => this.props.onChange(resource._id);

  renderSeparator = () => <Space />;

  renderItem = ({item: resource}: {item: Resource}) => {
    const {selected} = this.props;
    const isSelected = selected === resource._id;
    const selectedSuffix = (isSelected && '-selected') || '';
    const testID = `resource-${resource.ref.replace(/_/g, '-')}`;

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
          {brandTheme => {
            const selectedStyle = {
              borderColor: brandTheme.colors.primary,
              color: brandTheme.colors.primary
            };

            return (
              <React.Fragment>
                <View
                  style={[styles.thumbnail, isSelected && selectedStyle]}
                  testID={`${testID}-thumbnail`}
                >
                  <View style={styles.image}>
                    <ImageBackground
                      source={{uri: resource.poster && getCleanUri(resource.poster)}}
                      style={styles.image}
                      resizeMode="cover"
                    />
                    {!isSelected && <ResourceOverlay />}
                  </View>
                  {/* $FlowFixMe img is not defined in progression-engine */}
                  {resource.type === RESOURCE_TYPE.VIDEO && (
                    <PlayIcon
                      style={styles.icon}
                      color={theme.colors.white}
                      testID={`${testID}-video-icon`}
                      height={20}
                      width={20}
                    />
                  )}
                  {/* $FlowFixMe img is not defined in progression-engine */}
                  {resource.type === RESOURCE_TYPE.PDF && (
                    <PDFIcon
                      style={styles.icon}
                      color={theme.colors.white}
                      testID={`${testID}-pdf-icon`}
                      height={20}
                      width={20}
                    />
                  )}
                </View>
                <Space type="small" />
                <Html
                  testID={`${testID}-description`}
                  fontSize={theme.fontSize.regular}
                  containerStyle={styles.descriptionContainer}
                  style={[
                    styles.description,
                    isSelected && selectedStyle,
                    isSelected && styles.descriptionSelected
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
        ItemSeparatorComponent={this.renderSeparator}
        renderItem={this.renderItem}
        testID="resources-browser"
      />
    );
  }
}

export default ResourcesBrowser;
