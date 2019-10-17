'use strict'

var aws = require('aws-sdk');
const doc = require('dynamodb-doc');
const log = require('scg-ms-logs-node');
let params = {};

log.getLogger(__filename);
aws.config.update({ region: process.env.REGION });

class Catalog {

    constructor() {
        this.table = process.env.TABLE_NAME;
        this.dynamodb = new doc.DynamoDB();
    };

    getData(transactionID, key) {
        params = {
            TableName : this.table,
            Key : {
            "catalogName": key
            }
        };
        log.loggingEvent(log.DEBUG,transactionID,"LL","Params to query on GET",params);
        return this.dynamodb.getItem(params).promise();
    };
    
    scanData(transactionID, fields){
        params = {
            TableName : this.table,
            ProjectionExpression : fields
        };
        log.loggingEvent(log.DEBUG,transactionID,"LL","Params to query on SCAN",params);
        return this.dynamodb.scan(params).promise();
    };

    deleteData(transactionID, key){
        params = {
            TableName : this.table,
            Key : {
            "catalogName": key
            }
        };
        log.loggingEvent(log.DEBUG,transactionID,"LL","Params to query on DELETE",params);
        return this.dynamodb.deleteItem(params).promise();
    };

    postData(transactionID, body){
        params = {
            TableName : this.table,
            Item : body
        };
        log.loggingEvent(log.DEBUG,transactionID,"LL","Params to query on POST/PUT",params);
        return this.dynamodb.putItem(params).promise();
    };

}

module.exports = Catalog;