import * as React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {WebView} from 'react-native-webview';
import fetch from '../modules/fetch';

import Screen from '../components/screen';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
import {INJECTED_JAVASCRIPT} from './scorm-script';

export type Params = {
  url: string;
};

// type Props = NavigationScreenProps<Params>;

const styles = StyleSheet.create({
  browser: {
    flex: 1,
  },
});

const Scorm = (props: Props) => {
  const webView = React.useRef(null);
  const {itemRef} = props.route.params;
  // console.log({itemRef});
  async function fetchYea() {
    const response = await fetch(
      `https://demo-scorm.coorpacademy.com/api/v2/externalCourses?conditions={"externalContents.ref":"${itemRef}"}`,
      {
        headers: {
          authorization:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJob3N0IjoiaHR0cHM6Ly9kZW1vLXNjb3JtLmNvb3JwYWNhZGVteS5jb20iLCJ1c2FnZSI6Im1vYmlsZSIsInVzZXIiOiI1ZjRlMWViNTI4MjgwZTAwNDJmZjMxOTYiLCJncmFudHMiOnsibW9vYyI6eyJncmFudHMiOnsiZGVtby1zY29ybSI6eyJyb2xlcyI6WyJhZG1pbiIsInVzZXIiLCJyaCIsImdvZG1vZGUiLCJjbXMiLCJzeXN0ZW0iXX19fX0sImlhdCI6MTYwMTg5OTk5OSwiZXhwIjoxNjMxODk5OTk5LCJpc3MiOiJjb29ycGFjYWRlbXktand0In0.gtsPSLAL4OhRF8fgPvj0rpWjV0yE4P4p_w51RvibsUI',
        },
      },
    );
    const realResponse = await response.json();

    // const responseUrl = await fetch(
    //   'https://demo-scorm.coorpacademy.com/scorm/api.coorpacademy.com/25f9ef2a-234d-437c-9690-114981fdf23d.zip',
    //   {
    //     headers: {
    //       authorization:
    //         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJob3N0IjoiaHR0cHM6Ly9kZW1vLXNjb3JtLmNvb3JwYWNhZGVteS5jb20iLCJ1c2FnZSI6Im1vYmlsZSIsInVzZXIiOiI1ZjRlMWViNTI4MjgwZTAwNDJmZjMxOTYiLCJncmFudHMiOnsibW9vYyI6eyJncmFudHMiOnsiZGVtby1zY29ybSI6eyJyb2xlcyI6WyJhZG1pbiIsInVzZXIiLCJyaCIsImdvZG1vZGUiLCJjbXMiLCJzeXN0ZW0iXX19fX0sImlhdCI6MTYwMTg5OTk5OSwiZXhwIjoxNjMxODk5OTk5LCJpc3MiOiJjb29ycGFjYWRlbXktand0In0.gtsPSLAL4OhRF8fgPvj0rpWjV0yE4P4p_w51RvibsUI',
    //     },
    //   },
    // );

    // const url = await responseUrl.text();
    // console.log({url});
  }
  React.useEffect(() => {
    fetchYea();
  }, []);

  let msg = 'Hello there';
  return (
    <Screen noSafeArea noScroll testID="browser-screen">
      <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
      <WebView
        ref={webView}
        onMessage={async (message) => {
          console.info('message received', {message});
          const parsedMessage = JSON.parse(message.nativeEvent.data);
          if (parsedMessage.type === 'getItem') {
            const item = await AsyncStorage.getItem(parsedMessage.key);
            console.log('got Item', {item});
            webView.current.postMessage(
              JSON.stringify({
                type: 'resolvedItem',
                data: item,
              }),
            );
          }
          if (parsedMessage.type === 'setItem') {
            console.log('setting item');
            await AsyncStorage.setItem(parsedMessage.key, parsedMessage.data);
            console.log('set item');
          }
          // webView.current.postMessage('Hello from JS');
        }}
        source={{
          // html: `
          //   <html>
          //     <head>
          //       <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
          //       <style>
          //         html, body {
          //           height: 100%;
          //           width: 100vw;
          //           margin: 0 auto;
          //           overflow: hidden;
          //           border: none;
          //           /*background-color: red;*/
          //         }
          //         iframe {
          //           width: 100%;
          //           height: 320px;
          //           min-height: 320px;
          //           max-height: 320px;
          //           overflow: hidden;
          //           border: none;
          //         }
          //       </style>
          //     </head>
          //     <body>
          //       <iframe src="https://demo-scorm.coorpacademy.com/scorm/api.coorpacademy.com/25f9ef2a-234d-437c-9690-114981fdf23d.zip/index_lms.html"/>
          //       </body>
          //   </html>
          // `,
          uri:
            'https://demo-scorm.coorpacademy.com/scorm/api.coorpacademy.com/25f9ef2a-234d-437c-9690-114981fdf23d.zip/index_lms.html',
          //   'https://coorpacademy.com',
        }}
        originWhitelist={['*']}
        // allowsInlineMediaPlayback
        injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT}
        // injectedJavaScript={INJECTED_JAVASCRIPT}
        style={styles.browser}
      />
    </Screen>
  );
};

export default React.memo(Scorm);
