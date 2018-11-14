## Required Tools

- [Android Studio (SDK Included) ](https://developer.android.com/studio/)

- [XCode](https://developer.apple.com/xcode/)

- Xcode Command Line Tools

  ```bash
  xcode-select --install
  ```

- Fastlane

  ```bash
  # Using RubyGems
  sudo gem install fastlane -NV

  # Alternatively using Homebrew
  brew cask install fastlane
  ```

- Cocoapod, the IOS package manager

  ```
  # Using RubyGems
  sudo gem install cocoapods

  # Alternatively using Homebrew
  brew  install cocoapods
  ```

# Configuration

## Android Studio SDK configuration

After the application installation you will have to configure it.

1. Click on the `toothed wheel` icon and select `SDK Manager`
2. On the left panel, under `system setting`, click on `SDK settings`

   2.1 Select the SDKs platform from Android v9.0 to v.4.1.

   2.2 In SDK tools, add `Google Play` services and `NDK`

   2.3 Leave the packages checked by default and then click on apply

   2.4 Go grab a Martini :cocktail:, the installation could be a bit long ...

3. Update your profile file (`.bash_profile`, `.zshrc`)

   ```bash
   export ANDROID_SDK_ROOT=/Users/<user>/Library/Android/sdk

   ```

   ... and add this lone your PATH

   ```
   $ANDROID_SDK_ROOT/tools:$ANDROID_SDK_ROOT/platform-tools
   ```

4. Add an android emulator.

On `Android studio`, on the main Toolbar click on `View` and check `Toolbar`.

On the toolbar menu click on this icon ![Add Emulator Icon](./icon.png) to add and launch an emulator

# Install the dependencies

```bash
npm install
```

## That's all folks !
