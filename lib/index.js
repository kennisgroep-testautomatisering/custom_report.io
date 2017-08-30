'use strict';

var moment = require('moment'); 
var timestamp = new moment().format("YYYYMMDDHHmmssSSS");
var directory = 'C:/postman_projecten/Test_logging/debug/';
var filename = directory+timestamp.toString()+'.txt';
var fs = require('fs');
var shell = require('shelljs');

function access_file(directory,filename){
	try{
		fs.accessSynch(directory);
		openfile(filename);
	}
	catch (e)	{
		shell.mkdir('-p', directory);
		openfile(filename);
	}
}


function openfile(filename){
	var fd = fs.openSync(filename, 'w');
}


class customreport {
	
	constructor(emitter, reporterOptions, options) {
        this.reporterOptions = reporterOptions;
        this.options = options;
        const events = 'start beforeIteration iteration beforeItem item beforePrerequest prerequest beforeScript script beforeRequest request beforeTest test beforeAssertion assertion console exception beforeDone done'.split(' ');
        events.forEach((e) => { if (typeof this[e] == 'function') emitter.on(e, (err, args) => this[e](err, args)) });
    }

    start(err, args) {
		access_file(directory,filename);
		fs.writeFileSync(filename,'Logging voor Project REST Testing\r\n');
		fs.appendFileSync(filename,'Verwacht wordt dat complete CRUD Cycle van de REST testen zonder problemen verlopen\r\n');
		fs.appendFileSync(filename,'\r\n');
		fs.appendFileSync(filename,'##customreport testSuiteStarted name= '+this.options.collection.name+'\r\n');
		fs.appendFileSync(filename,'\r\n');

    }

    beforeItem(err, args) {
        this.currItem = {name: args.item.name, passed: true, failedAssertions: []};
		fs.appendFileSync(filename,'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\r\n');
		fs.appendFileSync(filename,'Het inkomende antwoord van '+this.currItem.name+'\r\n');
		fs.appendFileSync(filename,'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\r\n');
    }

    request(err, args) {
        if (!err) {
            this.currItem.response = args.response;
			fs.appendFileSync(filename,'\r\n');
			fs.appendFileSync(filename,'response= '+args.response.text()+'\r\n');
			fs.appendFileSync(filename,'responseCode= '+args.response.code+'\r\n');
			fs.appendFileSync(filename,'responseReason= '+args.response.reason()+'\r\n');
			fs.appendFileSync(filename,'responseTime= '+args.response.responseTime+'\r\n');
        }
    }

    assertion(err, args) {
        if (err) {
            this.currItem.passed = false;
            this.currItem.failedAssertions.push(args.assertion);
			fs.appendFileSync(filename,'Assertion '+args.assertion+' Failed\r\n');
        }
		else{
			fs.appendFileSync(filename,'Assertion '+args.assertion+' Passed\r\n');
		}	
    }

    item(err, args) {
        if (!this.currItem.passed) {
            const msg = this.currItem.failedAssertions.join(", ");
            const responseCode = (this.currItem.response && this.currItem.response.responseTime) || "-";
            const reason = (this.currItem.response && this.currItem.response.reason()) || "-";
            const details = `Response code: ${responseCode}, reason: ${reason}`;
			fs.appendFileSync(filename,'\r\n');
			fs.appendFileSync(filename,'##customreport testFailed name= '+args.item.name+' message= '+msg+' details= '+details+'\r\n');
        }
        const duration = (this.currItem.response && this.currItem.response.responseTime) || 0;
		fs.appendFileSync(filename,'\r\n');
    }

    done(err, args) {
		fs.appendFileSync(filename,'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\r\n');
		fs.appendFileSync(filename,'\r\n');
		fs.appendFileSync(filename,'##customreport testSuiteFinished name= '+this.options.collection.name+'\r\n');
    }
}

module.exports = customreport;