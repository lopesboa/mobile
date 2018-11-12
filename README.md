<p align="center">
  <a href="https://coorpacademy.com" rel="noopener" target="_blank"><img width="400" src=".github/logo.png" alt="Coorpacademy mobile app"></a></p>
</p>

## Installation

Please follow this [step by step guide](.github/INSTALLATION.md).

## Development

##### Prerequisite

For iOS builds, refer to this [part](.github/FASTLANE.md#match).

For Android builds, you need to allow your emulator to connect to your packager:

```
adb reverse tcp:7007 tcp:7007
```

##### First run

```console
yarn start:[android|ios]
```

##### Daily usage

```console
yarn start[:clean] // clean is optional, it resets the cache
```

And open your previous app bundle in your Simulator.

This will just run react-native development background task.

## Storybook

Stop the packager if it is running, and launch the storybook packager:

```console
yarn storybook
```

**Note**: This command will automatically indexes all the stories in **stories.js** files.

## Troubleshooting

[In this section](.github/TROUBLESHOOTING.md) you can find all common issues and how we can resolve those.

## Upgrade

React Native is a pain to upgrade, the following [tips](.github/REACT-NATIVE-UPGRADE.md) can help you.

## Contributing

Feel free to contribute :) but don't forget to run [tests](.github/TESTS.md) before.
