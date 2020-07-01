import * as React from 'react';
import {connect} from 'react-redux';

import SelectComponent from '../components/select';
import type {Props as ComponentProps} from '../components/select';
import type {StoreState} from '../redux/store';
import {getFocusedSelect} from '../redux/utils/state-extract';
import {focus, blur} from '../redux/actions/ui/select';

export interface ConnectedStateProps {
  isFocused: boolean;
}

interface ConnectedDispatchProps {
  focus: typeof focus;
  blur: typeof blur;
}

export interface OwnProps {
  id: string;
}

export interface Props extends ConnectedStateProps, ConnectedDispatchProps, OwnProps {
  onBlur: Pick<ComponentProps, 'onBlur'>;
  onFocus: Pick<ComponentProps, 'onFocus'>;
}

class Select extends React.PureComponent<Props> {
  handleFocus = () => this.props.focus(this.props.id);

  handleBlur = () => this.props.blur();

  render() {
    const {
      /* eslint-disable no-unused-vars */
      id,
      /* eslint-enable no-unused-vars */
      ...props
    } = this.props;

    return <SelectComponent {...props} onFocus={this.handleFocus} onBlur={this.handleBlur} />;
  }
}

export const mapStateToProps = (state: StoreState, {id}: OwnProps): ConnectedStateProps => ({
  isFocused: getFocusedSelect(state) === id,
});

const mapDispatchToProps: ConnectedDispatchProps = {
  focus,
  blur,
};

export {Select as Component};
export default connect(mapStateToProps, mapDispatchToProps)(Select);
