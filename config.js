// Replace here with your MongoDB server address
exports.database = "mongodb://localhost/epaper";
exports.port = 3000;
exports.cookieSecret = "9a62df3075e2ab7bb554c2e2607af0dd";

exports.urlRegex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
exports.emailRegex = new RegExp("^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$");


exports.json_path="/home/kiran/Downloads/nodejs/json-epaper/Epaper-angular/data";
exports.main_json_name="edition.json";
exports.cacheTime = 1 * 60 * 1000; // 1 min in milliseconds
exports.maxItems = 15;
