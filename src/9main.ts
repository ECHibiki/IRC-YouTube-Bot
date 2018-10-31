class Main{

    static data_constants:any;

    static getConnectionProperties(){
        console.log("Reading Constants");
        var fs = require('fs');
        this.data_constants = JSON.parse(fs.readFileSync('bot-properties.json','utf8'));
    }

    static initBot(){
        console.log("Initializing Bot");

        var irc = require("irc");

        var linkifier_bot = new irc.Client(this.data_constants["SERVER"], this.data_constants["NICK"], {
            channels: this.data_constants["CHANNELS"],
            port: this.data_constants["SERVER-PORT"]
        });

        console.log(this.data_constants["CHANNELS"]);

        linkifier_bot.addListener('message', (sender:string, channel:string, text:string, message_obj:any) => {
            // console.log(message_obj);
            switch(text){
                case "!YTBot -v": 
                linkifier_bot.say(channel, "IRC-YouTube-Bot " + this.data_constants["VERSION"] +" - @Verniy\nhttps://github.com/ECHibiki/IRC-YouTube-Bot");
                break;
                case "!YTBot -h": 
                    linkifier_bot.say(channel, "Enter a YouTube link in the form of 'www.youtube.com/watch?*' or 'youtu.be/*' and this bot will output the details.");
                    break;
                case "!YTBot": 
                    linkifier_bot.say(channel, "!YTBot -v : Output version info\n!YTBot -h : Output help info");
                    break;
                default:
                    if(text.includes("www.youtube.com/watch?") || text.includes("youtu.be/")){
                        linkifier_bot.say(channel, "That's certainly a youtube link.");
                    }
                    break;
            }       
        });
    }

    static init():void{
        this.getConnectionProperties();        
        this.initBot();
        console.log("Bot Listening");
    }
}

Main.init();