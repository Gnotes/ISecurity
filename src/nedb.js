const path = require('path');
const Datastore = require('nedb');

const db = {};

db.user = new Datastore({ filename: path.resolve(__dirname, 'nedb/user.db'), autoload: true });
db.category = new Datastore({ filename: path.resolve(__dirname, 'nedb/category.db'), autoload: true });
db.card = new Datastore({ filename: path.resolve(__dirname, 'nedb/card.db'), autoload: true });
module.exports = db;