const express = require('express');
const router = express.Router();


const templeteObj = require("../lib/templeteObj.js");
const fs = require("fs");
const preprocessObj = require("../lib/preprocessObj.js");
const url = require("url");

const POST_FOLDER = "./nodejs/post";


function checkRightTitle(title){
    if(title[0] == ' ' || title.length == 0){
        return false;
    }
    return true;
}


const deleteMiddleware = function(request,response,next){
    const url_requested = request.url;
    const queryData = url.parse(url_requested,true).query;
    const title = queryData.id;
    fs.unlink(`nodejs/post/${title}`, function (err) {
        if (err) throw err;
        fs.readdir(POST_FOLDER,(err, folder_list) => {
            if(err) throw err;
            request.list = folder_list;
            next();
        });
    });
}

router.get("/create", (request,response) => {
    const url_requested = request.url;
    const queryData = url.parse(url_requested,true).query;
    let title = "Create Post";
    const list_templete = templeteObj.getList(request.list);
    if(queryData.alert){
        title += `<script>alert("제목은 1자 이상으로 입력해주세요")</script>`;
    }
    const Createcontents = templeteObj.getCreate();
    const templete = templeteObj.getEntire(title,list_templete,Createcontents,``);
    response.send(templete);
});

router.post("/process_create",(request,response) =>{
    const title = request.body.title;
    const contents = request.body.contents;
    const sanitizeTitle = preprocessObj.cleanText(title);
    const sanitizeContents = preprocessObj.cleanText(contents);
    if(checkRightTitle(sanitizeTitle)){
        fs.writeFile(`./nodejs/post/${sanitizeTitle}`,`${sanitizeContents}`,"utf8", (err) => {
            if(err) throw err;
            response.redirect(`/topic/${encodeURIComponent(sanitizeTitle)}`);

        });
    }else{
        response.redirect(`/create?alert=true`);
    }
});



router.get("/update" , (request,response) => {
    const list_templete = templeteObj.getList(request.list);
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

router.post("/process_update" , (request,response) => {
    const title_origin = request.body.title_origin;
    const title_revision = request.body.title_revision;
    const contents = request.body.contents;

    const sanitizeTitleOrigin = preprocessObj.cleanText(title_origin);
    const sanitizeTitleRevision = preprocessObj.cleanText(title_revision);
    const sanitizeContents = preprocessObj.cleanText(contents);
    if(checkRightTitle(sanitizeTitleRevision)){
        fs.rename(`./nodejs/post/${sanitizeTitleOrigin}`, `./nodejs/post/${sanitizeTitleRevision}`, function (err) {
            if (err) throw err;
            fs.writeFile(`./nodejs/post/${sanitizeTitleRevision}`, sanitizeContents, function (err) {
                if (err) throw err;
                response.redirect(`/topic/${encodeURIComponent(sanitizeTitleRevision)}`);
            });
        });
    }else{
        response.redirect(`/topic/update?id=${encodeURIComponent(sanitizeTitleOrigin)}&alert=true`);
        }
});


router.get("/delete", deleteMiddleware, (request,response) => {
    console.log('File deleted!');
    const list_templete = templeteObj.getList(request.list);
    const deleteContents = templeteObj.getDelete();
    const templete = templeteObj.getEntire(``,list_templete,deleteContents,``);
    response.send(templete);
});

router.get("/:postName", (request,response,next) => {
    const title = request.params.postName;
    const list_templete = templeteObj.getList(request.list);

    fs.readFile(`nodejs/post/${title}`,"utf8",(err, fileContents) => {
        if(err) {
            next(err);
        }else{
            const control = `<a href="/topic/create">create</a>
            <a href="/topic/update?id=${title}">update</a>
            <a href="/topic/delete?id=${title}">delete</a>`;
            const templete = templeteObj.getEntire(title,list_templete,fileContents,control);
            response.send(templete);
        }
    });
});

module.exports = router;