/**
 * Created by kiran on 16/10/14.
 */
var config = require(__dirname + '/../config.js');
var mongoose = require('mongoose');
var User = require(__dirname + '/userDB.js');


var articleSchema = mongoose.Schema({
    email:String,
    creationDate: { type: Date, default: Date.now },
    article_id:String
});

var Article = mongoose.model('Article', articleSchema);
exports.model = Article;

exports.add = function(user, article_id_value, callback) {
    var article=new Article({email:user.email,article_id:article_id_value});
    article.creationDate=Date.now();
    article.save(function(err) {

            callback(err,article);

    });
    return true;
}
