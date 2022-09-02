const path = require('path');
const sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database(path.resolve(__dirname, './LEAVE_TRACKER.db'));

exports.searchMember = (criteria) => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT ID, EMPID, NAME, SIA_EMAIL, TEAM_ID FROM ASSOCIATE WHERE EMPID like ? OR NAME like ? OR TEAM_ID = ?';
        db.all(sql, [
            '%' + (criteria.empId == "" ? '{}' : criteria.empId) + '%', 
            '%' + (criteria.empName == "" ? '{}' : criteria.empName) + '%', 
            parseInt(criteria.empTeam)
        ], (err, rows) => {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log(rows);
            resolve(rows);
        });
    });
};

exports.searchMemberById = (id) => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT ID, EMPID, NAME, SIA_EMAIL FROM ASSOCIATE WHERE ID = ?';
        db.get(sql, [id], (err, row) => {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log(row);
            resolve(row);
        });
    });
};

exports.searchMemberByEmpId = (id) => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM ASSOCIATE WHERE EMPID = ?';
        db.get(sql, [id], (err, row) => {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log(row);
            resolve(row);
        });
    });
};

exports.getGrades = () => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM GRADE WHERE DELETED=? ORDER BY ID DESC';
        db.all(sql, [0], (err, rows) => {
            if(err){
                reject(err)
            }
            resolve(rows);
        });
    });
};

exports.getBands = () => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM BAND WHERE DELETED=? ORDER BY ID DESC';
        db.all(sql, [0], (err, rows) => {
            if(err){
                reject(err)
            }
            resolve(rows);
        });
    });
};

exports.getTeams = () => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM TEAM WHERE DELETED=? ORDER BY ID DESC';
        db.all(sql, [0], (err, rows) => {
            if(err){
                reject(err)
            }
            resolve(rows);
        });
    });
};

exports.getTeamById = (id) => {
    return new Promise((resolve, reject) => {

        let sql = `SELECT t.ID AS TEAM_ID, t.NAME AS TEAM_NAME, t.DESC, a.ID AS ASSO_ID, 
        a.NAME AS ASSO_NAME, a.EMPID, a.SIA_EMAIL FROM TEAM t 
        INNER JOIN ASSOCIATE a ON t.ID = a.TEAM_ID WHERE t.ID = ?
        ORDER BY ASSO_NAME ASC`;

        db.all(sql, [id], (err, rows) => {
            if(err){
                console.log(err);
                reject(err)
            }
            resolve(rows);
        });
    });
};

exports.getTeamLeaveDetailsById = (id) => {
    return new Promise((resolve, reject) => {

        let sql =  `SELECT a.ID AS ASSO_ID, a.EMPID, a.NAME AS EMPNAME, t.NAME AS TEAM_NAME, 
                    l.ID AS LEAVE_ID, lt.LEAVE_NAME, lt.ID AS LEAVE_TYPE_ID, l.LEAVE_DATE ,l.REMARK FROM ASSOCIATE a INNER JOIN TEAM t
                    ON a.TEAM_ID = t.ID INNER JOIN LEAVES l
                    ON l.ASSOCIATE_ID = a.ID INNER JOIN LEAVE_TYPES lt
                    ON l.LEAVE_TYPE_ID = lt.ID WHERE t.ID = ? ORDER BY l.LEAVE_DATE DESC`;

        db.all(sql, [id], (err, rows) => {
            if(err){
                console.log(err);
                reject(err)
            }
            resolve(rows);
        });
    });
};

exports.getAllLeaves = (fromDate, toDate) => {
    return new Promise((resolve, reject) => {
        let sql =  `SELECT a.ID AS ASSO_ID, a.EMPID, a.NAME AS EMPNAME, t.NAME AS TEAM_NAME, 
                    l.ID AS LEAVE_ID, lt.LEAVE_NAME, lt.ID AS LEAVE_TYPE_ID, l.LEAVE_DATE ,l.REMARK FROM ASSOCIATE a INNER JOIN TEAM t
                    ON a.TEAM_ID = t.ID INNER JOIN LEAVES l
                    ON l.ASSOCIATE_ID = a.ID INNER JOIN LEAVE_TYPES lt
                    ON l.LEAVE_TYPE_ID = lt.ID WHERE l.LEAVE_DATE BETWEEN ? AND ?
                    ORDER BY l.LEAVE_DATE DESC`;

        db.all(sql, [fromDate, toDate], (err, rows) => {
            if(err){
                console.log(err);
                reject(err)
            }
            resolve(rows);
        });
    });
};

exports.getAllDSM = (fromDate, toDate) => {
    return new Promise((resolve, reject) => {
        let sql =  `SELECT a.ID AS ASSO_ID, a.EMPID, a.NAME AS EMPNAME, t.NAME AS TEAM_NAME , 
                    d.ID AS DSM_ID, d.DSM_DATE, d.PRESENT FROM ASSOCIATE a 
                    INNER JOIN TEAM t ON a.TEAM_ID = t.ID
                    INNER JOIN DSM d ON a.ID = d.ASSOCIATE_ID
                    WHERE d.DSM_DATE BETWEEN ? AND ?
                    ORDER BY d.DSM_DATE  DESC`;

        db.all(sql, [fromDate, toDate], (err, rows) => {
            if(err){
                console.log(err);
                reject(err)
            }
            resolve(rows);
        });
    });
};


exports.getRoles = () => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM ROLE WHERE DELETED=? ORDER BY ID DESC';
        db.all(sql, [0], (err, rows) => {
            if(err){
                reject(err)
            }
            resolve(rows);
        });
    });
};

exports.saveMember = (member) => {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO ASSOCIATE (	 
            EMPID, NAME, MOB_NO, TCS_EMAIL, SIA_EMAIL, TCS_JOINED_DATE, 
            SIA_JOINED_DATE, DOB, DEP_BRANCH, SEAT_NO, SKILL_SET, TEAM_ID,
            BAND_ID, BAND_FROM, GRADE_ID, GRADE_FROM, ROLE_ID, DELETED
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        
        console.log(sql);
        console.log(JSON.stringify(member));
        db.run(sql, [
            parseInt(member.empId),
            member.empName,
            member.phoneNumber,
            member.tcsEmail,
            member.siaEmail,
            new Date(member.tcsJoiningDate).getTime(),
            new Date(member.siaJoiningDate).getTime(),
            new Date(member.dob).getTime(),
            member.depBranch,
            member.seatNumber,
            member.empSkillSet,
            parseInt(member.empTeam),
            parseInt(member.empBand),
            new Date(member.bandFrom).getTime(),
            parseInt(member.empGrade),
            new Date(member.gradeFrom).getTime(),
            parseInt(member.empRole),
            0
        ], function(err) {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log("lastID : " + this.lastID);
            resolve(this.lastID);
        });
    });
};

exports.updateMember = (member) => {
    return new Promise((resolve, reject) => {
        let sql = 
            `UPDATE ASSOCIATE SET 
                MOB_NO = ?, 
                DEP_BRANCH = ?, 
                SEAT_NO = ?, 
                SKILL_SET = ?, 
                TEAM_ID = ?,
                BAND_ID = ?,
                BAND_FROM = ?,
                GRADE_ID = ?, 
                GRADE_FROM = ?, 
                ROLE_ID = ?
            WHERE EMPID = ?`;
        console.log(sql);
        console.log(JSON.stringify(member));
        db.run(sql, [
            member.phoneNumber,
            member.depBranch,
            member.seatNumber,
            member.empSkillSet,
            parseInt(member.empTeam),
            parseInt(member.empBand),
            new Date(member.bandFrom).getTime(),
            parseInt(member.empGrade),
            new Date(member.gradeFrom).getTime(),
            parseInt(member.empRole),
            parseInt(member.empId)
        ], function(err) {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log("lastID : " + this.changes);
            resolve(this.changes);
        });
    });
};

exports.deleteMember = (member) => {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM ASSOCIATE WHERE EMPID = ?`;
        console.log(sql);
        console.log(JSON.stringify(member));
        db.run(sql, [
            parseInt(member.empId)
        ], function(err) {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log("lastID : " + this.changes);
            resolve(this.changes);
        });
    });
};

exports.saveGrade = (gradeDetails) => {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO GRADE (NAME, DESC, DELETED) VALUES (?,?,?)`;
        console.log(sql);
        console.log(JSON.stringify(gradeDetails));
        db.run(sql, [
            gradeDetails.gradeName,
            gradeDetails.gradeDesc,
            0
        ], function(err) {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log("lastID : " + this.lastID);
            resolve(this.lastID);
        });
    });
};

exports.saveLeave = (leaveDetails) => {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO LEAVES (LEAVE_DATE, REMARK, LEAVE_TYPE_ID, ASSOCIATE_ID) VALUES (?,?,?,?)`;
        console.log(sql);
        console.log(JSON.stringify(leaveDetails));
        db.run(sql, [
            new Date(leaveDetails.leaveDate).getTime(),
            leaveDetails.leaveReason,
            parseInt(leaveDetails.leaveType),
            parseInt(leaveDetails.memberId)
        ], function(err) {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log("lastID : " + this.lastID);
            resolve(this.lastID);
        });
    });
};

exports.deleteLeave = (leaveDetails) => {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM LEAVES WHERE ASSOCIATE_ID = ? AND LEAVE_DATE = ?`;
        console.log(sql);
        console.log(JSON.stringify(leaveDetails));
        db.run(sql, [
            parseInt(leaveDetails.memberId),
            new Date(leaveDetails.leaveDate).getTime()
        ], function(err) {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log("DELTED ROWS : " + this.changes);
            resolve(this.changes);
        });
    });
};

exports.deleteLeaveById = (leaveId) => {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM LEAVES WHERE ID = ?`;
        console.log(sql);
        db.run(sql, [
            parseInt(leaveId)
        ], function(err) {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log("DELTED ROWS : " + this.changes);
            resolve(this.changes);
        });
    });
};

exports.isDSMInserted = (dsmDetails) => {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM DSM WHERE DSM_DATE = ? AND ASSOCIATE_ID = ?";
        db.all(sql, [
            dsmDetails.attendDate,
            dsmDetails.assoId
        ], (err, rows) => {
            if(err){
                reject(err)
            }
            resolve(rows);
        });
    });
}

exports.updateDSMUpdate = (dsmDetails) => {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE DSM SET PRESENT = ? WHERE DSM_DATE = ? AND ASSOCIATE_ID =?`;
        console.log(sql);
        console.log(JSON.stringify(dsmDetails));
        db.run(sql, [
            dsmDetails.isPresent,
            dsmDetails.attendDate,
            parseInt(dsmDetails.assoId)
        ], function(err) {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log("updated rows : " + this.changes);
            resolve(this.changes);
        });
    });
};

exports.updateLeave = (updatedLeave) => {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE LEAVES 
                        SET LEAVE_DATE = ?, 
                        REMARK = ?, 
                        LEAVE_TYPE_ID = ?,
                        ASSOCIATE_ID = ?
                        WHERE ID = ?   `;
        console.log(sql);
        console.log(JSON.stringify(updatedLeave));
        db.run(sql, [
            new Date(updatedLeave.leaveDate).getTime(),
            updatedLeave.leaveReason,
            updatedLeave.leaveType,
            updatedLeave.assocId,
            updatedLeave.leaveId
        ], function(err) {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log("updated rows : " + this.changes);
            resolve(this.changes);
        });
    });
};

exports.saveDSMUpdate = (dsmDetails) => {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO DSM (DSM_DATE, PRESENT, ASSOCIATE_ID) VALUES (?,?,?)`;
        console.log(sql);
        console.log(JSON.stringify(dsmDetails));
        db.run(sql, [
            dsmDetails.attendDate,
            dsmDetails.isPresent,
            dsmDetails.assoId
        ], function(err) {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log("lastID : " + this.lastID);
            resolve(this.lastID);
        });
    });
};

exports.saveBand = (bandDetails) => {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO BAND (NAME, DESC, DELETED) VALUES (?,?,?)`;
        console.log(sql);
        console.log(JSON.stringify(bandDetails));
        db.run(sql, [
            bandDetails.bandName,
            bandDetails.bandDesc,
            0
        ], function(err) {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log("lastID : " + this.lastID);
            resolve(this.lastID);
        });
    });
};

exports.saveTeam = (teamDetails) => {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO TEAM (NAME, DESC, DELETED) VALUES (?,?,?)`;
        console.log(sql);
        console.log(JSON.stringify(teamDetails));
        db.run(sql, [
            teamDetails.teamName,
            teamDetails.teamDesc,
            0
        ], function(err) {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log("lastID : " + this.lastID);
            resolve(this.lastID);
        });
    });
};

exports.saveRole = (roleDetails) => {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO ROLE (NAME, DESC, DELETED) VALUES (?,?,?)`;
        console.log(sql);
        console.log(JSON.stringify(roleDetails));
        db.run(sql, [
            roleDetails.roleName,
            roleDetails.roleDesc,
            0
        ], function(err) {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log("lastID : " + this.lastID);
            resolve(this.lastID);
        });
    });
};

exports.deleteTeam = (teamDetails) => {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM TEAM WHERE ID=?`;
        console.log(sql);
        console.log(JSON.stringify(teamDetails));
        db.run(sql, [
            parseInt(teamDetails.teamId)
        ], function(err) {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log("deletedRow(s) : " + this.changes);
            resolve(this.changes);
        });
    });
};

exports.deleteBand = (bandDetails) => {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM BAND WHERE ID=?`;
        console.log(sql);
        console.log(JSON.stringify(bandDetails));
        db.run(sql, [
            parseInt(bandDetails.bandId)
        ], function(err) {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log("deletedRow(s) : " + this.changes);
            resolve(this.changes);
        });
    });
};

exports.deleteGrade = (gradeDetails) => {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM GRADE WHERE ID=?`;
        console.log(sql);
        console.log(JSON.stringify(gradeDetails));
        db.run(sql, [
            parseInt(gradeDetails.gradeId)
        ], function(err) {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log("deletedRow(s) : " + this.changes);
            resolve(this.changes);
        });
    });
};

exports.deleteRole = (roleDetails) => {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM ROLE WHERE ID=?`;
        console.log(sql);
        console.log(JSON.stringify(roleDetails));
        db.run(sql, [
            parseInt(roleDetails.roleId)
        ], function(err) {
            if(err){
                console.log(err);
                reject(err)
            }
            console.log("deletedRow(s) : " + this.changes);
            resolve(this.changes);
        });
    });
};


exports.getDSMByTeam = (fromDate, toDate) => {
    return new Promise((resolve, reject) => {
        let sql =  `SELECT t.NAME AS TEAM_NAME, COUNT(*) AS PRESENT FROM ASSOCIATE a 
                    INNER JOIN TEAM t ON a.TEAM_ID = t.ID
                    INNER JOIN DSM d ON a.ID = d.ASSOCIATE_ID
                    WHERE d.PRESENT = 1 AND d.DSM_DATE BETWEEN ? AND ?
                    GROUP BY t.NAME ORDER BY PRESENT`;
        db.all(sql, [fromDate, toDate], (err, rows) => {
            if(err){
                console.log(err);
                reject(err)
            }
            resolve(rows);
        });
    });
};

exports.getCountByTeam = () => {
    return new Promise((resolve, reject) => {
        let sql =  `SELECT t.NAME AS TEAM_NAME, COUNT(a.TEAM_ID) AS TEAM_COUNT FROM TEAM t 
                    LEFT OUTER JOIN ASSOCIATE a ON a.TEAM_ID = t.ID GROUP BY t.NAME
                    ORDER BY TEAM_COUNT DESC`;
        db.all(sql, [], (err, rows) => {
            if(err){
                console.log(err);
                reject(err)
            }
            resolve(rows);
        });
    });
};