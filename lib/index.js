class kennisgroep_testautomatisering_custom_report {
	constructor(emitter, reporterOptions, options) {
        this.reporterOptions = reporterOptions;
        this.options = options;
        const events = 'start beforeIteration iteration beforeItem item beforeAssertion assertion console exception beforeDone done'.split(' ');
        // Dit zijn allemaal newman events: https://github.com/postmanlabs/newman#newmanrunevents
		events.forEach((e) => { if (typeof this[e] == 'function') emitter.on(e, (err, args) => this[e](err, args)) });
    }
	
	start(err, args) {
        console.log(`##kennisgroep_testautomatisering[testSuiteStarted name='${this.options.collection.name}']`);
    }
	/*
	beforeIteration(err, args) {
		console.log(`##kennisgroep_testautomatisering[iterationStarted name ='$()']`;
	}
	 */
	beforeItem(err, args) {
        this.currItem = {name: args.item.name, passed: true, failedAssertions: []};
        console.log(`##kennisgroep_testautomatisering[testStarted name='${this.currItem.name}' captureStandardOutput='true']`);
    }
	
	request(err, args) {
        if (!err) {
            const request = this.currItem.request;
			const response = this.currItem.response;
			console.log('Kennisgroep_testautomatisering request: $(request)');
			console.log('Kennisgroep_testautomatisering response: $(response)');
        }
    }

    assertion(err, args) {
        if (err) {
            this.currItem.passed = false;
            this.currItem.failedAssertions.push(args.assertion);
        }
    }
	
	item(err, args) {
		console.log(`##kennisgroep_testautomatisering[testFinished name='${this.currItem.name}' captureStandardOutput='true']`);
	}
	
	done(err, args) {
        console.log(`##kennisgroep_testautomatisering[testSuiteFinished name='${this.options.collection.name}']`);
    }
}


module.exports = kennisgroep_testautomatisering_custom_report;