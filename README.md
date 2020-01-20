# JIRA-Zaphyr
JIRA Zapi Integration
# Sample use with Protractor 
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
const log4js = require("log4js");
const path = require('path');
const HtmlReporter = require("protractor-beautiful-reporter");
const { SpecReporter } = require("jasmine-spec-reporter");
const jasmineReporters = require("jasmine-reporters");
const { sauceParams } = require("./src/params/sauce.params");
const ZapiReporter = require("./src/test-helpers/zapi_reporter/zapi-reporter");
let onPrepareDefer;
let onCompleteDefer;

exports.config = {
  sauceUser: sauceParams.login.SAUCE_USERNAME,
  sauceKey: sauceParams.login.SAUCE_ACCESS_KEY,
  allScriptsTimeout: 100000,
  specs: ["./src/**/*-spec.ts"],
  multiCapabilities: sauceParams.capabilities,
  directConnect: false,
  baseUrl:<baseURL>,
  framework: "jasmine",
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 100000,
    print: function() {}
  },
  onPrepare() {
    onPrepareDefer = protractor.promise.defer();
    onCompleteDefer = protractor.promise.defer();
    require("ts-node").register({
      project: require("path").join(__dirname, "./tsconfig.e2e.json")
    });
    jasmine.getEnv().addReporter(
      new SpecReporter({
        suite: {
          displayNumber: true
        },
        spec: {
          displayStacktrace: true,
          displayErrorMessages: true,
          displayDuration: true,
          displaySuccessful: true,
          displayFailed: true
        },
        summary: {
          displaySuccessful: true,
          displayFailed: true,
          displayErrorMessages: true
        },
        colors: {
          enabled: true,
          successful: "green",
          failed: "red",
          pending: "blue"
        }
      })
    );
    jasmine.getEnv().addReporter(
      new HtmlReporter({
        baseDirectory: "./ow_functional_testing_results",
        // pathBuilder: function pathBuilder(
        //   spec,
        //   descriptions,
        //   results,
        //   capabilities
        // ) {
        //   return path.join(capabilities.get('browserName'), descriptions.join("-"));
        // },
        screenshotsSubfolder: "screenshots",
        jsonsSubfolder: "jsons",
        sortFunction: function sortFunction(a, b) {
          if (a.cachedBase === undefined) {
            var aTemp = a.description.split("|").reverse();
            a.cachedBase = aTemp.slice(0).slice(0, -1);
            a.cachedName = aTemp.slice(0).join("");
          }
          if (b.cachedBase === undefined) {
            var bTemp = b.description.split("|").reverse();
            b.cachedBase = bTemp.slice(0).slice(0, -1);
            b.cachedName = bTemp.slice(0).join("");
          }

          var firstBase = a.cachedBase;
          var secondBase = b.cachedBase;

          for (var i = 0; i < firstBase.length || i < secondBase.length; i++) {
            if (firstBase[i] === undefined) {
              return -1;
            }
            if (secondBase[i] === undefined) {
              return 1;
            }
            if (firstBase[i].localeCompare(secondBase[i]) === 0) {
              continue;
            }
            return firstBase[i].localeCompare(secondBase[i]);
          }

          var firstTimestamp = a.timestamp;
          var secondTimestamp = b.timestamp;

          if (firstTimestamp < secondTimestamp) return -1;
          else return 1;
        },
        excludeSkippedSpecs: true,
        docTitle: "OW Functional Testing Reports",
        clientDefaults: {
          showTotalDurationIn: "header",
          totalDurationFormat: "hms"
        }
      }).getJasmine2Reporter()
    );

    const options = {
      disabled: false,
      screenshot: "fail",
      projectId: "10024",
      boardId: "44"
    };

    //add the reporter
    jasmine
      .getEnv()
      .addReporter(ZapiReporter(onPrepareDefer, onCompleteDefer, browser));

    // return the promises for onPrepare..
    return onPrepareDefer.promise;
  },
  onComplete() {
    return onCompleteDefer.promise;
  }
};
