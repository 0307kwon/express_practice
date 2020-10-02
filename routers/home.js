const express = require('express');
const router = express.Router();


const pageObj = require("../lib/pageObj.js");
const templeteObj = require("../lib/templeteObj.js");


router.get('/',(request,response) =>{
    const list_templete = templeteObj.getList(request.list);
    const templete = pageObj.welcome_page(list_templete);
    response.send(templete);
});

module.exports = router;