"use strict";
//based on https://github.com/youtube/api-samples/blob/master/javascript/nodejs-quickstart.js
//with user typescript and edits for syncronous use in project
class YouTubeFunctions {
    //https://developers.google.com/youtube/v3/docs/videos/list#request
    static videosListMultipleIds(auth, parameters, print_function, sender) {
        var service = YouTubeFunctions.google.youtube('v3');
        parameters['auth'] = auth;
        console.log(parameters);
        service.videos.list(parameters, (err, response) => {
            if (err) {
                print_function("", sender);
                console.log('miss-vlmi');
                return;
            }
            print_function(response, sender);
        });
    }
    static getYouTubeID(youtube_url) {
        console.log(youtube_url);
        if (/youtube/.test(youtube_url)) {
            var low_trim = youtube_url.lastIndexOf('v=') + 2;
            var high_trim = youtube_url.indexOf('&', low_trim);
            high_trim = high_trim > -1 ? high_trim : youtube_url.length;
            return youtube_url.substring(low_trim, high_trim);
        }
        else if (/youtu\.be/.test(youtube_url)) {
            var low_trim = youtube_url.lastIndexOf('/') + 1;
            var high_trim = youtube_url.indexOf('?', low_trim);
            high_trim = high_trim > -1 ? high_trim : youtube_url.length;
            return youtube_url.substring(low_trim, high_trim);
        }
        else
            return "";
    }
}
YouTubeFunctions.fs = require('fs');
YouTubeFunctions.readline = require('readline');
YouTubeFunctions.google = require('googleapis');
YouTubeFunctions.OAuth2 = YouTubeFunctions.google.auth.OAuth2;
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
YouTubeFunctions.SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
YouTubeFunctions.TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
YouTubeFunctions.TOKEN_PATH = YouTubeFunctions.TOKEN_DIR + 'youtube-nodejs-quickstart.json';
class DetailsFetcher {
    constructor() {
        this.http = require('http');
        this.ulr = require('url');
        this.fs = require('fs');
        this.Youtube = require("youtube-api");
    }
    fetchYoutubeDetails(url_array, print_function, sender) {
        if (url_array == null) {
            print_function("", sender);
            console.log('fyd');
            return;
        }
        var paramter_obj = { 'id': "",
            'part': 'snippet,contentDetails,statistics' };
        url_array.forEach((url, index) => {
            if (url == "") {
                url_array.splice(index, 1);
                return;
            }
            url_array[index] = YouTubeFunctions.getYouTubeID(url);
        });
        paramter_obj.id = url_array.join(',');
        YouTubeFunctions.videosListMultipleIds(JSON.parse(this.fs.readFileSync("youtube-api-keys.json"))["API-KEY"], paramter_obj, print_function, sender);
    }
}
class Main {
    static getConnectionProperties() {
        console.log("Reading Constants");
        var fs = require('fs');
        this.data_constants = JSON.parse(fs.readFileSync('bot-properties.json', 'utf8'));
    }
    static initBot() {
        console.log("Initializing Bot");
        Main.linkifier_bot = new Main.irc.Client(this.data_constants["SERVER"], this.data_constants["NICK"], {
            channels: this.data_constants["CHANNELS"],
            port: this.data_constants["SERVER-PORT"]
        });
        console.log(this.data_constants["CHANNELS"]);
        Main.linkifier_bot.addListener('message', (sender, channel, text, message_obj) => {
            switch (text) {
                case "!YTBot -v":
                    Main.linkifier_bot.say(channel, "IRC-YouTube-Bot " + this.data_constants["VERSION"] + " - @Verniy\nhttps://github.com/ECHibiki/IRC-YouTube-Bot");
                    break;
                case "!YTBot -h":
                    Main.linkifier_bot.say(channel, "Enter a YouTube link in the form of 'www.youtube.com/watch?*' or 'youtu.be/*' and this bot will output the details.");
                    break;
                case "!YTBot":
                    Main.linkifier_bot.say(channel, "!YTBot -v : Output version info\n!YTBot -h : Output help info");
                    break;
                default:
                    var reg_pag = /\b(www\.youtube\.com\/watch\?[\w?=\-&]+|youtu\.be\/[\w?=&\-]+)\b/gu;
                    if (reg_pag.test(text)) {
                        // Main.linkifier_bot.say(channel, "!YTBot: Recieved");
                        this.details_fetcher.fetchYoutubeDetails(text.match(reg_pag), Main.displayYouTubeDetails, channel);
                    }
                    break;
            }
        });
    }
    static displayYouTubeDetails(details_obj, channel) {
        if (details_obj == "" || details_obj.items.length == 0) {
            console.log(details_obj);
            Main.linkifier_bot.say(channel, "!YTBot: Nice YouTube link");
        }
        details_obj.items.forEach((details, ind) => {
            console.log(ind, details.snippet.title);
            Main.linkifier_bot.say(channel, details.snippet.title);
        });
    }
    static init() {
        this.getConnectionProperties();
        this.initBot();
        console.log("Bot Listening");
    }
}
Main.irc = require("irc");
Main.details_fetcher = new DetailsFetcher();
Main.init();
//# sourceMappingURL=link-bot.js.map