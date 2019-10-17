'use strict'

const log = require('scg-ms-logs-node');
log.getLogger(__filename);
const validate = require('json-schema').validate;
const schemas = require('./Schema/catalog-schema');
const catalogModel = require('./model/database');
const responseModel = require('./model/response');
let catalogDB = new catalogModel();
let method = ""
exports.handler = (event, context, callback) => {

    log.loggingMessage(log.INFO, event);
    const transactionID = event.headers['X-Amzn-Trace-Id'].split('1-')[1];
    method = event.method;
    var jsonSchema = validate(event.body, schemas.getSchema());
    if(jsonSchema.valid){
        verifyExist(transactionID, event, event.method, callback);
    }else{
        responseModel.done(new Error(`Bad Request, body's json schema isn't valid`), null, callback, method);
    }
};

function verifyExist(transactionID, event, method, callback){
    
    var exist = false;
    var key = "";
    if(method == "GET" && event.path.catalogName == null){
        getCatalogs(transactionID, callback);
    }else{
        if(method == "POST"){
            key = event.body.catalogName 
        }else{
            key = event.path.catalogName
        }
        log.loggingEvent(log.DEBUG, transactionID, "LL", "Verifying catalog's exitence", key);
        catalogDB.getData(transactionID, key)
        .then(function(res){
            if(res.Item != null){
                exist = true;
                log.loggingEvent(log.DEBUG,transactionID,"LL",`Catalog exist: ${key}`,res.Item);
                if(method == "PUT"){
                    log.loggingEvent(log.INFO,transactionID,"LL",`Catalog: ${key} will be updated`, res.Item);
                    putCatalog(transactionID, event.path.catalogName, event.body, exist, callback);
                }else if(method == "DELETE"){
                    deleteCatalog(transactionID, event.path.catalogName, callback);
                }else if(method == "GET"){
                    log.loggingEvent(log.INFO,transactionID,"LL","ITEM RETRIEVED",res.Item);
                    responseModel.done(null, res.Item, callback, method);
                }else{
                    log.loggingEvent(log.ERROR,transactionID,"LL","catalog already exist",key);
                    responseModel.done(new Error(`Catalog ${key} already exist!`), null, callback, method);
                }
            }else{
                if(method == "POST"){
                    postCatalog(transactionID, event.body, exist, callback);
                }else if(method == "PUT"){
                    putCatalog(transactionID, event.path.catalogName, event.body, exist, callback);
                }else{
                    log.loggingEvent(log.ERROR,transactionID,"LL","Item Doesn't Exist",`Catalog: ${key}`);
                    responseModel.done(new Error(`Catalog doesn't exist: ${key}`), null, callback, method);
                }
            }
        })
        .catch( function(error){
            responseModel.done(new Error(`An error has ocurred ${error}`), null, callback, method);
        })
    }
}


function getCatalogs(transactionID, callback){
    log.loggingEvent(log.INFO,transactionID,"LL","SCAN ITEMS",`Table Name: ${process.env.TABLE_NAME}`);
    var fields = "catalogName";
    catalogDB.scanData(transactionID, fields)
    .then(function(res){
        if(res.Count > 0){
            log.loggingEvent(log.INFO,transactionID,"LL","ITEMS SCANNED",res.Items);
            responseModel.done(null, res.Items, callback, method);   
        }else{
            log.loggingEvent(log.ERROR,transactionID,"LL","There aren´t catalogs to scan",`Table Name: ${process.env.TABLE_NAME}`);
            responseModel.done(new Error(`No catalogs register on table: ${process.env.TABLE_NAME}`), null, callback, method);
        }
    })
}

function postCatalog(transactionID, body, exist, callback){
    log.loggingEvent(log.INFO,transactionID,"LL","POST ITEM",body);
    catalogDB.postData(transactionID, body).then(function(res){
        log.loggingEvent(log.INFO,transactionID,"LL","ITEM INSERTED",`Catalog: ${body.catalogName} - has successfully been added on '${process.env.TABLE_NAME}' table`);
        responseModel.done(null, `Catalog: '${body.catalogName}' - has successfully been inserted on '${process.env.TABLE_NAME}' table`, callback, method);
    })    
}


function putCatalog(transactionID, catalog, body, exist, callback){
    log.loggingEvent(log.INFO,transactionID,"LL","PUT ITEM",body);
    if(catalog != body.catalogName){
        done(new Error("Catalogs identifiers doesn't match"), null, callback, method);
    }else{    
        catalogDB.postData(transactionID, body)
        .then(function(res){
            if(exist){
                log.loggingEvent(log.INFO,transactionID,"LL","ITEM UPDATED",`Catalog: ${catalog} - has successfully been updated on '${process.env.TABLE_NAME}' table`);
                responseModel.done(null, `Catalog: '${catalog}' - has successfully been updated on '${process.env.TABLE_NAME}' table`, callback, method);
            }else{
                log.loggingEvent(log.INFO,transactionID,"LL","ITEM ADDED",`Catalog: ${catalog} - has successfully been added on '${process.env.TABLE_NAME}' table`);
                responseModel.done(null, `Catalog: '${catalog}' - has successfully been added on '${process.env.TABLE_NAME}' table`, callback, method);
            }
        })
    }
}

function deleteCatalog(transactionID, catalog, callback){
    log.loggingEvent(log.INFO,transactionID,"LL","DELETING ITEM",`catalog: ${catalog}`);
    catalogDB.deleteData(transactionID, catalog).then(function(res){
        log.loggingEvent(log.INFO,transactionID,"LL","ITEM DELETED",`Catalog: '${catalog}' has been deleted from '${process.env.TABLE_NAME}' table`);
        responseModel.done(null, `Catalog: '${catalog}' has been deleted from '${process.env.TABLE_NAME}' table!`, callback, method);
    })

}