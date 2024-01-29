"use strict";
class DetailsFetcher {
    constructor() {
        this.http = require('http');
        this.request = require('request');
        this.ulr = require('url');
        this.fs = require('fs');
        this.he = require('html-entities');
        this.Youtube = require("youtube-api");
    }
    fetchYoutubeDetails(url_array, print_function, sender) {
        if (url_array == null) {
            print_function("", sender);
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
        YouTubeFunctions.videosListMultipleIds(JSON.parse(this.fs.readFileSync(__dirname + "/youtube-api-keys.json"))["API-KEY"], paramter_obj, print_function, sender);
    }
    fetchLinkDetails(url_array, print_function, sender) {
        if (url_array == null) {
            print_function("", sender);
            return;
        }
        url_array.forEach((url, index) => {
            if (url == "") {
                url_array.splice(index, 1);
                return;
            }
            var title_rgx = /< *title[^>]*> *([^<>]|[\r\n])+ *< *\/title[^>]*>/ugm;
            var img_rgx = /^.*(\.jpg|\.png|\.bmp)($|\?)/ugm;
            var vid_rgx = /^.*(\.webm|\.gif|\.mp4)($|\?)/ugm;
            this.request(url, (error, response, html) => {
                var title_arr;
                if (html != undefined) {
                    title_arr = html.match(title_rgx);
                    console.log(url);
                }
                if (title_arr == null) {
                    if (img_rgx.test(url)) {
                        return;
                        //print_function("Image File", sender);
                    }
                    else if (vid_rgx.test(url)) {
                        return;
                        //print_function("Video File", sender);
                    }
                    else {
                        print_function("Could not Determine", sender);
                    }
                    return;
                }
                var title = (title_arr[0].replace(/(\n|<[^<]*title[^>]*>|<[^<]*\/title[^>]*>)/ugm, "")).trim();
                title = this.he.decode(title);
                console.log(Main.data_constants["LINKCUTOFF"]);
                if (title.length > Main.data_constants["LINKCUTOFF"]) {
                    title = title.substr(0, Main.data_constants["LINKCUTOFF"]) + "...";
                }
                print_function(title, sender);
            });
        });
    }
}
class Main {
    static getConnectionProperties() {
        console.log("Reading Constants");
        var fs = require('fs');
        this.data_constants = JSON.parse(fs.readFileSync(__dirname + '/bot-properties.json', 'utf8'));
    }
    static initBot() {
        console.log("Initializing Bot");
        Main.linkifier_bot = new Main.irc.Client(this.data_constants["SERVER"], this.data_constants["NICK"], {
            channels: this.data_constants["CHANNELS"],
            port: this.data_constants["SERVER-PORT"],
            floodProtection: true
        });
        console.log(this.data_constants["CHANNELS"]);
        Main.linkifier_bot.addListener('message', (sender, channel, text, message_obj) => {
            switch (text) {
                case "!YTBot -v":
                    Main.linkifier_bot.say(channel, Main.irc.colors.wrap("dark_blue", "IRC-YouTube-Bot " + this.data_constants["VERSION"] + " - @Verniy\n"
                        + Main.irc.colors.wrap("dark_blue", "https://github.com/ECHibiki/IRC-YouTube-Bot")));
                    break;
                case "!YTBot -h":
                    Main.linkifier_bot.say(channel, Main.irc.colors.wrap("dark_blue", "Enter a YouTube link in the form of 'www.youtube.com/watch?*' or 'youtu.be/*' and this bot will output the details."));
                    break;
                case "!YTBot":
                    Main.linkifier_bot.say(channel, Main.irc.colors.wrap("dark_blue", "!YTBot -v :")
                        + " Output version info\n " + Main.irc.colors.wrap("dark_blue", "!YTBot -h :")
                        + " Output help info");
                    break;
                case "#kissu":
                    Main.linkifier_bot.say(channel, Main.irc.colors.wrap("dark_blue", "!YTBot Active"));
                    break;
                default:
                    var reg_pat_youtube = /\b(www\.youtube\.com\/watch\?[\w?=\-&_]+|youtu\.be\/[\w?=\-&_]+)\b/gu;
                    var reg_pat_url = /\b(http[s]{0,1}:\/\/[\w?=\-&_%\.]+\.[\w?=\-&_%\.\/]+)\b/gu;
                    if (reg_pat_youtube.test(text)) {
                        // Main.linkifier_bot.say(channel, "!YTBot: Recieved");
                        this.details_fetcher.fetchYoutubeDetails(text.match(reg_pat_youtube), Main.displayYouTubeDetails, channel);
                    }
                    else if (reg_pat_url.test(text)) {
                        this.details_fetcher.fetchLinkDetails(text.match(reg_pat_url), Main.displayLinkDetails, channel);
                    }
                    break;
            }
        });
        Main.linkifier_bot.addListener('kick', (channel, nick, by, reason, message_obj) => {
            console.log("Bot was kicked from " + channel);
        });
    }
    static displayYouTubeDetails(details_obj, channel) {
        if (details_obj == undefined || details_obj == "" || details_obj.items.length == 0) {
            console.log("Failed");
            Main.linkifier_bot.say(channel, Main.irc.colors.wrap("dark_blue", "!YTBot:") + Main.irc.colors.wrap("dark_red", " link error"));
            return;
        }
        details_obj.items.forEach((details, ind) => {
            console.log(ind, channel, details.snippet.title + " [" + details.snippet.channelTitle + "]");
            Main.linkifier_bot.say(channel, Main.irc.colors.wrap("dark_red", details.snippet.title)
                + Main.irc.colors.wrap("dark_green", " [" + details.snippet.channelTitle + "]"));
        });
    }
    static displayLinkDetails(details, channel) {
        console.log(details, channel, " _");
        Main.linkifier_bot.say(channel, Main.irc.colors.wrap("gray", "<" + details + ">"));
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
//based on https://github.com/youtube/api-samples/blob/master/javascript/nodejs-quickstart.js
//with user typescript and edits for syncronous use in project
class YouTubeFunctions {
    //https://developers.google.com/youtube/v3/docs/videos/list#request
    static videosListMultipleIds(auth, parameters, print_function, sender) {
        var service = YouTubeFunctions.google.youtube('v3');
        parameters['auth'] = auth;
        service.videos.list(parameters, (err, response) => {
            if (err) {
                print_function("", sender);
                return;
            }
            print_function(response, sender);
        });
    }
    static getYouTubeID(youtube_url) {
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
//# sourceMappingURL=link-bot.js.map