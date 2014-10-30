/**
 * Created by kiran on 30/10/14.
 */

//plugin to flatten the json files and create a ne json file for indexing purpose
var config=require(__dirname+'/config');
var fs=require('fs');
var file_name="flatten_temp.json";

function get_file_names()
{
    var edition_content=fs.readFileSync(config.json_path+"/"+config.main_json_name);
    var temp=JSON.parse(edition_content);
    var file_names=[];
    for(var k=0;k<temp.length;k++)
    {

        for(var i=0;i<temp[k]["dates"].length;i++)
        {
            //console.log(temp[k]["dates"][i]["file_name"]);
            file_names.push(temp[k]["dates"][i]["file_name"]);

        }
    }
    var data_output=[];
    var x;
    for(var k=0;k<file_names.length;k++)
    {
        x=get_date_json(file_names[k]);
        if( x!="")
        {
            data_output.push(x);
        }
    }
    write_to_file("["+data_output.toString()+"]");
}

function get_date_json(file_name)
{

    try {
        var date_contents = fs.readFileSync(config.json_path + "/" + file_name);
        if (date_contents) {
            var temp1 = JSON.parse(date_contents);
            return flatten(temp1);
        }
    }
    catch (e)
    {
        console.log(e);
    }
    return "";

}
function write_to_file(text)
{
    fs.readFile(file_name, "utf-8",function(err,data) {
        if(err) {
            console.log(err);
            return;
        }
        console.log(data);
        fs.writeFile(file_name, data+"\n"+text, function(err) {
            if(err) {
                console.log(err);
            } else {
               // console.log("The file was saved!");
            }
        });
    });

}
flatten=function(data) {
    if(!data)
        return ""
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
    var out=json_string;
    return out;

};

clear_file=function()
{
    fs.writeFile(file_name,"", function(err) {
        if(err) {
            console.log(err);
        } else {
            //console.log("The file was saved!");
        }
    });
}

clear_file();
get_file_names();
console.log("program Completed ")