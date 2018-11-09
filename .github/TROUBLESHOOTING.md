# TROUBLESHOOTING

## Red screen of the death

On your device, you have a red screen

##### Identified problem

There is something broken between your device and the packager

##### How to resolve

First thing to do is just to start dev task with a light cleanup:

```console
yarn start:clean
```

If you still have issues, try a more effective command that will rebuild the entire project:

```console
yarn start:[ios|android]:clean
```

If you still have issue(s), take a look at Flow errors, it might help you

## Node-gyp dependency installation error

##### Identified problem

Node binary is broken

##### How to resolve

Reinstall Node

## iOS: Failed to install the requested application

When running app on iOS, if you get this:

    Print: Entry, ":CFBundleIdentifier", Does Not Exist
    // or
    boost/iterator/iterator_adaptor.hpp’ file not found

##### Identified problem

The React Native cache is not up to date (commonly when you have many RN projects with different versions)

##### How to resolve

Just delete react-native shared cache

```console
rm -rf ~/.rncache
```

Then (re)start your iOS/Android command.

**Source**: https://github.com/facebook/react-native/issues/14423

## iOS: library not found for -lPods-Coorpacademy

`clang: error: linker command failed with exit code 1 (use -v to see invocation)`

##### Identified problem

You didn't open the workspace with Xcode.

##### How to resolve

If you don't see the workspace on Xcode home screen

1.  close your Xcode
2.  launch the command `yarn start:ios`
3.  you should now see the workspace

## iOS: "**\*\***" profile is missing.

##### Identified problem

If you are seeing this error, you need to be sure that your Xcode is connected to the right developer account (you can connect many).
In order to do this, just go to Xcode preferences > `Account` then add the proper Apple ID.
Then go in the app target view, "General", then click on the Status "Download" button, you should get the correct provisioning profile.
If you don't see the button, it's that you are not connected with the right Apple ID associated with the certificate or that you are not in the correct team. In this case, reach a co-worker.

If you still have a warning near the provisioning profile, that's probably because:

- Your developer machine is not configured and certified for the associated Apple ID
- Your iOS device UDID (use iTunes, iOS device detail > click on "Serial Number", it should change to UDID).

##### How to resolve

Manually: Sign in to the [Apple developer console](https://developer.apple.com) and download it manually.

Automatically: Run `yarn pull:certificates`

Note: if the command above doesn't solved your issue, you will have to regenerate the provisioning profile using [Match](FASTLANE.md#match).

**Note**: when you do that, you may have to update the `*.xcodeproj/project/pbxproj` file in the repo, and warn your coworkers about this update so they re-download the provisioning profile.

## iOS: iPhone has denied the launch request

##### Identified problem

The needed provisioning profile is missing on your iOS device.

##### How to resolve

In order to fix the problem, you will have to download from your device the proper provisioning profile using [Match](FASTLANE.md#match)
Alternatively, you can upload the one you have from your computer directly on your iOS device.
In order to do this, from Xcode

- click on the device dropdown > "Add Additional Simulators" > "Device" tab
- Right click on your iOS device > "Show Provisioning Profiles"
- Drag & drop provisioning profiles, that may have been downloaded or grabbed from `~/Library/MobileDevice/Provisioning Profiles`

If you still have this issue, you may have problems with the provisioning profile you are using. Be careful of using a "iOS Development".

## iOS: The executable was signed with invalid entitlements

> The entitlements specified in your application’s Code Signing Entitlements file are invalid, not permitted, or do not match those specified in your provisioning profile. (0xE8008016).

##### Identified problem

Your app target (commonly: `****Tests`) doesn't have the correct Signing Certificate scope.

##### How to resolve

Update the certificate entitlements in your Xcode project or [Apple developer console](https://developer.apple.com) to add the missing one.

## iOS: A valid provisioning profile for this executable was not found

##### Identified problem

You have probably bad (out of date) provisioning profile.

##### How to resolve

The easiest way to fix this is

- close Xcode
- if you can identify your out of date Provisioning Profiles, go to `~/Library/MobileDevice/Provisioning Profiles` and delete them
- go to your project folder
- use [match](FASTLANE.md#match)

## Could not write to device

First, just try to build again. Sometimes it happens.

##### Identified problem

You haven't enough free space on your device

##### How to resolve

Delete apps

## iOS: codesign --> Embed Pods Framework

This error can be encoutered during build phase and have been detected on build server. If you see error of following kind :

> PhaseScriptExecution [CP]\ Embed\ Pods\ Frameworks /Users/par-mac001/Library/Developer/Xcode/DerivedData/ADM-ggzbiudrndpgrogmvidccedtiiyi/Build/Intermediates.noindex/ArchiveIntermediates/ADM/IntermediateBuildFilesPath/ADM.build/Release-iphoneos/ADM.build/Script-8B3F0FDA5311C517B7BE2B37.sh
> (1 failure)
> [...]

> /usr/bin/codesign --force --sign 143F73CE32254811A1B4AF7D929AC232C7BD9229 --preserve-metadata=identifier,entitlements '/Users/par-mac001/Library/Developer/Xcode/DerivedData/ADM-ggzbiudrndpgrogmvidccedtiiyi/Build/Intermediates.noindex/ArchiveIntermediates/ADM/InstallationBuildProductsLocation/Applications//ADM.app/Frameworks/ATAnalytics.framework'

##### Identified problem

It's probably an error with codesigning because `Embed Pods Framework` is the last things that is signed.

##### How to resolve

Check certificates, provisioning profiles and/or keychain write.
