"use strict";
class DetailsFetcher {
    static fetchYoutubeDetails(url) {
        var link_details = "";
        return link_details;
    }
}
class Main {
    static getConnectionProperties() {
        var fs = require('fs');
        this.data_constants = JSON.parse(fs.readFileSync('bot-properties.json', 'utf8'));
    }
    static initBot() {
        var irc = require("irc");
        var linkifier_bot = new irc.Client(this.data_constants["SERVER"], this.data_constants["NICK"], {
            channels: this.data_constants["CHANNELS"],
            port: this.data_constants["SERVER-PORT"]
        });
        console.log(this.data_constants["CHANNELS"]);
        linkifier_bot.addListener('message', (sender, channel, text, message_obj) => {
            // console.log(message_obj);
            switch(text){
                case "!YTBot -v": 
                linkifier_bot.say(channel, "IRC-YouTube-Bot V0.1 - @Verniy\nhttps://github.com/ECHibiki/IRC-YouTube-Bot");
                break;
                case "!YTBot -h": 
                linkifier_bot.say(channel, "Enter a YouTube link and this bot will output the details.");
                break;
                case "!YTBot": 
                linkifier_bot.say(channel, "!YTBot -v : Output version info\n!YTBot -h : Output help info");
                break;
            }       
        });

        console.log("Bot Listening");
    }
    static init() {
        console.log("Bot Initializing");
        this.getConnectionProperties();
        this.initBot();
    }
}
Main.init();
//# sourceMappingURL=link-bot.js.map