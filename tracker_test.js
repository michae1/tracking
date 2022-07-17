const assert = require("assert");
const serve = require("serve");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

Feature("PixelTrack test.js");

let server;
let app;
let expressServer;
let events = [];

BeforeSuite((I) => {
  // static server
  server = serve(__dirname, {
    port: 5005,
    ignore: ["node_modules"],
  });
  // app server
  app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.post("/track/:type", function (req, res) {
    console.log("SERVER: got req", req.body, "of type:", req.params.type);
    events.push({ ...req.body, type: req.params.type });
    res.json({ operation: "success", data: req.body });
  });

  port = 3001;
  expressServer = app.listen(port);
  // I.wait(3);
});

AfterSuite((I) => {
  server.stop();
  expressServer.close();
});

Scenario("Should create global object", function* (I) {
  I.amOnPage("http://localhost:5005");
  let globalConfig = yield I.executeScript(function () {
    return window.XNSS;
  });
  assert.equal(
    Object.keys(globalConfig).length > 0,
    true,
    "No global object detected"
  );
});

Scenario(
  "Should successfully send network request on call (clear console)",
  function* (I) {
    I.amOnPage("http://localhost:5005");
    yield I.executeScript(function () {
      return window.XNSS.init("http://localhost:3001");
    });
    const result = yield I.executeScript(
      function (r) {
        return window.XNSS.track(r);
      },
      { type: "test", value: "alex" }
    );
    const logs = yield I.grabBrowserLogs();
    const errors = logs.filter((x) => x.level === "ERROR");
    assert.equal(
      errors.length === 0,
      true,
      "Browser has errors in console: " + JSON.stringify(errors)
    );
  }
);

Scenario(
  "Should successfully send network request on call (request detection)",
  function* (I) {
    I.amOnPage("http://localhost:5005");
    I.defineTimeout({ script: 5000 });

    yield I.executeScript(function () {
      return window.XNSS.init("http://localhost:3001/track");
    });
    const result = yield I.executeAsyncScript(
      function (r, done) {
        return window.XNSS.track(r).then(
          (x) => {
            var performance =
              window.performance ||
              window.mozPerformance ||
              window.msPerformance ||
              window.webkitPerformance ||
              {};
            var network = performance.getEntries() || {};
            const reqLength = network.filter(function (x) {
              return x.name.indexOf("http://localhost:3001/track") !== -1;
            }).length;
            done({
              response: x,
              reqLength,
            });
          },
          (err) => {
            done({ error: err, reqLength: 0 });
          }
        );
      },
      { type: "test", value: "alex" }
    );
    // console.log(result, result.data);
    const response = JSON.parse(result.response);
    assert.equal(result.reqLength >= 1, true, "Network requests not sent");
    assert.equal(response.data.value[0], "alex", "Request body invalid");
  }
);

Scenario(
  "Should successfully send landing event in 2s (one page model, setting inpage)",
  function* (I) {
    I.amOnPage("http://localhost:5005");
    I.defineTimeout({ script: 5000 });

    yield I.executeScript(function () {
      return window.XNSS.init("http://localhost:3001/track");
    });
    console.log("sleeping 11 seconds for landing");
    yield I.wait(3);
    console.log(events);
    assert.equal(
      events.filter((e) => e.type === "landing").length > 0,
      true,
      "Landing was not sent"
    );
    console.log("cleanup landing event");
    events = [];
  }
);

Scenario(
  "Should successfully send landing event on second page (multipage model)",
  function* (I) {
    I.amOnPage("http://localhost:5005");
    I.defineTimeout({ script: 5000 });

    yield I.executeScript(function () {
      window.XNSSLandingTime = 2 * 1000;
      return window.XNSS.init("http://localhost:3001/track");
    });
    I.amOnPage("http://localhost:5005/page2.html");
    let title = yield I.grabTitle();
    assert.equal(
      events.filter((e) => e.type === "landing").length > 0,
      true,
      "Landing was not sent"
    );
  }
);

Scenario(
  "Should successfully send landing event in one session",
  function* (I) {
    I.amOnPage("http://localhost:5005");
    I.defineTimeout({ script: 5000 });
    events = [];
    yield I.executeScript(function () {
      XNSSSessionTTL = 10 * 1000;
      return window.XNSS.init("http://localhost:3001/track");
    });
    yield I.executeScript(
      function (r) {
        return window.XNSS.track(r);
      },
      { value: ["alex"], type: "landing" }
    );
    yield I.executeScript(
      function (r) {
        return window.XNSS.track(r);
      },
      { value: ["max"], type: "landing" }
    );
    const session = events[0].session;
    assert.equal(
      events.filter((e) => e.session === session).length > 0,
      true,
      "Events has different session Ids "
    );
  }
);

Scenario(
  "Should successfully send landing event in one session and later event in another",
  function* (I) {
    I.amOnPage("http://localhost:5005");
    I.defineTimeout({ script: 5000 });
    events = [];
    yield I.executeScript(function () {
      XNSSSessionTTL = 1 * 1000;
      XNSSNoLanding = true;
      return window.XNSS.init("http://localhost:3001/track");
    });
    yield I.executeScript(
      function (r) {
        return window.XNSS.track(r);
      },
      { name: "alex" }
    );
    yield I.wait(120);
    yield I.executeScript(
      function (r) {
        return window.XNSS.track(r);
      },
      { name: "max" }
    );
    yield I.wait(5);
    console.log("events", events);

    assert.equal(
      events[0].session == events[2].session,
      false,
      "Events has different session Ids "
    );
  }
);
