## Required Tools

- [Android Studio (SDK Included) ](https://developer.android.com/studio/)

  Please refer to the specific [Android Section](#android-studio) to know more about.

- [HomeBrew](https://brew.sh/), the macOS package manager

  ```bash
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  ```

* XCode, the mac OS builder

  First check your XCode version

  ```
  xcodebuild -version
  ```

  If your current version is `>= 10.1.0` your good to continue. Else, follow the instruction process [here](https://developer.apple.com/download/more/)

- Xcode Command Line Tools

  ```bash
  xcode-select --install
  ```

* Fastlane, the mobile toolbox

  ```bash
  # Using RubyGems
  sudo gem install fastlane -NV

  # Alternatively using Homebrew
  brew cask install fastlane
  ```

  If you've installed fastlane through `brew`, add this to your profile file (`bash_profile`, ...)

  ```
  export PATH="$HOME/.fastlane/bin:$PATH"
  ```

  To know more about Fastlane, please read [this article](./FASTLANE.md).

- Cocoapod, the IOS package manager

  ```
  # Using RubyGems
  sudo gem install cocoapods

  # Alternatively using Homebrew
  brew  install cocoapods
  ```

- [Detox](https://github.com/wix/Detox/blob/master/docs/Introduction.GettingStarted.md), the e2e test runner

  ```sh
  brew tap wix/brew
  brew tap facebook/fb

  brew install applesimutils
  brew install fbsimctl --HEAD
  ```

# Install the dependencies

```bash
yarn install
```

# Configure your tools

## Android Studio

### Why Android Studio ?

According to the offcial webpage `Android Studio provides the fastest tools for building apps on every type of Android device`. Those tools includes the emulator manager (avdmanager) and sdk manager (to install java sdk dependencies).

### Configuration :

After the application installation you will have to configure it.

1. Click on the `toothed wheel` icon and select `SDK Manager`
2. On the left panel, under `system setting`, click on `SDK settings`

   2.1 Select the SDKs platform from Android v9.0 to v.4.1.

   2.2 In SDK tools, add `Google Play` services and `NDK`

   2.3 Leave the packages checked by default and then click on apply

   2.4 Go grab a Martini :cocktail:, the installation could be a bit long ...

   2.5 Open Android Studio and click `Open Existing Project` and select the `android folder` located at your `repo root`

3. Update your profile file (`.bash_profile`, `.zshrc`) with those lines :

   ```bash
   export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_SDK_ROOT/tools
   export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
   ```

4. Add an android emulator.

Define the API (Android version) you want to used for your emulator (refer to the `minSdkVersion` in `android/build.gradle` to know the min version you can use):

```
export API_VERSION=19
```

Install the dependencies used by your emulator:

```
sdkmanager "system-images;android-${API_VERSION};google_apis;x86"
```

And create the AVD (Android Virtual Device):

```
echo no | avdmanager create avd --force --name "Nexus_5X_API_${API_VERSION}" --abi google_apis/x86 --package "system-images;android-${API_VERSION};google_apis;x86" --device "Nexus 5X"
```

**Note**: Don't forget to add `<ANDROID_SDK_ROOT>/tools/bin` to your `PATH`.
**Note**: You can use other emulator manager than AVD to manager your emulators, ie: `Genymotion`
