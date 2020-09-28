const fs = require('fs');



function init(){
    console.log("gkgk");
    fs.readFile("sample.txt",'utf8',(err,data) => {
        if(err) throw err;
        console.log(data);
    });
}
init();

