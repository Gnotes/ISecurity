const path = require('path');
const Datastore = require('nedb');
const paths = require('./paths');

const db = {};

db.user = new Datastore({ filename: path.join(paths.ROOT_PATH + '/nedb/user.db'), autoload: true });
db.category = new Datastore({ filename: path.join(paths.ROOT_PATH + '/nedb/category.db'), autoload: true });
db.card = new Datastore({ filename: path.join(paths.ROOT_PATH + '/nedb/card.db'), autoload: true });
module.exports = db;