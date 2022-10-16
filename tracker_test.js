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

BeforeSuite(({ I }) => {
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
    // console.log("SERVER: got req", req.body, "of type:", req.params.type);
    events.push({ ...req.body, type: req.params.type });
    res.json({ operation: "success", data: req.body });
  });

  port = 3001;
  expressServer = app.listen(port);
  // I.wait(3);
});

AfterSuite(({ I }) => {
  server.stop();
  expressServer.close();
});

Scenario("Should create global object", async ({I}) => {
  I.amOnPage("http://localhost:5005");
  let globalConfig = await I.executeScript(function () {
    return window.GPWC;
  });
  assert.equal(
    Object.keys(globalConfig).length > 0,
    true,
    "No global object detected"
  );
});

Scenario(
  "Should successfully send network request on call (clear console)",
  async ({I}) => {
    I.amOnPage("http://localhost:5005");
    await I.executeScript(function () {
      return window.GPWC.init("http://localhost:3001/track");
    });
    // pause()
    const result = await I.executeScript(
      function (r) {
        return window.GPWC.track(r);
      },
      { type: "test", value: "alex" }
    );
    const logs = await I.grabBrowserLogs();
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
  async ({I}) => {
    I.amOnPage("http://localhost:5005");
    
    await I.executeScript(function () {
      return window.GPWC.init("http://localhost:3001/track");
    });
    const result = await I.executeAsyncScript(
      function (r, done) {
        return window.GPWC.track(r).then(
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
          ({ err }) => {
            done({ error: err, reqLength: 0 });
          }
        );
      },
      { type: "test", value: "alex" }
    );
    // pause()
    const response = JSON.parse(result.response);
    assert.equal(result.reqLength >= 1, true, "Network requests not sent");
    assert.equal(response.data.value[0], "alex", "Request body invalid");
  }
);

Scenario(
  "Should successfully send landing event in 2s (one page model, setting inpage)",
  async ({I}) => {
    I.amOnPage("http://localhost:5005");
    // I.defineTimeout({ script: 5000 });

    await I.executeScript(function () {
      return window.GPWC.init("http://localhost:3001/track");
    });
    // console.log("sleeping 11 seconds for landing");
    await I.wait(3);
    // console.log(events);
    assert.equal(
      events.filter((e) => e.type === "landing").length > 0,
      true,
      "Landing was not sent"
    );
    // console.log("cleanup landing event");
    events = [];
  }
);

