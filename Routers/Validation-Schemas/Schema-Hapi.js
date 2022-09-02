const Joi = require('@hapi/joi');

exports.LoginFormSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
}).options({abortEarly : false});

exports.AddMemberSchema = Joi.object({
    empId : Joi.string().regex(/^\d+$/).required(),
    empName : Joi.string().required(),
    dob : Joi.string().required(),
    tcsEmail : Joi.string().required(),
    siaEmail : Joi.string().required(),
    phoneNumber : Joi.string().required(),
    depBranch : Joi.string().required(),
    empRole : Joi.string().required(),
    seatNumber : Joi.string().required(),
    empGrade : Joi.string().required(),
    gradeFrom : Joi.string().required(),
    empBand : Joi.string().required(),
    bandFrom : Joi.string().required(),
    empTeam : Joi.string().required(),
    tcsJoiningDate : Joi.string().required(),
    siaJoiningDate : Joi.string().required(),
    empSkillSet : Joi.string().required()
}).options({abortEarly : false});

exports.LeaveUpdateSchema = Joi.object({
    leaveReason : Joi.string().required(),
    leaveDate : Joi.string().required(),
    leaveType : Joi.string().required(),
    memberId : Joi.number().required()
}).options({abortEarly : false});

exports.DSMUpdateSchema = Joi.array().items(
    Joi.object().keys({
        attendDate : Joi.number().min(84288000000).required(),
        isPresent : Joi.bool().required(),
        assoId : Joi.number().required()
    }).options({abortEarly : false})
);

exports.AddTeamSchema = Joi.object({
    teamName : Joi.string().required(),
    teamDesc : Joi.string().required()
}).options({abortEarly : false});

exports.AddGradeSchema = Joi.object({
    gradeName : Joi.string().required(),
    gradeDesc : Joi.string().required()
}).options({abortEarly : false});

exports.AddRoleSchema = Joi.object({
    roleName : Joi.string().required(),
    roleDesc : Joi.string().required()
}).options({abortEarly : false});

exports.AddBandSchema = Joi.object({
    bandName : Joi.string().required(),
    bandDesc : Joi.string().required()
}).options({abortEarly : false});


