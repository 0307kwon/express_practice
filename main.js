
const fs = require("fs");
const compression = require('compression');
const helmet = require('helmet');

//Routers
const topicRouter = require('./routers/topic.js');
const homeRouter = require('./routers/home.js');
const registRouter = require('./routers/regist.js');
//

//express
const express = require("express");
const app = express();
const port = 3000;
//

const POST_FOLDER = "./nodejs/post";


const bodyParser = require('body-parser');
const { response } = require("express");
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get("*",(request,response,next)=>{
    fs.readdir(POST_FOLDER,(err, folder_list) => {
        if(err) throw err;
        request.list = folder_list;
        next();
    });
});
app.use(express.static("public"));


app.use('/',homeRouter);

app.use('/topic', topicRouter);

app.use('/regist',registRouter);

app.use((request,response,next) => {
    response.status(404).send("not found");
});

app.use((err,request,response,next) => {
    response.status(500).send("post doesn't exist");
});

app.listen(port, () =>{
    console.log(`localhost:${port}`);
})




/*
const http = require("http");
const fs = require("fs");
const url = require("url");
const templeteObj = require("./lib/templeteObj.js");
const redirectObj = require("./lib/redirectObj.js");
const path = require("path");
const preprocessObj = require("./lib/preprocessObj.js");
const pageObj = require("./lib/pageObj.js");


function secureQuery(data){
    return path.parse(data);
}

const app = http.createServer(function(request,response){
    let url_requested = request.url;
    const queryData = url.parse(url_requested,true).query;
    const pathname =url.parse(url_requested,true).pathname;
    const folder = "./nodejs/post";

    let titleInQueryData;
    fs.readdir(folder,(err, folder_list) => {
        if(err) throw err;

        response.writeHead(200);
        titleInQueryData = queryData.id;
        if(titleInQueryData !== undefined){
            titleInQueryData = secureQuery(queryData.id).base;
        }
        const list_templete = templeteObj.getList(folder_list);
        if(pathname === '/'){
            const sanitizedTitle = preprocessObj.cleanText(titleInQueryData);
            if(sanitizedTitle === "undefined"){ //welcome page
                pageObj.welcome_page(response,list_templete);
            }else{ // read
                pageObj.viewPost_page(response,sanitizedTitle,list_templete);
            }
        }else if(pathname === "/create"){
            pageObj.createPost_page(response,list_templete,queryData);
        }else if(pathname === "/update"){
            pageObj.updatePost_page(response,titleInQueryData,list_templete,queryData);
        }else if(pathname === "/delete"){
            pageObj.deletePost_page(response,titleInQueryData,list_templete);
        }else if(pathname === "/process_create"){
            if(request.method === "POST"){  
                redirectObj.createPost(request,response);
            }
        }else if(pathname === "/process_update"){
            if(request.method === "POST"){  
                redirectObj.updatePost(request,response);
            }
        }else{
            response.writeHead(404);
            response.end("Not Found");
        }    
    });
});
app.listen(3000);
*/