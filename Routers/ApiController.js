const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
router.use(bodyParser.json());
const repo = require('../Repo');
const jwt = require('jsonwebtoken');
const jwtSecret = "leavetrackerjwtsupersecret";
const excelGenerator = require('../Utils/ExcelGenerator');

router.get("/jaba",async (req, res) => {
    try {
        const grades = await repo.getGrades();
        res.send(grades);
    } catch (error) {
        console.log(error);
        res.send([]);
    }
});

router.get("/getGrades",async (req, res) => {
    try {
        const grades = await repo.getGrades();
        res.send(grades);
    } catch (error) {
        console.log(error);
        res.send([]);
    }
});

router.get("/getBands",async (req, res) => {
    try {
        const bands = await repo.getBands();
        res.send(bands);
    } catch (error) {
        console.log(error);
        res.send([]);
    }
});

router.get("/getTeams",async (req, res) => {
    try {
        const teams = await repo.getTeams();
        res.send(teams);
    } catch (error) {
        console.log(error);
        res.send([]);
    }
});

router.get("/getTeam/:id",async (req, res) => {
    try {
        let teamId = req.params.id;
        console.log(teamId);
        const teamDetails = await repo.getTeamById(teamId);
        console.log(teamDetails);
        res.send(teamDetails);
    } catch (error) {
        console.log(error);
        res.send([]);
    }
});

router.get("/getTeamLeaveDetails/:id",async (req, res) => {
    try {
        let teamId = req.params.id;
        console.log(teamId);
        const teamDetails = await repo.getTeamLeaveDetailsById(teamId);
        console.log(teamDetails);
        res.send(teamDetails);
    } catch (error) {
        console.log(error);
        res.send([]);
    }
});


router.get("/getAllLeaves/:leaveDateFrom/:leaveDateTo",async (req, res) => {
    try {
        let fromDate = req.params.leaveDateFrom;
        let toDate = req.params.leaveDateTo;
        const leaves = await repo.getAllLeaves(fromDate, toDate);
        console.log(leaves);
        res.send(leaves);
    } catch (error) {
        console.log(error);
        res.send([]);
    }
});

router.get("/getAllDSM/:dsmDateFrom/:dsmDateTo",async (req, res) => {
    try {
        let fromDate = req.params.dsmDateFrom;
        let toDate = req.params.dsmDateTo;
        const dsms = await repo.getAllDSM(fromDate, toDate);
        console.log(dsms);
        res.send(dsms);
    } catch (error) {
        console.log(error);
        res.send([]);
    }
});


router.get("/getRoles",async (req, res) => {
    try {
        const roles = await repo.getRoles();
        res.send(roles);
    } catch (error) {
        console.log(error);
        res.send([]);
    }
});

router.get("/populateAddMember",async (req, res) => {
    try {
        const grades = await repo.getGrades();
        const bands = await repo.getBands();
        const teams = await repo.getTeams();
        const roles = await repo.getRoles();
        res.send({"grades" : grades, 
                 "bands" : bands, 
                 "teams" : teams, 
                 "roles" : roles});
    } catch (error) {
        console.log(error);
        res.send({});
    }
});

router.get("/getMemberById/:empid",async (req, res) => {
    try {
        const member = await repo.searchMemberByEmpId(req.params.empid);
        res.send(member);
    } catch (error) {
        console.log(error);
        res.send({});
    }
});

router.get("/deleteLeaveById/:leaveId",async (req, res) => {
    let leaveId = req.params.leaveId;
    console.log('hit : ' + leaveId)
    try {
        const deletedRows = await repo.deleteLeaveById(leaveId);
        console.log('deletedRows : ' + deletedRows);
        res.send({id : deletedRows});
    } catch (error) {
        console.log("error deleteLeaveById --> " + error);
        res.send({id : 0});
    }
});

router.get("/getMember/:id",async (req, res) => {
    console.log('hit : ' + req.params.id)
    try {
        const member = await repo.searchMemberById(req.params.id);
        res.send(member);
    } catch (error) {
        console.log(error);
        res.send([]);
    }
});

router.get("/leaveReport/:leaveDateFrom/:leaveDateTo",async (req, res) => {
    try {
        let fromDate = req.params.leaveDateFrom;
        let toDate = req.params.leaveDateTo;
        const leaves = await repo.getAllLeaves(fromDate, toDate);
        if(leaves && leaves.length) {
            leaves.forEach(l => {
                l.LEAVE_DATE = new Date(l.LEAVE_DATE).toLocaleDateString();
            });
            let wb = excelGenerator.generateLeaveReport(leaves);
            wb.write('LeaveReport.xlsx', res);
        }
    } catch (error) {
        console.log(error);
        res.send([]);
    } 
});

router.get("/dsmReport/:dsmDateFrom/:dsmDateTo",async (req, res) => {
    try {
        let fromDate = req.params.dsmDateFrom;
        let toDate = req.params.dsmDateTo;
        const dsms = await repo.getAllDSM(fromDate, toDate);
        if(dsms && dsms.length) {
            dsms.forEach(d => {
                d.DSM_DATE = new Date(d.DSM_DATE).toLocaleDateString();
                d.PRESENT = d.PRESENT? 'Yes' : 'No';
            });
            let wb = excelGenerator.generateLeaveReport(dsms);
            wb.write('DSMReport.xlsx', res);
        }
    } catch (error) {
        console.log(error);
        res.send([]);
    }
});

router.get("/dsmColumnChart/:dsmDateFrom/:dsmDateTo",async (req, res) => {
    try {
        let fromDate = req.params.dsmDateFrom;
        let toDate = req.params.dsmDateTo;
        const dsnByTeam = await repo.getDSMByTeam(fromDate, toDate);
        const countByTeam = await repo.getCountByTeam(fromDate, toDate);
        const obj = {};
        obj.dsnByTeam =dsnByTeam;
        obj.countByTeam = countByTeam;
        return res.send(obj);
    } catch (error) {
        console.log(error);
        res.send([]);
    }
});

module.exports = router;