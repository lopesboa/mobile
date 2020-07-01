import * as React from 'react';

type Props = React.ReactElement<'svg'>;

class Component extends React.Component<Props> {}

export type Icon = typeof Component;
