package com.coorpacademy.app;

import android.app.Application;

import org.reactnative.camera.RNCameraPackage;
import org.wonday.pdf.RCTPdfView;
import com.RNFetchBlob.RNFetchBlobPackage;
import org.wonday.orientation.OrientationPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactApplication;
import com.BV.LinearGradient.LinearGradientPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RNCameraPackage(),
          new RNFetchBlobPackage(),
          new RCTPdfView(),
          new OrientationPackage(),
          new ReactVideoPackage(),
          new ReactNativeLocalizationPackage(),
          new SvgPackage(),
          new LinearGradientPackage(),
          new RNGestureHandlerPackage()
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
