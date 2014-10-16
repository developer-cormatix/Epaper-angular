/**
 * Created by kiran on 16/10/14.
 */
var config = require('./config.js');

exports.createRoutes = function(app, database) {
    app.post('/api/article', function (req, res) {
        if (!req.session.user)
            return res.send(401, "Loging required");
        var article_id_value = req.param('article_id');
        database.article.add(req.session.user, article_id_value, function (err, article) {
            if (err)
                return res.send(400, "Error in adding article");
            //res.send(feed);
            //req.session.user._feeds.push(feed._id);
            console.log("[info ] Added article (%s) to user : %s", article_id_value, req.session.user.email);
        });
    });
}