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

const { detectRectangles } = require('../build/detectRectangles.js');
const { generateHtml } = require('../build/codegen/html.js');
const { generateLayout } = require('../build/codegen/layout.js');

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

app.use(async (ctx, next) => {
    try {
        await next();
    } catch(err) {
        console.log(err.stack);
        ctx.status = 500;
        ctx.body = {
            status: 500,
            message: "Bir hata oldu."
        };
        app.emit(err);
    }
});

router.get( '/getBoxTree' , async (ctx,next) => {
    const rectangles = detectRectangles('./webservice/dest/uploadedimage.jpg');
    const layout = generateLayout(rectangles);

    ctx.body = {
        status: 200,
        message: "Successful",
        layout
    };
});

router.get( '/getHtml', async (ctx, next) => {
    const rectangles = detectRectangles('./webservice/dest/uploadedimage.jpg');
    const html = generateHtml(rectangles);

    ctx.body = {
        status: 200,
        message: "Successful",
        html
    };
});

router.post( '/uploadImage' , koaBody(), async (ctx,next) => {
    var body = ctx.request.body;
    base64Img.img(body.img, 'dest', 'uploadedimage', function(err, filepath) {});

    ctx.body = {
        status: 200,
        message: "Successful"
    };
});

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(8080)
