const search = require('youtube-search');
const stream = require('youtube-audio-stream');
const decoder = require('lame').Decoder;
const Speaker = require('speaker');
const chalk = require('chalk');
const EventEmitter = require('eventemitter3');

function YoutubePlay(key, debug) {
    this.key = key || "";
    this.searchText = "";
    this.status = "stop";
    this.song = null;
    this.debug = debug || false;
    this.decoder = null;
    this.speaker = null;
    this.first = null;
    this.events = new EventEmitter();

    this.play = (songText) => {
        this.searchText = songText || this.searchText || "In my feelings";

        if (this.status === "play" && !songText) {
            if (this.debug) console.log(chalk.green("Already playing: ") + this.first.title + "...");
            return this;
        }

        if (this.status === "pause" && !songText) {
            if (this.debug) console.log(chalk.green("Resume: ") + this.first.title + "...");
            this.song.uncork();
            this.status = "play";
            return this;
        }

        if (this.song !== null) {
            this.stop();
        }

        if (this.debug) console.log(chalk.magenta("Searching for: ") + this.searchText + "...");
        const self = this;
        const ytsOptions = {
            maxResults: 1,
            key: self.key,
            type: "video"
        };
        search(this.searchText, ytsOptions, function(err, results) {
            if(err) return console.log(err);
            if(results.length === 0) return console.log("No results");

            self.first = results[0];

            self.decoder = decoder();
            self.speaker = new Speaker({
                channels: 2,          // 2 channels
                bitDepth: 16,         // 16-bit samples
                sampleRate: 44100     // 44,100 Hz sample rate
            });

            if (self.debug) console.log(chalk.cyan("Ready to play: ") + self.first.title + "...");
            self.song = stream(self.first.link).pipe(self.decoder).pipe(self.speaker);

            self.speaker.on("open", function(){
                if (self.debug) console.log(chalk.green("Playing: ") + self.first.title + "...");
                self.events.emit("play");
                self.status = "play";
            });
            self.speaker.on("flush", function(){
                self.events.emit("flush");
            });
            self.speaker.on("close", function(){
                self.events.emit("stop");
            });
        });
        return this;
    };

    this.pause = () => {
        if (this.debug) console.log(chalk.yellow("Pausing: ") + this.first.title + "...");
        if (this.status === "play") {
            this.song.cork();
            this.status = "pause";
        }
        return this;
    };

    this.stop = () => {
        if (this.debug) console.log(chalk.red("Stoping: ") + this.first.title + "...");
        if (this.status === "play") this.speaker.destroy(); // Maybe harmful...
        this.decoder.end();
        this.song = null;
        this.status = "stop";
        return this;
    };

    return this;
}

module.exports = YoutubePlay;