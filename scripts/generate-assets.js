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
const DOCK_ICON_FILENAME = 'dock-icon.png';
const IOS_DOCK_ICON_PATH = `./ios/${app.name}/Images.xcassets/AppIcon.appiconset`;
const ANDROID_RES_PATH = './android/app/src/main/res';

const generateAndroidDockIcon = (
  drawableName: AndroidDrawableType,
  isRounded?: boolean = false
) => {
  const sizes: {
    [key: AndroidDrawableType]: {[key: 'width' | 'height']: number}
  } = {
    mdpi: {width: 48, height: 48},
    hdpi: {width: 72, height: 72},
    xhdpi: {width: 96, height: 96},
    xxhdpi: {width: 144, height: 144},
    xxxhdpi: {width: 192, height: 192}
  };
  const {width, height} = sizes[drawableName];
  const outputPath = path.join(
    ANDROID_RES_PATH,
    'mipmap-' + drawableName,
    isRounded ? 'ic_launcher_round.png' : 'ic_launcher.png'
  );
  const options: Array<string> = [
    path.join(IMAGES_PATH, DOCK_ICON_FILENAME),
    '-resize',
    '768x768',
    '-bordercolor',
    'none',
    '-border',
    '128',
    '-resize',
    width + 'x' + height,
    outputPath
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
    [key: IosDockIconFileType]: {[key: 'width' | 'height']: number}
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
    '1024': {width: 1024, height: 1024}
  };
  const {width, height} = sizes[fileName];
  mkdirp(path.join(IOS_DOCK_ICON_PATH));
  const outputPath = path.join(IOS_DOCK_ICON_PATH, 'icon-dock-' + fileName + '.png');
  const options: Array<string> = [
    path.join(IMAGES_PATH, DOCK_ICON_FILENAME),
    '-resize',
    '680x680',
    '-bordercolor',
    'white',
    '-border',
    '172',
    '-resize',
    width + 'x' + height,
    outputPath
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

// Android
generateAndroidDockIcon('mdpi');
generateAndroidDockIcon('hdpi');
generateAndroidDockIcon('xhdpi');
generateAndroidDockIcon('xxhdpi');
generateAndroidDockIcon('xxxhdpi');
generateAndroidDockIcon('mdpi', true);
generateAndroidDockIcon('hdpi', true);
generateAndroidDockIcon('xhdpi', true);
generateAndroidDockIcon('xxhdpi', true);
generateAndroidDockIcon('xxxhdpi', true);
