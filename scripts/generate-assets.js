// @flow

import path from 'path';

import imagemagick from 'imagemagick';
import mkdirp from 'mkdirp';

import app from '../app';

type AndroidDrawableType = 'mdpi' | 'hdpi' | 'xhdpi' | 'xxhdpi' | 'xxxhdpi';

type IosDockIconFileType =
  | '76'
  | '167'
  | '152'
  | '1024'
  | '20@2x'
  | '20@3x'
  | '29@2x'
  | '29@3x'
  | '40@2x'
  | '40@3x'
  | '60@2x'
  | '60@3x';

const IMAGES_PATH = './src/assets/images';
const DOCK_ICON_BACKGROUND_FILENAME = 'dock-icon-background.png';
const DOCK_ICON_FOREGROUND_FILENAME = 'dock-icon-foreground.png';
const IOS_DOCK_ICON_PATH = `./ios/${app.name}/Images.xcassets/AppIcon.appiconset`;
const ANDROID_RES_PATH = './android/app/src/main/res';

const generateAndroidLegacyDockIcon = (drawableName: AndroidDrawableType, isRounded? = false) => {
  const sizes: {
    [key: AndroidDrawableType]: {[key: 'width' | 'height']: number},
  } = {
    mdpi: {width: 48, height: 48},
    hdpi: {width: 72, height: 72},
    xhdpi: {width: 96, height: 96},
    xxhdpi: {width: 144, height: 144},
    xxxhdpi: {width: 192, height: 192},
  };
  const {width, height} = sizes[drawableName];
  const outputPath = path.join(
    ANDROID_RES_PATH,
    'mipmap-' + drawableName,
    isRounded ? 'ic_launcher_round.png' : 'ic_launcher.png',
  );
  const borderRadius = parseInt(89.825 * 2);
  const options: Array<string> = [
    path.join(IMAGES_PATH, DOCK_ICON_BACKGROUND_FILENAME),
    path.join(IMAGES_PATH, DOCK_ICON_FOREGROUND_FILENAME),
    '-composite',
    '-background',
    'none',
    '-alpha',
    'remove',
    '-matte',
    '-bordercolor',
    'none',
    '(',
    '+clone',
    '-alpha',
    'extract',
    '-draw',
    'fill black polygon 0,0 0,' +
      borderRadius +
      ' ' +
      borderRadius +
      ',0 fill white circle ' +
      borderRadius +
      ',' +
      borderRadius +
      ' ' +
      borderRadius +
      ',0',
    '(',
    '+clone',
    '-flip',
    ')',
    '-compose',
    'Multiply',
    '-composite',
    '(',
    '+clone',
    '-flop',
    ')',
    '-compose',
    'Multiply',
    '-composite',
    ')',
    '-border',
    '20',
    '-alpha',
    'off',
    '-compose',
    'CopyOpacity',
    '-composite',
    '-resize',
    width + 'x' + height,
    outputPath,
  ];
  // eslint-disable-next-line no-console
  console.log('[DOCK ICON]', 'Generating', outputPath);
  imagemagick.convert(options, (error?: Error) => {
    if (error) {
      throw error;
    }
  });
};

const generateAndroidAdaptiveDockIcon = (
  drawableName: AndroidDrawableType,
  isForeground?: boolean,
) => {
  const sizes: {
    [key: AndroidDrawableType]: {[key: 'width' | 'height']: number},
  } = {
    mdpi: {width: 108, height: 108},
    hdpi: {width: 162, height: 162},
    xhdpi: {width: 216, height: 216},
    xxhdpi: {width: 324, height: 324},
    xxxhdpi: {width: 432, height: 432},
  };
  const {width, height} = sizes[drawableName];
  const outputPath = path.join(
    ANDROID_RES_PATH,
    'mipmap-' + drawableName,
    isForeground ? 'ic_launcher_foreground.png' : 'ic_launcher_background.png',
  );
  const options: Array<string> = [
    path.join(
      IMAGES_PATH,
      isForeground ? DOCK_ICON_FOREGROUND_FILENAME : DOCK_ICON_BACKGROUND_FILENAME,
    ),
    '-resize',
    width + 'x' + height,
    outputPath,
  ];
  // eslint-disable-next-line no-console
  console.log('[DOCK ICON]', 'Generating', outputPath);
  imagemagick.convert(options, (error?: Error) => {
    if (error) {
      throw error;
    }
  });
};

const generateIosDockIcon = (fileName: IosDockIconFileType) => {
  const sizes: {
    [key: IosDockIconFileType]: {[key: 'width' | 'height']: number},
  } = {
    '20@2x': {width: 40, height: 40},
    '20@3x': {width: 60, height: 60},
    '76': {width: 76, height: 76},
    '152': {width: 152, height: 152},
    '167': {width: 167, height: 167},
    '29@2x': {width: 58, height: 58},
    '29@3x': {width: 87, height: 87},
    '40@2x': {width: 80, height: 80},
    '40@3x': {width: 120, height: 120},
    '60@2x': {width: 120, height: 120},
    '60@3x': {width: 180, height: 180},
    '1024': {width: 1024, height: 1024},
  };
  const {width, height} = sizes[fileName];
  mkdirp(path.join(IOS_DOCK_ICON_PATH));
  const outputPath = path.join(IOS_DOCK_ICON_PATH, 'icon-dock-' + fileName + '.png');
  const options: Array<string> = [
    path.join(IMAGES_PATH, DOCK_ICON_BACKGROUND_FILENAME),
    path.join(IMAGES_PATH, DOCK_ICON_FOREGROUND_FILENAME),
    '-composite',
    '-resize',
    width + 'x' + height,
    outputPath,
  ];
  // eslint-disable-next-line no-console
  console.log('[DOCK ICON]', 'Generating', outputPath);
  imagemagick.convert(options, (error?: Error) => {
    if (error) {
      throw error;
    }
  });
};

// iOS
generateIosDockIcon('20@2x');
generateIosDockIcon('20@3x');
generateIosDockIcon('29@2x');
generateIosDockIcon('29@3x');
generateIosDockIcon('40@2x');
generateIosDockIcon('40@3x');
generateIosDockIcon('60@2x');
generateIosDockIcon('60@3x');
generateIosDockIcon('76');
generateIosDockIcon('152');
generateIosDockIcon('167');
generateIosDockIcon('1024');

// Android legacy (before API 26)
generateAndroidLegacyDockIcon('mdpi');
generateAndroidLegacyDockIcon('hdpi');
generateAndroidLegacyDockIcon('xhdpi');
generateAndroidLegacyDockIcon('xxhdpi');
generateAndroidLegacyDockIcon('xxxhdpi');
generateAndroidLegacyDockIcon('mdpi', true);
generateAndroidLegacyDockIcon('hdpi', true);
generateAndroidLegacyDockIcon('xhdpi', true);
generateAndroidLegacyDockIcon('xxhdpi', true);
generateAndroidLegacyDockIcon('xxxhdpi', true);

// Android adaptive (API 26 and later)
generateAndroidAdaptiveDockIcon('mdpi');
generateAndroidAdaptiveDockIcon('hdpi');
generateAndroidAdaptiveDockIcon('xhdpi');
generateAndroidAdaptiveDockIcon('xxhdpi');
generateAndroidAdaptiveDockIcon('xxxhdpi');
generateAndroidAdaptiveDockIcon('mdpi', true);
generateAndroidAdaptiveDockIcon('hdpi', true);
generateAndroidAdaptiveDockIcon('xhdpi', true);
generateAndroidAdaptiveDockIcon('xxhdpi', true);
generateAndroidAdaptiveDockIcon('xxxhdpi', true);
