// mongoose默认支持promise规范
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017',{
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('connected');
});

const loginSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const login = db.model('login', loginSchema, 'login');

const blogListSchema = new mongoose.Schema({
    title: String,
    kind: String,
    id: String,
});
const blogList = db.model('blogList', blogListSchema, 'blogList');
const user1 = new login({
    username: 'nikun',
    password: '1'
});

user1.save((function(err) {
    if (err) {
        console.error(err);
    }
    // saved
}));

/**
 * 登陆验证
 * @param username
 * @param password
 * @returns {Promise<boolean>}
 */
async function validateLogin(username,password){
    //var pass = '';
    //await login.find({username:username}).then(function(doc){
    //      pass = doc[0].password;
    // })
    //if(password === pass){
    //    return true;
    //}
    //return false;

    return true;
}

// 使用mongoose查询
const query = login.find({
    username: 'Lear'
});

query.then(function(doc) {
    console.log(doc, 'doc');
    // doc对象是一个包含所有结果集的数组，如果数据库中只有一条对应的记录，可以使用doc[0]来取出。
});

// 查询某个分类下的全部文章
async function getBlogList(kind) {
    let query = {};
    let results = [];
    if (kind !== '/') {
        query = { kind: kind }
    }
    results = await blogList.find(query);
    return results;
}

// 查找ID的最大值
async function queryMaxID(){
    let temp = 0;
    await  blogList.find({}).sort({ 'id' : -1 }).limit(1).then(function(doc){
        if(doc.length > 0){
            temp = doc[0].id
        }else{
            console.log("collection is empty");
        }
    });
    return temp;
}

/**
 *
 * @param title
 * @param kind
 * @returns {Promise<number>}
 */
async function insertBlogList(title,kind){
    let value =  await queryMaxID();
    const record = new blogList({title: title, kind: kind, id: ++value});
    await record.save().then(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Insert done");
    });
    return value;
}

/**
 * 删除某篇博客
 * @param id
 * @returns {Promise<void>}
 */
async function deleteBlogId(id){
    let query = { id:id };
    console.log(query);
    await blogList.remove(query).then(function(doc){
        console.log("done");
    });
}

/**
 * 修改博客类别
 * @param id
 * @param kind
 * @returns {Promise<void>}
 */
async function modifyBlogKind(id,kind){
    let query = { id: id };
    await blogList.findOneAndUpdate(query,{ kind:kind }).then(function(doc){
        console.log("done");
    });
}

/**
 * 保存博客
 * @param path
 * @param id
 * @returns {Promise<void>}
 */
async function saveBlog(path,id){
    const content = require("fs").readFileSync(path,{ encoding:"UTF-8" });
    const query = new blog({
        content: content,
        id: id
    });
    query.save(function(err){
        if(err) return;
        console.log("save done");
    })
}

/**
 * 读取博客
 * @param id
 * @returns {Promise<*>}
 */
async function readBlog(id){
    let content;
    await blog.find({id:id}).then(function (doc) {
        content = doc[0];
    });
    return content;
}

const dbAPI = {
    validate: validateLogin,
    getBlogList: getBlogList,
    insertBlogList: insertBlogList,
    deleteBlogId: deleteBlogId,
    modifyBlogKind: modifyBlogKind,
    saveBlog: saveBlog,
    readBlog: readBlog
};

module.exports = dbAPI;

