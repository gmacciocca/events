import Events from "../src/Events";

describe("Events", function() {
    beforeEach(() => {
        this.event1Cb = chai.spy();
        this.events = new Events();
    });

    it("implements interface", () => {
        this.events.should.respondTo("on");
        this.events.should.respondTo("once");
        this.events.should.respondTo("off");
        this.events.should.respondTo("fire");
        this.events.should.respondTo("fireWait");
    });

    describe("When firing an 'on' registered event", () => {
        beforeEach(() => {
            this.events.on("event1", this.event1Cb);
            this.events.fire("event1");
        });
        it("calls the callback once", () => {
            this.event1Cb.should.have.been.called.exactly(1);
        });
    });

    describe("When firing a unregistered event", () => {
        beforeEach(() => {
            this.events.fire("event1");
        });
        it("never calls the callback", () => {
            this.event1Cb.should.have.not.been.called;
        });
    });

    describe("When firing a events that were registered then inregistered", () => {
        beforeEach(() => {
            const off = this.events.on("event1", this.event1Cb);
            const off2 = this.events.on("event1", this.event1Cb);
            off();
            off2();
            this.events.fire("event1");
        });
        it("never calls the callback", () => {
            this.event1Cb.should.have.not.been.called;
        });
    });

    describe("When firing an 'on' registered event multiple times", () => {
        beforeEach(() => {
            this.events.on("event1", this.event1Cb);
            this.events.fire("event1");
            this.events.fire("event1");
            this.events.fire("event1");
        });
        it("calls the callback multiple times", () => {
            this.event1Cb.should.have.been.called.exactly(3);
        });
    });

    describe("When firing a 'once' registered event multiple times", () => {
        beforeEach(() => {
            this.events.once("event1", this.event1Cb);
            this.events.fire("event1");
            this.events.fire("event1");
            this.events.fire("event1");
        });
        it("calls the callback once", () => {
            this.event1Cb.should.have.been.called.exactly(1);
        });
    });

    describe("When firing an 'on' registered event with a promise callback", () => {
        beforeEach(() => {
            this.event1CbPromiseDoneValue = 0;
            this.event1CbPromise = chai.spy(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        this.event1CbPromiseDoneValue = 11;
                        resolve();
                    }, 1500);
                });
            });
            this.events.on("event1", this.event1CbPromise);
            return this.events.fireWait("event1");
        });
        it("calls the callback once", () => {
            this.event1CbPromise.should.have.been.called.exactly(1);
            this.event1CbPromiseDoneValue.should.equal(11);
        });
    });

    describe("When firing multiple 'on' registered event with a promise callback", () => {
        beforeEach(() => {
            this.event1CbPromiseDoneValue = 0;
            this.event1CbPromise = chai.spy(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        this.event1CbPromiseDoneValue = 22;
                        resolve();
                    }, 400);
                });
            });
            this.events.on("event1", this.event1CbPromise);
            return this.events.fireWait("event1")
            .then(() => this.events.fireWait("event1"))
            .then(() => this.events.fireWait("event1"))
            .then(() => this.events.fireWait("event1"));
        });
        it("calls the callback once", () => {
            this.event1CbPromise.should.have.been.called.exactly(4);
            this.event1CbPromiseDoneValue.should.equal(22);
        });
    });

    describe("When firing a multiple 'once' registered event with a promise callback", () => {
        beforeEach(() => {
            this.event1CbPromiseDoneValue = 0;
            this.event1CbPromise = chai.spy(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        this.event1CbPromiseDoneValue = 33;
                        resolve();
                    }, 1500);
                });
            });
            this.events.once("event1", this.event1CbPromise);
            return this.events.fireWait("event1")
            .then(() => this.events.fireWait("event1"))
            .then(() => this.events.fireWait("event1"))
            .then(() => this.events.fireWait("event1"));
        });
        it("calls the callback once", () => {
            this.event1CbPromise.should.have.been.called.exactly(1);
            this.event1CbPromiseDoneValue.should.equal(33);
        });
    });

});
