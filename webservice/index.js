const Koa = require('koa')
const app = new Koa()

const Router = require('koa-router')
const router = new Router()

const koaBody = require('koa-body')

const cors = require('@koa/cors')
app.use(cors({
    origin: "*"
}))

var base64Img = require('base64-img');

/** 
function postFirstParagraph(ctx) {
    return new Promise((fulfill, reject) => {
        console.log("girdi2")
        var body = ctx.request.body;
        base64Img.img('data:image/png;base64,...', 'dest', '1', function(err, filepath) {});
        fulfill(body);
    });
  }
*/

router.get( '/abc' , async (ctx,next) => {
    //var body = ctx.request.body;
    console.log("body i yazıyor")
    //base64Img.img(body.img, 'dest', '2', function(err, filepath) {});
    ctx.body = "wow";
    //const results = await postFirstParagraph(ctx);
    //ctx.redirect("http://localhost:8000");
});

router.post( '/detect' , koaBody(), async (ctx,next) => {
    var body = ctx.request.body;
    console.log("body i yazıyor2")
    console.log(JSON.stringify(body));
    base64Img.img(body.img, 'dest', '2', function(err, filepath) {});
    ctx.body = "wow";
    //const results = await postFirstParagraph(ctx);
    //ctx.redirect("http://localhost:8000");
});

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(8080)
