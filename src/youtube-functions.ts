//based on https://github.com/youtube/api-samples/blob/master/javascript/nodejs-quickstart.js
//with user typescript and edits for syncronous use in project

class YouTubeFunctions{
    static fs = require('fs');
    static readline = require('readline');
    static google = require('googleapis');
    static OAuth2 = YouTubeFunctions.google.auth.OAuth2;
    
    // If modifying these scopes, delete your previously saved credentials
    // at ~/.credentials/youtube-nodejs-quickstart.json
    static SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
    static TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
        process.env.USERPROFILE) + '/.credentials/';
    static TOKEN_PATH = YouTubeFunctions.TOKEN_DIR + 'youtube-nodejs-quickstart.json';

    //https://developers.google.com/youtube/v3/docs/videos/list#request
    static videosListMultipleIds(auth:any, parameters:any, print_function:Function, sender:string) {
        var service = YouTubeFunctions.google.youtube('v3');
        parameters['auth'] = auth;
        service.videos.list(parameters, (err:any, response:any) => {
          if (err) {
            print_function("", sender);
            return;
          }
          print_function(response, sender);
        });
      }

      static getYouTubeID(youtube_url:string):string{
        if(/youtube/.test(youtube_url)){
            var low_trim = youtube_url.lastIndexOf('v=') + 2;
            var high_trim = youtube_url.indexOf('&', low_trim);
            high_trim =  high_trim > -1 ? high_trim : youtube_url.length
            return youtube_url.substring(low_trim, high_trim);
        }
        else if(/youtu\.be/.test(youtube_url)){
            var low_trim = youtube_url.lastIndexOf('/') + 1;
            var high_trim = youtube_url.indexOf('?', low_trim);
            high_trim =  high_trim > -1 ? high_trim : youtube_url.length
            return youtube_url.substring(low_trim, high_trim);
        }
        else return "";
      }

      //call functions:
      // with authorize(JSON.parse(content), {'params': {'id': 'Ks-_Mh1QhMc,c0KYU2j0TM4,eIho2S0ZahI',
     //       'part': 'snippet,contentDetails,statistics'}}, videosListMultipleIds);

}