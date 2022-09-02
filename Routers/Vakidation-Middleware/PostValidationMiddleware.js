const Joi = require('@hapi/joi');

const middleware = (schema, property) => { 
    return (req, res, next) => { 
        console.log("req.body -> ", req.body); 
        const { error, value } = schema.validate(req.body);
        if(error){
            const { details } = error; 
            const message = details.map(i => i.message).join(',');
            console.log("error", message); 
            return res.status(500).send({msg : message});
        }
        next(); 
    } 
} 
module.exports = middleware;
