/**
 * Created by kiran on 8/10/14.
 */
var fs=require('fs');
var solr = require('solr');
var config = require(__dirname + '/config.js');
// routes handling for certain methods
var edition_content;
var date_contents;

exports.createRoutes = function(app,database) {

    app.get('/api/advanced_search',function(req,res){
        var client = solr.createClient();
        var keyword = req.param('key');
        var edition = req.param('edition');
        var date = req.param('date');
        if (edition == "All")
            edition = "*";
        if (date = "All")
            date = "*";
        client.query("article_txt:(" + keyword + ") AND date:" + date + " AND edition:" + edition, function (err, response) {
            if (err) {
                console.log("[Error] Error while searching in Solr ");
                res.send();
                return false;
            }
            var responseObj = JSON.parse(response);
            if (responseObj.response.numFound > 0) {
                //res.writeHead(200, {'Content-Type': 'application/json'}); // Sending data via json

                console.log('[info] search for "' + keyword + '" returned ' +
                    responseObj.response.numFound + ' documents.');
                var search_result = responseObj.response.docs;
                res.send({result: search_result});
                //send the object
            }
            else {
                console.log('[info] search for "' + keyword + '" returned ' +
                    responseObj.response.numFound + ' documents.');
                res.send({result: []});
            }
        });

        client.on('error', function(ex) {
            console.log("[Error] Unable to connect to Solr"+ex);


            res.send();
            return false;
        });
    });


    app.get('/api/get_edition', function (req, res) {
        try{
            edition_content=fs.readFileSync(config.json_path+"/"+config.main_json_name);
        }
        catch (e)
        {
            console.log("[error] Error in reading "+config.main_json_name);
            res.send();
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
            res.send();
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
            res.send();
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
            res.send();
            return false;
        }
        //console.log(JSON.parse(date_contents));
        var x=JSON.parse(date_contents)
        res.send(x["section"]);
        //console.log("seciton contens");
        //console.log(x["section"]);
        console.log("[info] Successfully loaded json file : "+file_name);

    });

}
