const preprocessObj = require("./lib/preprocessObj.js");
const pageObj = require("./lib/pageObj.js");
const templeteObj = require("./lib/templeteObj.js");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");

const express = require("express");
const { request } = require("http");
const { response } = require("express");
const app = express();
const port = 3000;

const POST_FOLDER = "./nodejs/post";

app.get('/',(request,response) =>{
    fs.readdir(POST_FOLDER,(err, folder_list) => {
        if(err) throw err;
        const list_templete = templeteObj.getList(folder_list);
        const templete = pageObj.welcome_page(list_templete);
        response.send(templete);
    });
});

app.get("/post/:postName", (request,response) => {
    fs.readdir(POST_FOLDER,(err, folder_list) => {
        const title = request.params.postName;
        const list_templete = templeteObj.getList(folder_list);

        fs.readFile(`nodejs/post/${title}`,"utf8",(err, fileContents) => {
            if(err) throw err;
            const control = `<a href="/create">create</a>
            <a href="/update?id=${title}">update</a>
            <a href="/delete?id=${title}">delete</a>`;
            const templete = templeteObj.getEntire(title,list_templete,fileContents,control);
            response.send(templete);
        });
    });
});

app.get("/create", (request,response) => {
    fs.readdir(POST_FOLDER,(err, folder_list) => {
        const url_requested = request.url;
        const queryData = url.parse(url_requested,true).query;
        let title = "Create Post";
        const list_templete = templeteObj.getList(folder_list);
        if(queryData.alert){
            title += `<script>alert("제목은 1자 이상으로 입력해주세요")</script>`;
        }
        const Createcontents = templeteObj.getCreate();
        const templete = templeteObj.getEntire(title,list_templete,Createcontents,``);
        response.send(templete);
    });
});

app.post("/process_create", (request,response) =>{
    let body = "";
    request.on('data', chunk => {
        body += chunk.toString();
    });
    request.on('end' , () => {   
        body = querystring.parse(body);
        const sanitizeTitle = preprocessObj.cleanText(body.title);
        const sanitizeContents = preprocessObj.cleanText(body.contents);
        if(checkRightTitle(sanitizeTitle)){
            fs.writeFile(`./nodejs/post/${sanitizeTitle}`,`${sanitizeContents}`,"utf8", (err) => {
                if(err) throw err;
                response.redirect(`/post/${encodeURIComponent(sanitizeTitle)}`);
    
            });
        }else{
            response.redirect(`/create?alert=true`);
        }
    });
});

app.get("/update" , (request,response) => {
    fs.readdir(POST_FOLDER,(err, folder_list) => {
        const list_templete = templeteObj.getList(folder_list);
        const url_requested = request.url;
        const queryData = url.parse(url_requested,true).query;

        let title = "Update Post";
        
        if(queryData.alert){
            title += `<script>alert("제목은 1자 이상으로 입력해주세요")</script>`;
        }
        const title_origin = queryData.id;
        fs.readFile(`nodejs/post/${title_origin}`,"utf8",(err, fileContents) => {
            const createContents = templeteObj.getUpdate(title_origin,fileContents);
            const templete = templeteObj.getEntire(title,list_templete,createContents,``);
            response.send(templete);
        });
    }); 
});

app.post("/process_update" , (request,response) => {
    fs.readdir(POST_FOLDER,(err, folder_list) => {
        let body = "";
        request.on('data', chunk => {
            body += chunk.toString();
        });
    
        request.on('end' , () => {   
            body = querystring.parse(body);
            const sanitizeTitleOrigin = preprocessObj.cleanText(body.title_origin);
            const sanitizeTitleRevision = preprocessObj.cleanText(body.title_revision);
            const sanitizeContents = preprocessObj.cleanText(body.contents);
            if(checkRightTitle(sanitizeTitleRevision)){
            fs.rename(`./nodejs/post/${sanitizeTitleOrigin}`, `./nodejs/post/${sanitizeTitleRevision}`, function (err) {
                if (err) throw err;
                fs.writeFile(`./nodejs/post/${sanitizeTitleRevision}`, sanitizeContents, function (err) {
                    if (err) throw err;
                    response.redirect(`/post/${encodeURIComponent(sanitizeTitleRevision)}`);
                  });
              });
            }else{
                response.redirect(`/update?id=${encodeURIComponent(sanitizeTitleOrigin)}&alert=true`);
            }
        });
    });
});

app.get("/delete", (request,response) => {
        const url_requested = request.url;
        const queryData = url.parse(url_requested,true).query;
        const title = queryData.id;

        fs.unlink(`nodejs/post/${title}`, function (err) {
            if (err) throw err;
            console.log('File deleted!');
            fs.readdir(POST_FOLDER,(err, folder_list) => {
                if (err) throw err;
                const list_templete = templeteObj.getList(folder_list);
                const deleteContents = templeteObj.getDelete();
                const templete = templeteObj.getEntire(``,list_templete,deleteContents,``);
                response.send(templete);
          });
        });
});

app.listen(port, () =>{
    console.log(`localhost:${port}`);
})

function checkRightTitle(title){
    if(title[0] == ' ' || title.length == 0){
        return false;
    }
    return true;
}



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