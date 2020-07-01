import * as React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import type {User} from '../types';
import type {StoreState} from '../redux/store';
import {getUser} from '../redux/utils/state-extract';

export interface ConnectedStateProps {
  user: User | null;
}

interface Props extends ConnectedStateProps {
  children: React.ReactNode;
}

type State = User | null;

export const initialState: State = null;

export const UserContext: React.Context<State> = React.createContext(initialState);

const UserProvider = ({children, user}: Props) => (
  <UserContext.Provider value={user}>{children}</UserContext.Provider>
);

const getUserState = createSelector([getUser], (user) => user);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  user: getUserState(state),
});

export {UserProvider as Component};
export default connect(mapStateToProps)(UserProvider);
