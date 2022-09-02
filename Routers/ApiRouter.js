const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
router.use(bodyParser.json());
const repo = require('../Repo');
const jwt = require('jsonwebtoken');
const jwtSecret = "leavetrackerjwtsupersecret";
const excelGenerator = require('../Utils/ExcelGenerator');
const Joi = require('@hapi/joi');
const validator = require('./Validation-Schemas/Schema-Hapi');
const postApiMiddleware = require('../Routers/Vakidation-Middleware/PostValidationMiddleware');

router.post("/login", postApiMiddleware(validator.LoginFormSchema), async (req, res) => {
    var loginForm = req.body;
    try {
        if(loginForm.username == "jaba" && loginForm.password == "jaba"){
            const token = jwt.sign({ "username": loginForm.username }, jwtSecret, { expiresIn: 1800 }) 
            let options = {
                maxAge: 1000 * 60 * 30,
                httpOnly: true
            };
            res.cookie('jwtToken', token, options);
            res.send({jwt : "true"});
        }else{
            res.send({jwt : "Invalid credential"});
        }
    } catch (error) {
        console.log(error);
        res.send({jwt : "Invalid token"});
    }
});

router.post("/logout",async (req, res) => {
    res.clearCookie('jwtToken');
    res.send({jwt : "logout"});  
});


router.post("/addMember", postApiMiddleware(validator.AddMemberSchema),async (req, res) => {
    console.log('hit : ' + req.body)
    try {
        const insertedId = await repo.saveMember(req.body);
        console.log('insertedId : ' + insertedId)
        res.send({id : insertedId});
    } catch (error) {
        console.log("error addMember --> " + error);
        res.send({id : 0});
    }
});

router.post("/updateMember",async (req, res) => {
    console.log('hit : ' + req.body)
    try {
        const affectedRows = await repo.updateMember(req.body);
        console.log('affectedRows : ' + affectedRows)
        res.send({id : affectedRows});
    } catch (error) {
        console.log("error updateMember --> " + error);
        res.send({id : 0});
    }
});

router.post("/updateLeave",async (req, res) => {
    console.log('hit : ' + req.body)
    try {
        const affectedRows = await repo.updateLeave(req.body);
        console.log('affectedRows : ' + affectedRows)
        res.send({id : affectedRows});
    } catch (error) {
        console.log("error updateLeave --> " + error);
        res.send({id : 0});
    }
});

router.post("/deleteMember",async (req, res) => {
    console.log('hit : ' + req.body)
    try {
        const affectedRows = await repo.deleteMember(req.body);
        console.log('affectedRows : ' + affectedRows)
        res.send({id : affectedRows});
    } catch (error) {
        console.log("error deleteMember --> " + error);
        res.send({id : 0});
    }
});

router.post("/addLeave", postApiMiddleware(validator.LeaveUpdateSchema), async (req, res) => {
    console.log('hit : ' + req.body)
    try {
        const deletedRows = await repo.deleteLeave(req.body);
        console.log('deletedRows : ' + deletedRows);
        const insertedId = await repo.saveLeave(req.body);
        console.log('insertedId : ' + insertedId);
        res.send({id : insertedId});
    } catch (error) {
        console.log("error addLeave --> " + error);
        res.send({id : 0});
    }
});


router.post("/addDSMUpdate", postApiMiddleware(validator.DSMUpdateSchema), async (req, res) => {
    console.log('hit : ' + req.body)
    var dsmArr = req.body;
    try {
        dsmArr.forEach(async dsm => {
            var rows = await repo.isDSMInserted(dsm);
            console.log('resp.length :' + rows.length);
            if(rows && rows.length > 0){
                const updatedRows = await repo.updateDSMUpdate(dsm);
                console.log('updatedRows : ' + updatedRows)
            }else{
                const insertedId = await repo.saveDSMUpdate(dsm);
                console.log('insertedId : ' + insertedId)
            }
        });  
        res.send({msg : 'done'});
    } catch (error) {
        console.log("error addDSMUpdate --> " + error);
        res.send({id : 0});
    }
});

router.post("/addGrade", postApiMiddleware(validator.AddGradeSchema), async (req, res) => {
    console.log('hit : ' + req.body)
    try {
        const insertedId = await repo.saveGrade(req.body);
        console.log('insertedId : ' + insertedId)
        res.send({id : insertedId});
    } catch (error) {
        console.log("error addGrade --> " + error);
        res.send({id : 0});
    }
});

router.post("/addBand", postApiMiddleware(validator.AddBandSchema), async (req, res) => {
    console.log('hit : ' + req.body)
    try {
        const insertedId = await repo.saveBand(req.body);
        console.log('insertedId : ' + insertedId)
        res.send({id : insertedId});
    } catch (error) {
        console.log("error addBand --> " + error);
        res.send({id : 0});
    }
});

router.post("/addTeam",postApiMiddleware(validator.AddTeamSchema), async (req, res) => {
    console.log('hit : ' + req.body)
    try {
        const insertedId = await repo.saveTeam(req.body);
        console.log('insertedId : ' + insertedId)
        res.send({id : insertedId});
    } catch (error) {
        console.log("error addTeam --> " + error);
        res.send({id : 0});
    }
});

router.post("/addRole",postApiMiddleware(validator.AddRoleSchema), async (req, res) => {
    console.log('hit : ' + req.body)
    try {
        const insertedId = await repo.saveRole(req.body);
        console.log('insertedId : ' + insertedId)
        res.send({id : insertedId});
    } catch (error) {
        console.log("error addRole --> " + error);
        res.send({id : 0});
    }
});

router.post("/deleteTeam",async (req, res) => {
    console.log('hit : ' + req.body)
    try {
        const deletedRows = await repo.deleteTeam(req.body);
        console.log('deletedRow(s) : ' + deletedRows)
        res.send({deletedRows : deletedRows});
    } catch (error) {
        console.log("error addTeam --> " + error);
        res.send({deletedRows : 0});
    }
});

router.post("/deleteGrade",async (req, res) => {
    console.log('hit : ' + req.body)
    try {
        const deletedRows = await repo.deleteGrade(req.body);
        console.log('deletedRow(s) : ' + deletedRows)
        res.send({deletedRows : deletedRows});
    } catch (error) {
        console.log("error addTeam --> " + error);
        res.send({deletedRows : 0});
    }
});

router.post("/deleteBand",async (req, res) => {
    console.log('hit : ' + req.body)
    try {
        const deletedRows = await repo.deleteBand(req.body);
        console.log('deletedRow(s) : ' + deletedRows)
        res.send({deletedRows : deletedRows});
    } catch (error) {
        console.log("error addTeam --> " + error);
        res.send({deletedRows : 0});
    }
});

router.post("/deleteRole",async (req, res) => {
    console.log('hit : ' + req.body)
    try {
        const deletedRows = await repo.deleteRole(req.body);
        console.log('deletedRow(s) : ' + deletedRows)
        res.send({deletedRows : deletedRows});
    } catch (error) {
        console.log("error addTeam --> " + error);
        res.send({deletedRows : 0});
    }
});

router.post("/searchMember",async (req, res) => {
    console.log('hit : ' + req.body)
    try {
        const members = await repo.searchMember(req.body);
        res.send(members);
    } catch (error) {
        console.log(error);
        res.send([]);
    }
});

module.exports = router;
