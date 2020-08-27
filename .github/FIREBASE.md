# Firebase

Firebase lets you build more powerful, secure and scalable apps, using world-class infrastructure.

## Analytics

### ⚙️ Add bridge between Firebase and Google Analytics ⚙️ 

#### In the App :

Just add event dispatching method where you need to in the mobile app. 

**Note**: Adapt this code to meet your own needs:
```javascript
import {Services} from '../../../services';

services.Analytics.logEvent(ANALYTICS_EVENT_TYPE.NOTIFICATIONS, {id: 'schedule', type: 'finish-course', value: 1});
```

⚠ **Important Note** ⚠ No need to change the container json files in the android and iOS folders of your project.



#### In the GTM Console:

1. Go to Google Tag Manager Console. 
2. Select Mobile iOS: 
![image](https://user-images.githubusercontent.com/712986/91308908-3b195e00-e7b0-11ea-974f-1c8f6469a52f.png)

3. Creating a Tag: 
   - Tags > "New"
   ![image](https://user-images.githubusercontent.com/712986/91309266-ab27e400-e7b0-11ea-95f3-0a7a698d94bf.png)
   
   - Select "Tag configuration"
   ![image](https://user-images.githubusercontent.com/712986/91309371-d01c5700-e7b0-11ea-8b1b-ad144b53db54.png)
   
   - Choose "Google Analytics — Universal Analytics”
   ![image](https://user-images.githubusercontent.com/712986/91309532-ff32c880-e7b0-11ea-8665-683ce1ee6e8b.png)
   
   - Setup the Tag according to your needs. 
   ![image](https://user-images.githubusercontent.com/712986/91309603-12de2f00-e7b1-11ea-9743-3e29ef84461c.png)
   

Now we need to create some trigger to activate the tag and enable data to be dispatched to GA:

5. Creating a Trigger
   - Create a Trigger (click the Triggering card) 
   ![image](https://user-images.githubusercontent.com/712986/91309716-3dc88300-e7b1-11ea-9669-a1c676f82be3.png)
   
   - Click on the "+" button
   ![image](https://user-images.githubusercontent.com/712986/91311792-c6482300-e7b3-11ea-9106-cc4b9f33c0c0.png)

   - Choose 'Custom'
   ![image](https://user-images.githubusercontent.com/712986/91311852-d8c25c80-e7b3-11ea-8af7-5d12bf5784c1.png)

   - Setup the trigger according to your needs. 
   ![image](https://user-images.githubusercontent.com/712986/91311905-ea0b6900-e7b3-11ea-8821-022224b7f7bc.png)

   - Click Save
   
6. When trigger and tag saved you should see the submit button indicating the number of changes in the workspace, click "SUBMIT"
![image](https://user-images.githubusercontent.com/712986/91311990-ff809300-e7b3-11ea-9697-b6e48050b9e6.png)

then you can add name or comments to this version or just SKIP and "PUBLISH"
![image](https://user-images.githubusercontent.com/712986/91312004-03acb080-e7b4-11ea-8de8-130ba6e88f9a.png)


⚠️ Make sure to reproduce those operations in "Mobile Android" to match what you just did in "Mobile iOS".

You should be good to go. 


See this [tutorial](https://proandroiddev.com/google-analytics-with-gtm-and-firebase-b4bdc80a0637) for more info about how to setup firebase, GTM and GoogleAnalytics. 

### 🚀 Test in real time 🚀

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


