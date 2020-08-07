import * as React from 'react';

type Params = Record<string, unknown>;

export const navigationRef = React.createRef();

export function navigate(name: string, params?: Params) {
  navigationRef.current.navigate(name, params);
}
