const path = require('path');
const Datastore = require('nedb');
const paths = require('./paths');

const db = {};

db.user = new Datastore({ filename: path.join(paths.ROOT_PATH + '/nedb/user.db'), autoload: true });
db.security = new Datastore({ filename: path.join(paths.ROOT_PATH + '/nedb/security.db'), autoload: true });
module.exports = db;