const { request, response } = require('express');
const express = require('express');
const router  = express.Router();




router.get("/nickname", (request,response) => {
    const nickname = request.query.nickname;
    response.redirect(`/`);
});




module.exports = router;