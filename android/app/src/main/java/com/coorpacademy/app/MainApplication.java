package com.coorpacademy.app;

import android.support.multidex.MultiDexApplication;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.mkuczera.RNReactNativeHapticFeedbackPackage;
import com.facebook.react.modules.email.EmailPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import org.reactnative.camera.RNCameraPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.horcrux.svg.SvgPackage;
import org.wonday.orientation.OrientationPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import org.wonday.pdf.RCTPdfView;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.soloader.SoLoader;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.links.RNFirebaseLinksPackage;


import java.util.Arrays;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNReactNativeHapticFeedbackPackage(),
            new EmailPackage(),
            new RNSoundPackage(),
            new RNCWebViewPackage(),
            new AsyncStoragePackage(),
            new RNCameraPackage(),
            new ReactVideoPackage(),
            new SvgPackage(),
            new OrientationPackage(),
            new ReactNativeLocalizationPackage(),
            new LinearGradientPackage(),
            new RNFetchBlobPackage(),
            new RCTPdfView(),
            new RNGestureHandlerPackage(),
            new RNDeviceInfo(),
            new RNFirebasePackage(),
            new RNFirebaseAnalyticsPackage(),
            new RNFirebaseLinksPackage(),
            new SplashScreenReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
