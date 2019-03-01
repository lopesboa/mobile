# TESTS

CI will always run all test with `yarn test`
This command will run

- lint
- test:unit
- test:end2end:release

You can run them independently but it's good to know that `yarn lint` will internally run `yarn lint:flow` + `yarn lint:eslint`.

**Note**: be sure to double check directly in our `package.json` that this doc is up to date if you have any doubts.

## Unit testing + Stories snapshots

To run these tests use `yarn test:unit`.
To update snapshots use `yarn test:unit -u`.

When you run an update, please carefully review git diff.

## End-to-end tests

To execute end-to-end tests locally, you must do the following :

- Run `yarn start:e2e`, to start the react-native packager
- In another tab, run `yarn test:end2end:[ios|android]:[debug|release]`

**Note**: `test:end2end:[debug|release]` will launch 2 separated commands which are:

- `test:end2end:[ios|android]:[debug|release]:build`, that builds the app with [Detox](https://github.com/wix/Detox) test framework
- `test:end2end:[ios|android]:[debug|release]:test`, that will run tests

If you need to relaunch tests only (without build native app), only run the `test` command.

If you want to focus on some tests, you should probably delete unused files to only run your file (don't forget to checkout those files at the end). We didn't find a better solution yet. If you do, please tell us and edit this doc!
