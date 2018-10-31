class Main{

    static data_constants:any;

    static getConnectionProperties(){
        var fs = require('fs');
        this.data_constants = JSON.parse(fs.readFileSync('bot-properties.json','utf8'));
    }

    static initBot(){
        var irc = require("irc");

        var linkifier_bot = irc.Client(
            this.data_constants["SERVER"],
            this.data_constants["NICK"],
            {
                channels: this.data_constants["CHANNELS"],
                port: this.data_constants["SERVER-PORT"]
            }
            );

        linkifier_bot.on('message#channel',(message:string)=>{
            console.log("message");
        });
    }

    static init():void{
        this.getConnectionProperties();        
        this.initBot();
    }
}

Main.init();