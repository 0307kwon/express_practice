const querystring = require("querystring");
const fs = require("fs");
const preprocessObj = require("./preprocessObj.js");

function checkRightTitle(title){
    if(title[0] == ' ' || title.length == 0){
        return false;
    }
    return true;
}

module.exports = {
    createPost:function(request,response){
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
                    response.writeHead(302,{Location:`/?id=${encodeURIComponent(sanitizeTitle)}`});
                    response.end();
        
                });
            }else{
                response.writeHead(302,{Location:`/create?alert=true`});
                response.end();
            }
        });
    },
    updatePost:function(request,response){
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
                    response.writeHead(302,{Location:`/?id=${encodeURIComponent(sanitizeTitleRevision)}`});
                    response.end();
                  });
              });
            }else{
                response.writeHead(302,{Location:`update?id=${encodeURIComponent(sanitizeTitleOrigin)}&alert=true`});
                response.end();
            }
        });
    }
}