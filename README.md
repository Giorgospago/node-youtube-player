#NodeJs Youtube Player

### Install
```bash
npm i -S node-youtube-player
```
On Debian/Ubuntu, the ALSA backend is selected by default, so be sure to have the alsa.h header file in place:
```bash
sudo apt-get install libasound2-dev
```

###Use
```js
const YoutubePlay = require('node-youtube-player');

// (optional) Pass true as second argument to enable Debugging console logs
const yt = new YoutubePlay("<YOUR-YOUTUBE-TOKEN>", true);

yt.play("God's Plan");
```

###Events
```js
const YoutubePlay = require('node-youtube-player');

// (optional) Pass true as second argument to enable Debugging console logs
const yt = new YoutubePlay("<YOUR-YOUTUBE-TOKEN>", true);

yt.play("God's Plan");

yt.events.on("play", () => {
    console.log("Music playing...");
});

yt.events.on("stop", () => {
    console.log("Music stops.");
});
```