// DB 관련 함수를 호출하는 부분
const IdxAssociatedUserDB = require("./IdxAssociatedUserCRUD");

// express 관련 함수를 호출하는 부분
const express = require('express');
const IdxAssociatedUserRouter = express.Router();

IdxAssociatedUserRouter.post('/idxassociateduser', async (req, res) => {
    try {
        const result = await IdxAssociatedUserDB.create(req.body);
        res.status(200).json({
            message: "Idx Associated User DB create 성공시 1 or 데이터 리턴, 실패시 -1 or null",
            data: result,
        });
    } catch (error) {
        res.status(400).send(error.message+"/ create 실패");
    }
});

IdxAssociatedUserRouter.get('/idxassociateduser', async (req, res) => {
    try {
        const result = await IdxAssociatedUserDB.read(req.query);
        res.status(200).json({
            message: "Idx Associated User DB read 성공시 1 or 데이터 리턴, 실패시 -1 or null",
            data: result,
        });
    } catch (error) {
        res.status(400).send(error.message+"/ read 실패");
    }
});

IdxAssociatedUserRouter.delete('/idxassociateduser', async (req, res) => {
    try {
        const result = await IdxAssociatedUserDB.delete(req.body);
        res.status(200).json({
            message: "Idx Associated User DB delete 성공시 1 or 데이터 리턴, 실패시 -1 or null",
            data: result,
        });
    } catch (error) {
        res.status(400).send(error.message+"/ delete 실패");
    }
});


module.exports = IdxAssociatedUserRouter;