/**
 * Browser version https://github.com/louischatriot/nedb#browser-version
 * nedb 可以支持node 和 浏览器版本
 * node中以文件形式存储；
 * 在浏览器中会自动选择 IndexedDB, WebSQL or localStorage进行存储，这依赖于不同的浏览器
 * 而我在React 中使用nedb 因此会存储在浏览器中(我的是IndexedDB)，可以在开发者工具的 `Application` -> `IndexedDB` 中查看
 * 因此我只需要指定一个数据库名字(key)即可，不需要指定文件路径
 */
const Datastore = require('nedb');

const db = {};

db.user = new Datastore({ filename: 'user.db', autoload: true });
db.category = new Datastore({ filename: 'category.db', autoload: true });
db.card = new Datastore({ filename: 'card.db', autoload: true });
module.exports = db;