/**
 * Created by kiran on 8/10/14.
 */
var fs=require('fs');
var config = require(__dirname + '/config.js');
// routes handling for certain methods
var edition_content;
var date_contents;

exports.createRoutes = function(app) {
    app.get('/api/get_edition', function (req, res) {
        try{
            edition_content=fs.readFileSync(config.json_path+"/"+config.main_json_name);
        }
        catch (e)
        {
            console.log("[error] Error in reading "+config.main_json_name);
            return false;
        }
        var editions=[];
        var edit2=[];
        var temp=JSON.parse(edition_content);

        for(var k=0;k<temp.length;k++)
        {
            //editions.push({'edition':temp[k]["edition"]});
            edit2.push(temp[k]["edition"]);
        }
        editions.push({'edition':edit2});

        if(editions.length==0) {
            console.log("[Error] No contents present in edition.json");
            return false;
        }
        res.send(editions);
        console.log("[info] Edition read successfully");
    });


    // return dates for a particular edition
    app.get('/api/edition_dates', function (req, res) {
        console.log("[info ]requested  dates for edition :"+req.param('edition'));
        var edition=req.param('edition');
        var temp=JSON.parse(edition_content);
        var x;
        for(var k=0;k<temp.length;k++)
        {
            if(temp[k]["edition"]==edition)
            {
                x=temp[k]["dates"];
                break;
            }
        }
        if(x.length==0)
        {
            console.log("[Error] No date present matching given edition: "+edition);
            return false;
        }
        res.send(x);
        console.log("[info] Loaded dates for "+ edition);
    });

    //return the date json contents for a aparticular date & edition
    app.get('/api/date_json', function (req, res) {
        var date=req.param('date');
        var file_name=req.param('file_name');
        var path=req.param('path_name');
        console.log("[info] searching for requested dates json file : "+file_name);
        try{
            date_contents=fs.readFileSync(config.json_path+"/"+file_name);
        }
        catch (e)
        {
            console.log("[error] Error in reading "+file_name);
            return false;
        }
        console.log(JSON.parse(date_contents));
        var x=JSON.parse(date_contents)
        res.send(x["section"]);
        console.log("seciton contens");
        console.log(x["section"]);
        console.log("[info] Successfully loaded json file : "+file_name);

    });

}
