const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("article.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const articlePackage = grpcObject.articlePackage;

// Create server
const server = new grpc.Server();
server.bind("0.0.0.0:7500", grpc.ServerCredentials.createInsecure());
console.info("Server running on port 7500");

// Register functionality
server.addService(articlePackage.ArticleService.service,
    {
        "createArticle": createArticle,
        "readArticlesStream": readArticlesStream
    });
server.start();

// Functions
const articles = [];

function createArticle(call, cb) {
    console.log("createArticle called");

    const article = {
        "id": articles.length + 1,
        "title": call.request.title
    };
    articles.push(article);
    cb(null, article);
}

function readArticlesStream(call, cb) {
    console.log("readArticlesStream called");

    articles.forEach(t => call.write(t));
    call.end();
}