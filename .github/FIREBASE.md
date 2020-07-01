# Firebase

Firebase lets you build more powerful, secure and scalable apps, using world-class infrastructure.

## Analytics

To see hits in realtime, you have to follow these steps:

- Sign in with mobile account to [Firebase console](https://console.firebase.google.com)
- Switch to [DebugView](https://console.firebase.google.com/u/0/project/mobile-app-dace3/analytics/app/android%3Acom.coorpacademy.app/debugview)

##### iOS

You only have to download app from internal store (or to build it locally in debug mode), and that's all.

**Note**: The build in beta isn't (and shouldn't be) in debug mode for any reason, so you can't see hits in realtime. Refer to Firebase documentation to see the latency the hits can take to be shown.

##### Android

The only way to debug hits in realtime, is to tell to the Android device to be in debug mode for our app.
On the device, follow these steps:

- [Enable developer options](https://developer.android.com/studio/debug/dev-options#enable)
- [Enable USB debugging](https://developer.android.com/studio/debug/dev-options#debugging)
- Plug your device to your computer
- Run `adb shell setprop debug.firebase.analytics.app com.coorpacademy.app`
- Restart your app

**Note**: You don't have to run this command after uninstalling the app, but you need for each new device.

Source: [Debugging Events](https://firebase.google.com/docs/analytics/debugview)
