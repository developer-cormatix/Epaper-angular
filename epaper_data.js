/**
 * Created by kiran on 8/10/14.
 */
var fs=require('fs');
var solr = require('solr');
var config = require(__dirname + '/config.js');
// routes handling for certain methods
var edition_content;
var date_contents;

flatten=function(data) {
   //create a non-flattened but article wise json
    var date=data["date"];
    var edition=data["edition"];
    var section_name;
    var path_name;
    var page_no;
    var thumbnail;
    var image;
    var page_pdf;
    var article_no;
    var article_txt;
    var jpeg;
    var article_pdf;
    var coords;
    var link;
    var json_string=[];
    var json_object;
    for(var i=0;i<data["section"].length;i++)
    {
        section_name=data["section"][i]["section_name"];
        path_name=data["section"][i]["path"];
        for(var j=0;j<data["section"][i]["pages"].length;j++)
        {
            page_no=data["section"][i]["pages"][j]["page_no"];
            thumbnail=data["section"][i]["pages"][j]["thumbnail"];
            image=data["section"][i]["pages"][j]["image"];
            page_pdf=data["section"][i]["pages"][j]["pdf"];
            for(var k=0;k<data["section"][i]["pages"][j]["articles"].length;k++)
            {
                article_no=data["section"][i]["pages"][j]["articles"][k]["article_no"];
                article_txt=data["section"][i]["pages"][j]["articles"][k]["article_txt"];
                jpeg=data["section"][i]["pages"][j]["articles"][k]["jpeg"];
                article_pdf=data["section"][i]["pages"][j]["articles"][k]["pdf"];
                coords=data["section"][i]["pages"][j]["articles"][k]["coords"];
                link=data["section"][i]["pages"][j]["articles"][k]["link"];
                json_object='\n{\n"article_no":"'+article_no+'",\n"article_txt":"'+article_txt+'",\n"jpeg":"'+jpeg+'",\n"article_pdf":"'+article_pdf+
                    '",\n"coords":"'+coords.toString()+'",\n"link":"'+link+'",\n"page_no":"'+page_no+'",\n"thumbnail":"'+thumbnail+'",\n"image":"'+image+'",\n"page_pdf":"'+page_pdf+
                    '",\n"section_name":"'+section_name+'",\n"path_name":"'+path_name+'",\n"date":"'+date+'",\n"edition":"'+edition+'"\n}';
                json_string.push(json_object)

            }
        }
    }
    fs.writeFile("flatten_temp.json", "["+json_string+"\n]", function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });

};
exports.createRoutes = function(app,database) {

    app.get('/api/advanced_search',function(req,res){
        var client = solr.createClient();
        var keyword=req.param('key');
        var edition=req.param('edition');
        var date=req.param('date');
        if(edition=="All")
            edition="*";
        if(date="All")
            date="*";

        client.query("article_txt:"+keyword+" AND date:"+date+" AND edition:"+edition, function (err, response) {
            if (err) {
                console.log("[Error] Error while searching in Solr ");
                return false;
            }
            var responseObj = JSON.parse(response);
            if(responseObj.response.numFound>0)
            {
                console.log("found keys");
                var search_result=responseObj.response.docs;
                console.log(search_result.length);
                console.log(typeof  search_result);
                var keys=Object.keys(search_result);
                for(var i=0;i<keys.length;i++)
                    console.log(keys[i]);
                res.send(search_result);
                //send the object
            }
            else {
                console.log('A search for "' + keyword + '" returned ' +
                    responseObj.response.numFound + ' documents.');
                res.send();
            }
        });

    });


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
            flatten(JSON.parse(date_contents));


        }
        catch (e)
        {
            console.log("[error] Error in reading "+file_name);
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
