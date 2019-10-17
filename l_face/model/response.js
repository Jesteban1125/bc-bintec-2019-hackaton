'use strict'

let response = {};

function done(err, res, callback, method){
    if(err){
        if(method == "GET" || method == "DELETE"){
            response.statusCode = 404;
            response.errorType = 'Resource Not Found';
        }else if(method == "PUT"){
            response.statusCode = 400;
            response.errorType = 'Bad Request';
        }else if(method == "POST"){
            response.statusCode = 422;
            response.errorType = 'Unprocessable Entity';
        }
        response.body = err.message;
        callback(JSON.stringify(response));
        response = {};
    }else{
        if(method == "POST"){
            response.statusCode = 201;
        }else{
            response.statusCode = 200;
        }
        response.body = res;
        callback(null, response);
        response = {};
    }
}

module.exports.done = done;