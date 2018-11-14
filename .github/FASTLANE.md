# FASTLANE

[Fastlane](https://fastlane.tools/) handles tedious tasks (signing, deployments, screenshots automation, etc.) so you don’t have to.

## Match

Match is a Fastlane tool that handles iOS certificates/Provisioning Profiles maintenance
for developers.

We are assuming you have Fastlane installed on your computer.

To be able to run match you need to set an environment variable :

```sh
MATCH_PASSWORD=[...] fastlane <action>
```

**Note**: You can define it in your bash profile as it shouldn't change

##### Download

To find the password to use, go to the enterprise password wallet and found it.

This password is used to encrypt/decrypt certs and PPs.

On iOS, if you don't have anything on your mac, you can just run `yarn pull:certificate:ios`.
This command will run `fastlane match development and adhoc`.
Certs and PP will be downloaded and installed on your computer.

##### Generate

If you need to maintain those certs/profiles, go to the iOS folder of the project
and run `fastlane match development --verbose`
Match will recreate PP that need to be and push it to the codesigning repository.

You might encounter this error during maintenance :

```
[17:21:08]: Installing provisioning profile...
[17:21:09]: Provisioning profile '8602d0e8-6738-479e-a7eb-xxxxxxxxxx' is not available on the Developer Portal
[17:21:09]: for the user xxxxx@xxxxx.fr
[17:21:09]: Make sure to use the same user and team every time you run 'match' for this
[17:21:09]: Git repository. This might be caused by deleting the provisioning profile on the Dev Portal

[!] To reset the provisioning profiles of your Apple account, you can use the `fastlane match nuke` feature, more information on https://github.com/fastlane/fastlane/tree/master/match
```

Do not use fastlane match nuke, this will remove all certs/PP on apple account for whole team.

But you can run `fastlane match development --verbose --force`
