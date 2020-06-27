import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Badge from './catalog-item-badge';

storiesOf('CatalogItemBadge', module)
  .add('Default', () => <Badge label="Foo bar" testID="badge" />)
  .add('Cover size', () => <Badge label="Foo bar" size="cover" testID="badge" />);
