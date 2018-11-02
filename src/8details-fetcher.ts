class DetailsFetcher{

    http = require('http');
    ulr = require('url');
    fs = require('fs');

    Youtube = require("youtube-api");

    constructor(){}

    fetchYoutubeDetails(url_array:RegExpMatchArray|null, print_function:Function, sender:string):void{
        if(url_array == null) {
            print_function("", sender);
            console.log('fyd');
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
}