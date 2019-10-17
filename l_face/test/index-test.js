'use strict'

var aws = require('aws-sdk-mock'),
    chai = require('chai'),
    path = require('path'),
    lambadTester = require('lambda-tester'),
    should = chai.should(),
    expect = chai.expect,
    index = require('../index'),
    catalog,
    catalogModel = require('../model/database'),
    catalogGET = require('./source/catalog-get.json'),
    getCatalog = require('./events/success/get-success.json'),
    postCatalog = require('./events/success/post-success.json'),
    putCatalog = require('./events/success/put-success.json'),
    putInsertCatalog = require('./events/success/put-insert-success.json'),
    deleteCatalog = require('./events/success/delete-success.json'),
    deleteCatalog2 = require('./events/success/delete-success-2.json')

aws.setSDK(path.resolve('node_modules/aws-sdk'));

describe('Success Tests', function () {

    this.timeout(0);
    beforeEach(function () {
        aws.mock('DynamoDB', 'getItem', function (params, callback) {
            callback(null, catalogGET);
        });

        aws.mock('DynamoDB', 'scan', function (params, callback) {
            callback(null, catalogScan);
        });

        aws.mock('DynamoDB', 'putItem', function (params, callback) {
            callback(null, "");
        });

        aws.mock('DynamoDB', 'deleteItem', function (params, callback) {
            callback(null, "");
        });

        catalog = new catalogModel();
    });

    aws.restore();

    it(`Post Catalog successfully`, function () {
        return lambadTester(index.handler)
            .event(postCatalog)
            .expectResult((result) => {
                console.log("-------------------------------------------------------------");
                console.log("Result Post: ", JSON.stringify(result));
                console.log("-------------------------------------------------------------");
                expect(result.statusCode).to.equal(201);
            });
    });

    it(`Get Catalog successfully`, function () {
        return lambadTester(index.handler)
            .event(getCatalog)
            .expectResult((result) => {
                console.log("-------------------------------------------------------------");
                console.log("Incoming catalognName: ", JSON.stringify(getCatalog.path.catalogName));
                console.log("Result Get: ", JSON.stringify(result));
                console.log("-------------------------------------------------------------");
                expect(result.body.catalogName).to.equal(getCatalog.path.catalogName);
            });
    });

    it(`Put/Update Catalog successfully`, function () {
        return lambadTester(index.handler)
            .event(putCatalog)
            .expectResult((result) => {
                console.log("-------------------------------------------------------------");
                console.log("Result Put: ", JSON.stringify(result));
                console.log("-------------------------------------------------------------");
                expect(result.statusCode).to.equal(200);
            });
    });

    it(`Put/Insert Catalog successfully`, function () {
        return lambadTester(index.handler)
            .event(putInsertCatalog)
            .expectResult((result) => {
                console.log("-------------------------------------------------------------");
                console.log("Result Put: ", JSON.stringify(result));
                console.log("-------------------------------------------------------------");
                expect(result.statusCode).to.equal(200);
            });
    });
       
    it(`Delete Catalog successfully`, function () {
        return lambadTester(index.handler)
            .event(deleteCatalog)
            .expectResult((result) => {
                console.log("-------------------------------------------------------------");
                console.log("Result Delete: ", JSON.stringify(result));
                console.log("-------------------------------------------------------------");
                expect(result.statusCode).to.equal(200);
            });
    });

    it(`Delete Catalog 2 successfully`, function () {
        return lambadTester(index.handler)
            .event(deleteCatalog2)
            .expectResult((result) => {
                console.log("-------------------------------------------------------------");
                console.log("Result Delete: ", JSON.stringify(result));
                console.log("-------------------------------------------------------------");
                expect(result.statusCode).to.equal(200);
            });
    });

        
    it(`Scan Catalogs successfully`, function () {
        return lambadTester(index.handler)
            .event(require('./events/success/scan-success.json'))
            .expectResult((result) => {
                console.log("-------------------------------------------------------------");
                console.log("Result Scan: ", JSON.stringify(result.body.length));
                console.log("-------------------------------------------------------------");
                expect(result.body.length).to.equal(result.body.length);
            });
    });

});

describe('Fail Tests', function () {

    this.timeout(0);
    beforeEach(function () {
        aws.mock('DynamoDB', 'getItem', function (params, callback) {
            callback(null, "");
        });

        aws.mock('DynamoDB', 'scan', function (params, callback) {
            callback(null, "");
        });
        aws.mock('DynamoDB', 'putItem', function (params, callback) {
            callback(null, "");
        });

        aws.mock('DynamoDB', 'deleteItem', function (params, callback) {
            callback(null, "");
        });

        catalog = new catalogModel();
    });

    it(`Fail GET: Catalog doesn't exist`, function () {
        return lambadTester(index.handler)
            .event(require('./events/fail/get-fail.json'))
            .expectError(()=>{
                console.log("-------------------------------------------------------------");             
                console.log("CatalogName: ",require('./events/fail/GET-FAIL.json').path.catalogName);
                console.log("-------------------------------------------------------------");
            });
    });

    it(`Fail POST: Body Schema is not valid`, function () {
        return lambadTester(index.handler)
            .event(require('./events/fail/post-fail-schema.json'))
            .expectError(()=>{
                console.log("-------------------------------------------------------------");
                console.log("Body: ",require('./events/fail/POST-FAIL-Schema.json').body);
                console.log("-------------------------------------------------------------");
            });
    });

    it(`Fail POST: Catalog already exist`, function () {
        return lambadTester(index.handler)
            .event(require('./events/fail/post-fail.json'))
            .expectError(()=>{
                console.log("-------------------------------------------------------------");
                console.log("CatalogName: ",require('./events/fail/POST-FAIL.json').body.catalogName);
                console.log("-------------------------------------------------------------");
            });
    });

    it(`Fail PUT: Catalog identifiers does not match`, function () {
        return lambadTester(index.handler)
            .event(require('./events/fail/put-fail.json'))
            .expectError(()=>{
                console.log("-------------------------------------------------------------");           
                console.log("Income path parameter catalogName: ",require('./events/fail/PUT-FAIL.json').path.catalogName);
                console.log("Income body catalogName: ",require('./events/fail/PUT-FAIL.json').body.catalogName);
                console.log("-------------------------------------------------------------");
            });
    });

    it(`Fail DELETE: Catalog doesn't exist`, function () {
        return lambadTester(index.handler)
            .event(require('./events/fail/delete-fail.json'))
            .expectError(()=>{
                console.log("-------------------------------------------------------------");             
                console.log("Income path parameter catalogName: ",require('./events/fail/DELETE-FAIL.json').path.catalogName);
                console.log("-------------------------------------------------------------");
            });
    });

    aws.restore();

});
