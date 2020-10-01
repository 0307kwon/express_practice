module.exports = {
    getEntire : function(title,list_templete,contents,control){
        return `
        <!doctype html>
        <html>
        <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        <ol>
            ${list_templete}
        </ol>
        ${control}
        <h2>${title}</h2>
        ${contents}
        </body>
        </html>
        `;
    },
    getList:function(folder_list){
        let list_templete = "";
        for(let i=0; i<folder_list.length; i++){
            const title = folder_list[i];
            list_templete +=`<li><a href="/topic/${title}">${title}</a></li>`
        }    
        return list_templete;
    },
    getCreate:function(){
        return `
        <form action="/topic/process_create" method="POST">
            <p><input type="text" name="title" placeholder="제목을 입력하세요"></p>
            <p>
                <textarea name="contents" placeholder="내용을 입력하세요"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
        `;
    },
    getUpdate:function(title_origin,contents_origin){
        return `
        <form action="/topic/process_update" method="POST">
        <input type="hidden" name="title_origin" value="${title_origin}">
        <p><input type="text" name="title_revision" placeholder="수정할 제목을 입력하세요." value="${title_origin}"></p>
        <p><textarea name="contents" placeholder="수정할 내용을 입력하세요">${contents_origin}</textarea></p>    
        <p><input type="submit"></p>
        </form>
        `;
    },
    getDelete:function(){
        return `
        <p>게시글이 삭제되었습니다.</p>
        <form action="/">
        <input type="submit" value="확인">
        </form>
        `;
    }

}