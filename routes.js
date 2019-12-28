const Router = require('koa-router');
const dealUpload = require('./upload');
const dbAPI = require('./db');
const router = new Router();

router.get('/', async (ctx, next) => {
    console.log(ctx.query, 'ctx.query');
    ctx.response.body = `
        <h1>Index</h1>
        <form action="/login" method="post">
            <p>Name: <input name="name"></p>
            <p>Password:<input name="password" type="password"></p>
            <p><input type="submit" value="提交"></p>
        </form>
    `;
});

router.get("/test",(ctx,next)=>{
    debugger;
    ctx.body = "test";
});

router.get('/', async(ctx, next) => {
    ctx.redirect('/blogList');
});

router.get('/login',async (ctx,next) => {
    return ctx.render('login');
});

router.post('/login', async (ctx, next) => {
    let name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    const result = await dbAPI.validate(name,password);
    if (true) {
        ctx.cookies.set("LoginStatus",true);
        ctx.redirect('/blogList');
    } else {
        ctx.body = "Login error"
    }
});

router.get("/blogList",async(ctx,next)=>{
    const results = await dbAPI.getBlogList('/');

    return ctx.render('blogList',{results:results});
});

router.get("/kind/:kindName",async (ctx,next)=>{
    //TODO 获取某个分类下的文章列表
});

router.get("/kindList",async (ctx,next)=>{
    //TODO 获取所有分类
    await next();
});

router.get("/blog/:blogId",async (ctx,next)=>{
    //TODO
    let blogId = ctx.params.blogId;
    let content = await dbAPI.readBlog(blogId);
    ctx.body = content;
    await next();
});

router.get("/uploadBlog",async (ctx,next)=>{
    console.log("upload");
    ctx.redirect('/upload.html');
});

router.get("/modify/blog/:blogId/:kindName",async (ctx,next)=>{
    await dbAPI.modifyBlogKind(ctx.params.blogId,ctx.params.kindName);
    await next();
});

router.get("/delete/blog/:blogId",async(ctx,next)=>{
    await  dbAPI.deleteBlogId(ctx.params.blogId);
    await next()
});

router.post("/delete/kind/:kindName",async(ctx,next)=>{
    //TODO 删除某个分类
    await next()
});

router.post("/modify/kind/:kindName",async(ctx,next)=>{
    //TODO 修改类型名
    await next()
});

router.post("/new/kind/:kindName",async(ctx,next)=>{
    //TODO 新建分类名称
    await next()
});

// router.post("/upload",(ctx,next)=>{
//     dealUpload(ctx);
//
// })

router.get("/read",async (ctx,next)=>{
    const result =  await dbAPI.readBlog();
    ctx.body=result.content;
});

module.exports = router;