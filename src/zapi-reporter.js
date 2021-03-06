global.__ZAPIcreds = [process.env.ZAPI_ACCESS_KEY, process.env.ZAPI_SECRET_KEY, process.env.ASSIGNEE];

const ZapiReporter = (onPrepareDefer, onCompleteDefer, browser) => {
    this.fs = require('fs');
    this.globals = {
        executionId: '',
        cycleId: '',
        status: '1',
        projectId: `${process.env.PROJECTID}`,
        cycleName: ''
    };

    console.log('initializing ZAPI reporter')

    this.disabled = false

    this.onPrepareDefer = onPrepareDefer;
    this.onCompleteDefer = onCompleteDefer;
    this.browser = browser;

    this.specPromises = [];
    this.specPromisesResolve = {};

    this.suitePromises = [];

    this.zapiService = require('./zapi-service');

    if (this.disabled) {
        console.info('ZAPI Reporter is disabled, not doing anything.');
        if (this.onPrepareDefer.resolve) {
            this.onPrepareDefer.resolve();
        } else {
            this.onPrepareDefer.fulfill();
        }

        if (this.onCompleteDefer.resolve) {
            this.onCompleteDefer.resolve();
        } else {
            this.onCompleteDefer.fulfill();
        }
        return;
    }


    this.suiteStarted = require('./zapi-reporter-functions/suite-started').bind(this);


    require('./init').bind(this)();

    this.specStarted = require('./spec-started').bind(this);
    this.specDone = require('./spec-done').bind(this);
    this.suiteDone = require('./suite-done').bind(this);

    return this

};

module.exports = ZapiReporter;
