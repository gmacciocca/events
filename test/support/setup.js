var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var spies = require("chai-spies");

chai.use(chaiAsPromised);
chai.use(spies);
chai.should();

global.chai = chai;
global.expect = chai.expect;
global.should = chai.should();
