const templeteObj = require("./templeteObj.js");
const fs = require("fs");

module.exports = {
    welcome_page:function(list_templete){
        const title = "welcome";
        const control = `<a href="/topic/create">create</a>`
        const welcomeContents = `hi friend
        <image src="/images/welcome.jpg" style="width:300px; display:block; margin-top:10px">`;
        const return_templete = templeteObj.getEntire(title,list_templete,welcomeContents,control);
        return return_templete;
    },
    viewPost_page:function(title,list_templete){
        fs.readFile(`nodejs/post/${title}`,"utf8",(err, fileContents) => {
            if(err) throw err;
            const control = `<a href="/create">create</a>
            <a href="/update?id=${title}">update</a>
            <a href="/delete?id=${title}">delete</a>`;
            const templete = templeteObj.getEntire(title,list_templete,fileContents,control);
            const return_templete = templete;
            return return_templete;
        });
        
    },
    createPost_page:function(list_templete,queryData){
        let title = "Create Post";
        if(queryData.alert){
           title += `<script>alert("제목은 1자 이상으로 입력해주세요")</script>`;
        }
        const Createcontents = templeteObj.getCreate();
        const return_templete = templeteObj.getEntire(title,list_templete,Createcontents,``);
        return return_templete;
    },
    updatePost_page:function(titleInQueryData,list_templete,queryData){
        let title = "Update Post";
        if(queryData.alert){
            title += `<script>alert("제목은 1자 이상으로 입력해주세요")</script>`;
        }
        const title_origin = titleInQueryData;
        fs.readFile(`nodejs/post/${title_origin}`,"utf8",(err, fileContents) => {
        const createContents = templeteObj.getUpdate(title_origin,fileContents);
        const return_templete = templeteObj.getEntire(title,list_templete,createContents,``);
        return return_templete;
        });
        
    },
    deletePost_page:function(titleInQueryData,list_templete){
        const title = titleInQueryData;
        fs.unlink(`nodejs/post/${title}`, function (err) {
            if (err) throw err;
            console.log('File deleted!');
            const deleteContents = templeteObj.getDelete();
            const return_templete = templeteObj.getEntire(``,list_templete,deleteContents,``);
            return return_templete;
        });
        
    }
}