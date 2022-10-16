import { setSessionCoookie, getOrCreateSession } from "./session";
import { getNow } from "./utils";

const rootName = "GPWC";
let rootUrl = window.GPWCServerRoot || SERVER_ENDPOINT;
let sendEvents = window.GPWCDEBUG || false;
const landingTime = window.GPWCLandingTime || 10 * 1000; //ms
const skipLanding = window.GPWCNoLanding || false;
const siteId = window.GPWCSiteId;

if (!window[rootName]) {
  window[rootName] = {
    init: function (url) {
      rootUrl = url || rootUrl;
    },
    track: function (event, callback) {
      const value =
        event.value && event.value instanceof Array
          ? event.value
          : event.value
          ? [event.value]
          : [];
      const compatibleEvent = {
        siteId: siteId,
        value: value,
        sid: event.userId,
        session: getOrCreateSession(true),
      };

      if (sendEvents) {
        var tEvent = new CustomEvent("track", { detail: compatibleEvent });
        document.dispatchEvent(tEvent);
      }
      return new Promise((resolve, reject) => {
        var oReq = new XMLHttpRequest();
        const p = new Promise((r, rj) => {
          oReq.open("POST", rootUrl + "/" + event.type);
          oReq.setRequestHeader("Content-Type", "application/json");
          oReq.send(JSON.stringify(compatibleEvent));
          oReq.onreadystatechange = function () {
            if (oReq.readyState == 4) {
              if (oReq.status >= 200 && oReq.status < 300) {
                resolve(oReq.response);
              } else {
                reject({
                  status: oReq.status,
                  statusText: oReq.response,
                });
              }
            }
          };
        });
      });
    },
  };
}

// Track landing
// Check if cookie was set
if (!skipLanding) {
  const landingCookie = document.cookie.replace(
    /(?:(?:^|.*;\s*)GPWClanding\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  if (!landingCookie) {
    document.cookie = "GPWClanding=true";
    const timer = setTimeout(() => {
      var now = getNow();
      if (!skipLanding) {
        window[rootName].track({ type: "landing" });
      }
    }, landingTime);
  } else {
    if (!skipLanding) {
      var now = getNow();
      window[rootName].track({ type: "landing" });
    }
  }
}
