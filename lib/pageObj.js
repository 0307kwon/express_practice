const templeteObj = require("./templeteObj.js");
const fs = require("fs");

module.exports = {
    welcome_page:function(response,list_templete){
        const title = "welcome";
        const welcomeContents = "hi friend";
        const control = `<a href="/create">create</a>`
        const templete = templeteObj.getEntire(title,list_templete,welcomeContents,control);
        response.end(templete);
    },
    viewPost_page:function(response,sanitizedTitle,list_templete){
        fs.readFile(`nodejs/post/${sanitizedTitle}`,"utf8",(err, fileContents) => {
            if(err) throw err;
            const control = `<a href="/create">create</a>
            <a href="/update?id=${sanitizedTitle}">update</a>
            <a href="/delete?id=${sanitizedTitle}">delete</a>`;
            const templete = templeteObj.getEntire(sanitizedTitle,list_templete,fileContents,control);
            response.end(templete);
        });
    },
    createPost_page:function(response,list_templete,queryData){
        let title = "Create Post";
        if(queryData.alert){
           title += `<script>alert("제목은 1자 이상으로 입력해주세요")</script>`;
        }
        const Createcontents = templeteObj.getCreate();
        const templete = templeteObj.getEntire(title,list_templete,Createcontents,``);
        response.end(templete); 
    },
    updatePost_page:function(response,titleInQueryData,list_templete,queryData){
        let title = "Update Post";
        if(queryData.alert){
            title += `<script>alert("제목은 1자 이상으로 입력해주세요")</script>`;
        }
        const title_origin = titleInQueryData;
        fs.readFile(`nodejs/post/${title_origin}`,"utf8",(err, fileContents) => {
        const createContents = templeteObj.getUpdate(title_origin,fileContents);
        const templete = templeteObj.getEntire(title,list_templete,createContents,``);
        response.end(templete);
        });
    },
    deletePost_page:function(response,titleInQueryData,list_templete){
        const title = titleInQueryData;
        fs.unlink(`nodejs/post/${title}`, function (err) {
            if (err) throw err;
            console.log('File deleted!');
            const deleteContents = templeteObj.getDelete();
            const templete = templeteObj.getEntire(``,list_templete,deleteContents,``);
            response.end(templete);
        });
    }
}