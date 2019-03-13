class Main{

    static data_constants:any;
    static irc = require("irc");
    static details_fetcher = new DetailsFetcher();
    static linkifier_bot:any;

    static getConnectionProperties(){
        console.log("Reading Constants");
        var fs = require('fs');
        this.data_constants = JSON.parse(fs.readFileSync(__dirname + '/bot-properties.json','utf8'));
    }

    static initBot(){
        console.log("Initializing Bot");

        Main.linkifier_bot = new Main.irc.Client(this.data_constants["SERVER"], this.data_constants["NICK"], {
            channels: this.data_constants["CHANNELS"],
            port: this.data_constants["SERVER-PORT"],
            floodProtection: true
        });

        console.log(this.data_constants["CHANNELS"]);

        Main.linkifier_bot.addListener('message', (sender:string, channel:string, text:string, message_obj:any) => {
            switch(text){
                case "!YTBot -v": 
                Main.linkifier_bot.say(channel, Main.irc.colors.wrap("dark_blue", "IRC-YouTube-Bot " + this.data_constants["VERSION"] +" - @Verniy\n"
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
                    if(reg_pat_youtube.test(text)){
                        // Main.linkifier_bot.say(channel, "!YTBot: Recieved");
                        this.details_fetcher.fetchYoutubeDetails(text.match(reg_pat_youtube), Main.displayYouTubeDetails, channel);
                    }
                    else if(reg_pat_url.test(text)){
                        this.details_fetcher.fetchLinkDetails(text.match(reg_pat_url), Main.displayLinkDetails, channel);
                    }
                    break;
            }       
        });
		
		Main.linkifier_bot.addListener('kick', (channel:string, nick:string, by:string, reason:string, message_obj:any) =>{
            console.log("Bot was kicked from " + channel);
		});
    }

    static displayYouTubeDetails(details_obj:any, channel:string){
        if(details_obj == undefined || details_obj == "" || details_obj.items.length == 0){
            console.log("Failed");
            Main.linkifier_bot.say(channel, Main.irc.colors.wrap("dark_blue", "!YTBot:") + Main.irc.colors.wrap("dark_red", " link error"));
			return;
        }
        details_obj.items.forEach((details:any, ind:number)=>{
            console.log(ind,channel,details.snippet.title + " [" + details.snippet.channelTitle + "]");
            Main.linkifier_bot.say(channel, Main.irc.colors.wrap("dark_red",details.snippet.title)
                + Main.irc.colors.wrap("dark_green"," [" + details.snippet.channelTitle + "]"));
        });
    }

    static displayLinkDetails(details:any, channel:string){
        console.log(details, channel, " _");
        Main.linkifier_bot.say(channel, Main.irc.colors.wrap("gray","<" + details + ">"));
    }

    static init():void{
        this.getConnectionProperties();        
        this.initBot();
        console.log("Bot Listening");
    }
}
Main.init();