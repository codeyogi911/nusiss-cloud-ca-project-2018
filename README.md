# nusiss-cloud-ca-project-2018
Aim of this project is to build a client side hybrid app that utilises AWS cloud native backend to deliver functionality at par with social platforms such as instagram.

### Installing Ionic CLI 3.0

This project requires Ionic CLI 3.0, to install, run

```bash
npm install -g ionic@latest
```

Make sure to add `sudo` on Mac and Linux. If you encounter issues installing the Ionic 3 CLI, uninstall the old one using `npm uninstall -g ionic` first.

### Running the app


```bash
ionic serve
```

To run the app on device, first add a platform, and then run it:

```bash
ionic cordova platform add ios
ionic cordova run ios
```

Or open the platform-specific project in the relevant IDE:

```bash
open platforms/ios/MyApp.xcodeproj
```
