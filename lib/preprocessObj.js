const sanitizeHtml = require("sanitize-html");


module.exports = {
    cleanText:function(text){
        let sanitizeText = sanitizeHtml(text);
        let lastWordIdx = 0;
        for(let i=0; i<sanitizeText.length; i++){   
            if(sanitizeText[i] !== ' '){
                lastWordIdx = i;
            }
        }
        const out = sanitizeText.substring(0,lastWordIdx+1);
        return out;
    }
}