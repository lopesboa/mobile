/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"
#import "Orientation.h"
#import <React/RCTLinkingManager.h>
#import "RNFirebaseLinks.h"

@import Firebase;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return  [[RNFirebaseLinks instance] application:application openURL:url options:options];
}

// To support universal links
// Source: https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/UniversalLinks.html
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
  return [[RNFirebaseLinks instance] application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSString *plistPath = [[NSBundle mainBundle] pathForResource:@"Info" ofType:@"plist"];
  NSDictionary *plistConfig = [[NSDictionary alloc] initWithContentsOfFile:plistPath];

  // Firebase
  BOOL isFirebaseDebugEnabled = [[plistConfig valueForKey:@"FirebaseDebugEnabled"] boolValue];
  NSLog(@"Firebase debug %s.", isFirebaseDebugEnabled ? "enabled" : "disabled");

  NSMutableArray *newArguments = [NSMutableArray arrayWithArray:[[NSProcessInfo processInfo] arguments]];
  if (isFirebaseDebugEnabled) {
    [newArguments addObject:@"-FIRAnalyticsDebugEnabled"];
    [newArguments addObject:@"-FIRDebugEnabled"];
  } else {
    [newArguments addObject:@"-FIRAnalyticsDebugDisabled"];
    [newArguments addObject:@"-FIRDebugDisabled"];
  }
  [[NSProcessInfo processInfo] setValue:[newArguments copy] forKey:@"arguments"];

  [FIROptions defaultOptions].deepLinkURLScheme = @"coorpacademyapp";
  [FIRApp configure];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Coorpacademy"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  // Splashscreen
  [RNSplashScreen show];

  return YES;
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


@end
