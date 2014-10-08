
var express = require('express');
var app = express();
var url_path='192.168.12.77';
var port=8080;

exports.create_server = function () {
	app.use(express.static(__dirname + '/database/files'));	
	app.get("/",function (req,res)
	{
		var html='<html><body><h1><a href="test.json">json</a>   <a href="sample.zip">sample</a>      </h1></body></html>';
		res.end(html);
	});
	app.listen(port,url_path);
	console.log('Listening on port http://'+url_path+':'+port);
}
