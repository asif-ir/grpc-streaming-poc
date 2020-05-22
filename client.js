const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("article.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const articlePackage = grpcObject.articlePackage;


const client = new articlePackage.ArticleService("localhost:7500", grpc.credentials.createInsecure());

console.log(client);

const article = process.argv[2];
console.log(`${article} article received`);

client.createArticle({
    "id": -1,
    "title": article,
}, (err, response) => {
    console.log("Received from server: " + JSON.stringify(response))
});

const call = client.readArticlesStream();
call.on("data", item => {
    console.log("Received from server: " + JSON.stringify(item))
});

call.on("end", e => console.log("Server closed"));