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
        url_array.forEach((url:string, index:number)=>{
            if(url == ""){
                url_array.splice(index, 1);
                return;
            }
            var title_rgx = /< *title *> *(.|[\r\n])+ *< *\/ *title *>/ugm;
            var img_rgx = /^.*(\.jpg|\.png|\.bmp)($|\?)/ugm;
            var vid_rgx = /^.*(\.webm|\.gif|\.mp4)($|\?)/ugm;
            this.request(url, (error:any, response:any, html:string)=>{
                    var title_arr;
                    if(html != undefined){
                        title_arr = html.match(title_rgx);
                        console.log(url);
                    }
                    if(title_arr == null){
                        if(img_rgx.test(url)){
                            return;
                            //print_function("Image File", sender);
                        }
                        else if(vid_rgx.test(url)){
                            return;
                            //print_function("Video File", sender);
                        }
                        else{
                            print_function("Could not Determine", sender);
                        }
                        return;
                    }
                    var title = (title_arr[0].replace(/(\n|< *title *>|< *\/ *title *>)/ugm, "")).trim();
                    console.log(Main.data_constants["LINKCUTOFF"]);
                    if(title.length > Main.data_constants["LINKCUTOFF"]){
                        title =  title.substr(0,Main.data_constants["LINKCUTOFF"]) + "...";
                    }
                    print_function(title, sender);
            });
        });

        
    }
}