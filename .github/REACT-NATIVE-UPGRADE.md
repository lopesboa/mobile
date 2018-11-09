# REACT-NATIVE UPGRADE

## Using cli

You should wait that a stable release (0.X.0 have at least a patch release associated, to avoid running into "early adopter issues").

Use `react-native-git-upgrade` CLI tool. This will reapply RN hello world so you can see what have changed in some "native" files. This will install latest react and react-native libs.

You will probably have to discard a lot of files but be careful, mostly with Xcode project files.
You must be really careful with this file and only discard what you are 200% sure about.
Best way is to read our custom files (`ios/[Name app]/*`) which are not in the file updated by the CLI tool.
If you try to discard lines that have weird hashes, you have 99% of chances to do a bad manipulation.
So reapply by hand via Xcode with the updated files what we have done in the past to have the same amount of lines added than removed. It's the safest way to avoid issues.

## Tips

- Before building for iOS via Xcode, be sure to clean build folder (Menu `Product > Clean` with ⌥ `option` key to get `Clean Build Folder`)
- You may have to upgrade all `react-native-*` packages if RN have breaking changes.
- You should upgrade flow to latest version from the latest template (which is not done yet by default by the CLI tool, see [`[version]`](https://github.com/facebook/react-native/blob/0.52-stable/local-cli/templates/HelloWorld/_flowconfig) section in this file, matching your RN version (so you may have to replace "0.52-stable" in this url))
