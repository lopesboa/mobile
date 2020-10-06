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
          html: `
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
                <style>
                  html, body {
                    height: 100%;
                    width: 100vw;
                    margin: 0 auto;
                    overflow: hidden;
                    border: none;
                    /*background-color: red;*/
                  }
                  iframe {
                    width: 100%;
                    height: 320px;
                    min-height: 320px;
                    max-height: 320px;
                    overflow: hidden;
                    border: none;
                  }
                </style>
                <script type="text/javascript">
                var callback = function(data) {
                  alert(data)
              }
          
              alert("TEST >>>");
          
              var MESSAGES = {
                  SET_ITEM: 'setItem',
                  GET_ITEM: 'getItem',
              };
          
              var DATABASE = {
                  value: '',
              };
          
              // Android
              document.addEventListener('message', receiveMessage, false);
              // iOS
              window.addEventListener('message', receiveMessage, false);
          
              function receiveMessage(message) {
                  // alert('message received from JS side');
                  // alert(message.data);
              }
          
              function createMessage(type, key, data) {
              if (type === MESSAGES.SET_ITEM) {
                  return JSON.stringify({
                  type,
                  data,
                  });
              }
              if (type === MESSAGES.GET_ITEM) {
                  return JSON.stringify({
                  type,
                  key,
                  });
              }
              return JSON.stringify({
                  type,
              });
              }
              // var message = createMessage(MESSAGES.GET_ITEM, 'varName', {});
              // alert(message);
              // window.ReactNativeWebView.postMessage(message);
          
              window.API = {};
              window.API_1484_11 = {};
          
              window.scormStatus = {
              lesson_status: '',
              score_raw: 0,
              score_max: 100,
              score_min: 0,
              session_time: 0,
              detailed_answers: {},
              };
          
              function getValue(key) {
              var varName = prefix + key;
              window.ReactNativeWebView.postMessage(createMessage(MESSAGES.GET_ITEM, varName));
          
              var value = DATABASE.value;
          
              if (key === 'cmi.student_preference.language') {
                  return value || language;
              }
          
              if (value === null) {
                  if (varName.includes('_count', this.length - '_count'.length)) {
                  window.ReactNativeWebView.postMessage(createMessage(MESSAGES.SET_ITEM, varName, 0));
                  return 0;
                  } else {
                  window.ReactNativeWebView.postMessage(createMessage(MESSAGES.SET_ITEM, varName, ''));
                  return '';
                  }
              }
              return value;
              }
          
              window.API.LMSInitialize = function () {
              alert('LMSInitialize');
              return true;
              };
          
              window.API.LMSTerminate = function () {
              alert('LMSTerminate');
              return true;
              };
          
              window.API.LMSGetValue = getValue;
          
              window.API.LMSSetValue = function (varname, varvalue) {
              varname = prefix + varname;
          
              var m = varname.match(/(\d+)\.cmi\.interactions\.(\d+)\.id/);
              if (m !== null) {
                  window.ReactNativeWebView.postMessage(createMessage(MESSAGES.SET_ITEM, '{{scorm.id}}.cmi.interactions._count', parseInt(m[2]) + 1));
              }
              
              m = varname.match(/(\d+)\.cmi\.interactions\.(\d+)\.result/);
              if (m !== null) {
                  window.ReactNativeWebView.postMessage(createMessage(MESSAGES.GET_ITEM, prefix + 'cmi.interactions.' + parseInt(m[2]) + '.id'));
                  window.scormStatus.detailed_answers[key] = varvalue;
              }
              
              if (varname === prefix + 'cmi.core.lesson_status') window.scormStatus.lesson_status = varvalue;
              if (varname === prefix + 'cmi.core.score.raw') window.scormStatus.score_raw = varvalue;
              if (varname === prefix + 'cmi.core.score.max') window.scormStatus.score_max = varvalue;
              if (varname === prefix + 'cmi.core.score.min') window.scormStatus.score_min = varvalue;
              if (varname === prefix + 'cmi.core.session_time') window.scormStatus.session_time = varvalue;
              
              window.ReactNativeWebView.postMessage(createMessage(MESSAGES.SET_ITEM, varname, varvalue));
          
              return varvalue;
              };
          
              window.API.LMSCommit = function () {
              callback(window.scormStatus);
              return true;
              };
          
              window.API.LMSFinish = function () {
              alert('LMSFinish');
              return true;
              };
          
              window.API.LMSGetLastError = function () {
              alert('LMSGetLastError');
              return 0;
              };
          
              window.API.LMSGetErrorString = function () {
              alert('LMSGetErrorString');
              return '';
              };
          
              window.API.LMSGetDiagnostic = function () {
              alert('LMSGetDiagnostic');
              return '';
              };
          
              window.API_1484_11.Initialize = function () {
              alert('Initialize');
              return true;
              };
          
              window.API_1484_11.LMSTerminate = function () {
              alert('LMSTerminate');
              return true;
              };
          
              window.API_1484_11.GetValue = getValue;
          
              window.API_1484_11.SetValue = function (varname, varvalue) {
              varname = prefix + varname;
          
              var m = varname.match(/(\d+)\.cmi\.interactions\.(\d+)\.id/);
              if (m !== null) {
                  window.ReactNativeWebView.postMessage(createMessage(MESSAGES.SET_ITEM, '{{scorm.id}}.cmi.interactions._count', parseInt(m[2]) + 1));
              }
              
              m = varname.match(/(\d+)\.cmi\.interactions\.(\d+)\.result/);
              if (m !== null) {
                  window.ReactNativeWebView.postMessage(createMessage(MESSAGES.GET_ITEM, prefix + 'cmi.interactions.' + parseInt(m[2]) + '.id'));
                  window.scormStatus.detailed_answers[key] = varvalue;
              }
              
              if (varname === prefix + 'cmi.core.lesson_status') window.scormStatus.lesson_status = varvalue;
              if (varname === prefix + 'cmi.core.score.raw') window.scormStatus.score_raw = varvalue;
              if (varname === prefix + 'cmi.core.score.max') window.scormStatus.score_max = varvalue;
              if (varname === prefix + 'cmi.core.score.min') window.scormStatus.score_min = varvalue;
              if (varname === prefix + 'cmi.core.session_time') window.scormStatus.session_time = varvalue;
              
              window.ReactNativeWebView.postMessage(createMessage(MESSAGES.SET_ITEM, varname, varvalue));
              return varvalue;
              };
          
              window.API_1484_11.Commit = function () {
              callback(window.scormStatus);
              return true;
              };
          
              window.API_1484_11.Terminate = function () {
              alert('Terminate');
              return true;
              };
          
              window.API_1484_11.GetLastError = function () {
              alert('GetLastError');
              return 0;
              };
          
              window.API_1484_11.GetErrorString = function () {
              alert('GetErrorString');
              return '';
              };
          
              window.API_1484_11.GetDiagnostic = function () {
              alert('GetDiagnostic');
              return '';
              };
          
              true;
                </script>
              </head>
              <body>
              <p>HELLO</p>
                <iframe src="https://demo-scorm.coorpacademy.com/scorm/api.coorpacademy.com/25f9ef2a-234d-437c-9690-114981fdf23d.zip/index_lms.html"/>
                </body>
            </html>
           `,
          // uri:
          //   'https://demo-scorm.coorpacademy.com/scorm/api.coorpacademy.com/25f9ef2a-234d-437c-9690-114981fdf23d.zip/index_lms.html',
          //   'https://coorpacademy.com',
        }}
        originWhitelist={['*']}
        // allowsInlineMediaPlayback
        // injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT}
        javaScriptEnabled
        injectedJavaScript={`alert(MESSAGES)`}
        style={styles.browser}
      />
    </Screen>
  );
};

export default React.memo(Scorm);
