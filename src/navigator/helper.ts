import {NavigationActions, NavigationContainerComponent} from 'react-navigation';

let navigator: NavigationContainerComponent;

function setTopLevelNavigator(navigatorRef: NavigationContainerComponent): void {
  navigator = navigatorRef;
}

function navigate(routeName: string): void {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
    }),
  );
}

export default {
  navigate,
  setTopLevelNavigator,
};
