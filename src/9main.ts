class Main{

    static data_constants:any;
    static irc = require("irc");
    static details_fetcher = new DetailsFetcher();
    static linkifier_bot:any;

    static getConnectionProperties(){
        console.log("Reading Constants");
        var fs = require('fs');
        this.data_constants = JSON.parse(fs.readFileSync('bot-properties.json','utf8'));
    }

    static initBot(){
        console.log("Initializing Bot");

        Main.linkifier_bot = new Main.irc.Client(this.data_constants["SERVER"], this.data_constants["NICK"], {
            channels: this.data_constants["CHANNELS"],
            port: this.data_constants["SERVER-PORT"]
        });

        console.log(this.data_constants["CHANNELS"]);

        Main.linkifier_bot.addListener('message', (sender:string, channel:string, text:string, message_obj:any) => {
            switch(text){
                case "!YTBot -v": 
                Main.linkifier_bot.say(channel, "IRC-YouTube-Bot " + this.data_constants["VERSION"] +" - @Verniy\nhttps://github.com/ECHibiki/IRC-YouTube-Bot");
                break;
                case "!YTBot -h": 
                Main.linkifier_bot.say(channel, "Enter a YouTube link in the form of 'www.youtube.com/watch?*' or 'youtu.be/*' and this bot will output the details.");
                    break;
                case "!YTBot": 
                Main.linkifier_bot.say(channel, "!YTBot -v : Output version info\n!YTBot -h : Output help info");
                    break;
                default:
                    var reg_pag = /\b(www\.youtube\.com\/watch\?[\w?=\-&_]+|youtu\.be\/[\w?=\-&_]+)\b/gu;
                    if(reg_pag.test(text)){
                        // Main.linkifier_bot.say(channel, "!YTBot: Recieved");
                        this.details_fetcher.fetchYoutubeDetails(text.match(reg_pag), Main.displayYouTubeDetails, channel);
                    }
                    break;
            }       
        });
    }

    static displayYouTubeDetails(details_obj:any, channel:string){
        if(details_obj == "" || details_obj.items.length == 0){
            console.log("Failed");
            Main.linkifier_bot.say(channel, "!YTBot: Nice YouTube link");
        }
        details_obj.items.forEach((details:any, ind:number)=>{
            console.log(ind,channel,details.snippet.title + " [" + details.snippet.channelTitle + "]");
            Main.linkifier_bot.say(channel,details.snippet.title + " [" + details.snippet.channelTitle + "]");
        });
    }

    static init():void{
        this.getConnectionProperties();        
        this.initBot();
        console.log("Bot Listening");
    }
}
Main.init();