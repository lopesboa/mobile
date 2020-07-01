import * as React from "react";
import {connect} from "react-redux";
import {
    createStackNavigator,
    createAppContainer,
    NavigationActions,
} from "react-navigation";
import type {NavigationAction, NavigationState} from "react-navigation";

import HeaderSlideTitle from "../containers/header-slide-title";
import HeaderSettingsTitle from '../components/header-settings-title';
import HeaderSlideRight from "../containers/header-slide-right";
import withUniversalLinks from "../containers/with-universal-links";
import HomeScreen from "../screens/home";
import AuthenticationScreen from "../screens/authentication";
import AuthenticationDetailsScreen from "../screens/authentication-details";
import QRCodeScreen from "../screens/qr-code";
import NotifyMeScreen from '../screens/notifications';
import {changeScreen} from "../redux/actions/navigation";
import SearchScreen from "../screens/search";
import SettingsScreen from '../screens/settings';
import {slideNavigator, slideModalsNavigator} from "./slide";
import pdfNavigator from "./pdf";
import browserNavigator from "./browser";
import navigationOptions, {
    navigationOptionsWithoutHeader,
    HEADER_BACKGROUND_COLOR,
    SETTINGS_SCREEN_HEADER_BACKGROUND_COLOR,
    INITIAL_APP_ROUTE_NAME,
    INITIAL_ROUTE_NAME,
} from "./navigation-options";

const appNavigator = createStackNavigator(
    {
        Authentication: {
            // Keep this HOC in initial screen
            screen: withUniversalLinks(AuthenticationScreen),
            navigationOptions: {
                ...navigationOptionsWithoutHeader,
                gesturesEnabled: false,
            },
        },
        AuthenticationDetails: {
            screen: AuthenticationDetailsScreen,
            navigationOptions: navigationOptionsWithoutHeader,
        },
        Home: {
            screen: HomeScreen,
            navigationOptions: {
                ...navigationOptionsWithoutHeader,
                gesturesEnabled: false,
            },
        },
        Slide: {
            screen: slideNavigator,
            navigationOptions: {
                ...navigationOptions,
                headerStyle: {
                    ...navigationOptions.headerStyle,
                    backgroundColor: HEADER_BACKGROUND_COLOR,
                },
                headerTitle: HeaderSlideTitle,
                headerRight: <HeaderSlideRight />,
                gesturesEnabled: true,
            },
        },
        Search: {
            screen: SearchScreen,
            navigationOptions: {
                ...navigationOptionsWithoutHeader,
                gesturesEnabled: false,
            },
        },
        Settings: {
            screen: SettingsScreen,
            navigationOptions: {
              ...navigationOptions,
              headerStyle: {
                ...navigationOptions.headerStyle,
                backgroundColor: SETTINGS_SCREEN_HEADER_BACKGROUND_COLOR
              },
              headerTitle: HeaderSettingsTitle,
              gesturesEnabled: false
            }
          }
    },
    {
        initialRouteName: INITIAL_ROUTE_NAME,
        defaultNavigationOptions: {
            ...navigationOptions,
            gesturesEnabled: true,
        },
    },
);

const defaultGetStateForAction = appNavigator.router.getStateForAction;

appNavigator.router.getStateForAction = (
    action: NavigationAction,
    state: NavigationState | null | undefined,
) => {
    const disabledScreens = ["Authentication", "Home"];

    if (
        state &&
        action.type === NavigationActions.BACK &&
        disabledScreens.includes(state.routes[state.index].routeName)
    ) {
        // Block back action on Home and Authentication
        return null;
    }

    return defaultGetStateForAction(action, state);
};

const navigator = createStackNavigator(
    {
        App: {screen: appNavigator},
        SlideModal: {screen: slideModalsNavigator},
        PdfModal: {screen: pdfNavigator},
        BrowserModal: {screen: browserNavigator},
        QRCodeModal: { screen: QRCodeScreen },
        NotifyMeModal: {screen: NotifyMeScreen}
    },
    {
        initialRouteName: INITIAL_APP_ROUTE_NAME,
        defaultNavigationOptions: navigationOptionsWithoutHeader,
        headerMode: "none",
        mode: "modal",
    },
);

const Navigator = createAppContainer(navigator);

interface ConnectedDispatchProps  {
  onScreenChange: typeof changeScreen;
};

interface Props extends ConnectedDispatchProps {};

type ExtractScreensResult = {
  currentNavigatorName: string;
  currentAppScreenName?: string;
  currentScreenName?: string;
  currentTabName?: string;
};

const extractScreens = (state: NavigationState): ExtractScreensResult => {
    const rootNavigator = state.routes[state.index];
    const stackNavigator = state.routes[0];
    const appScreen = stackNavigator.routes
        ? stackNavigator.routes[stackNavigator.index]
        : null;
    const screen = rootNavigator.routes
        ? rootNavigator.routes[rootNavigator.index]
        : null;
    const tabs = screen && screen.routes ? screen.routes[screen.index] : null;
    const tab = tabs && tabs.routes ? tabs.routes[tabs.index] : null;

    const currentNavigatorName = rootNavigator.routeName;
    const currentAppScreenName =
        (appScreen && appScreen.routeName) || undefined;
    const currentScreenName = (screen && screen.routeName) || undefined;
    const currentTabName = (tab && tab.routeName) || undefined;

    return {
        currentNavigatorName,
        currentAppScreenName,
        currentScreenName,
        currentTabName,
    };
};

class NavigatorWithState extends React.PureComponent<Props> {
    componentDidMount() {
        this.props.onScreenChange(
            INITIAL_APP_ROUTE_NAME,
            INITIAL_ROUTE_NAME,
            INITIAL_ROUTE_NAME,
        );
    }

    handleNavigationStateChange = (
        prevState: NavigationState,
        currentState: NavigationState,
    ) => {
        const {onScreenChange} = this.props;

        if (!currentState) {
            return null;
        }

        const prevScreens = extractScreens(prevState);
        const currentScreens = extractScreens(currentState);

        // To prevent same navigation dispatch
        if (JSON.stringify(prevScreens) === JSON.stringify(currentScreens)) {
            return null;
        }

        const {
            currentNavigatorName,
            currentAppScreenName,
            currentScreenName,
            currentTabName,
        } = currentScreens;

        if (!currentAppScreenName || !currentScreenName) {
            return null;
        }

        onScreenChange(
            currentNavigatorName,
            currentAppScreenName,
            currentScreenName,
            currentTabName,
        );
    };

    render() {
        // @ts-ignore Bad react-navigation definition with interfaces
        return (
            <Navigator onNavigationStateChange={this.handleNavigationStateChange} />
        );
    }
}

const mapDispatchToProps: ConnectedDispatchProps = {
    onScreenChange: changeScreen,
};

export default connect(
    null,
    mapDispatchToProps,
)(NavigatorWithState);