class DetailsFetcher{

    http = require('http');
    request = require('request');
    ulr = require('url');
    fs = require('fs');

    Youtube = require("youtube-api");

    constructor(){}

    fetchYoutubeDetails(url_array:RegExpMatchArray|null, print_function:Function, sender:string):void{
        if(url_array == null) {
            print_function("", sender);
            return;
        }

        var paramter_obj:any = {'id': "",
        'part': 'snippet,contentDetails,statistics'}

        url_array.forEach((url:string, index:number)=>{
            if(url == ""){
                url_array.splice(index, 1);
                return;
            }
            url_array[index] = YouTubeFunctions.getYouTubeID(url);
        });

        paramter_obj.id = url_array.join(',');

        YouTubeFunctions.videosListMultipleIds(JSON.parse(this.fs.readFileSync("youtube-api-keys.json"))["API-KEY"], paramter_obj , print_function, sender);

    }

    fetchLinkDetails(url_array:RegExpMatchArray|null, print_function:Function, sender:string):void{
        if(url_array == null) {
            print_function("", sender);
            return;
        }
        console.log(url_array)
        url_array.forEach((url:string, index:number)=>{
            console.log(url)
            if(url == ""){
                url_array.splice(index, 1);
                return;
            }
            console.log("___")
            var title_rgx = /< *title *> *(.|[\r\n])+ *< *\/ *title *>/ugm;
            this.request(url, (error:any, response:any, html:string)=>{
                var title_arr = html.match(title_rgx);
                if(title_arr == null){
                    return;
                }
                var title = (title_arr[0].replace(/(\n|< *title *>|< *\/ *title *>)/ugm, "")).trim();
                print_function(title, sender);
            });
        });

        
    }
}