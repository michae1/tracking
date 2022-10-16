import { generateUUID } from "./uid";
import { getNow } from "./utils";

const cookieTTL = window.GPWCSessionTTL || 60 * 1000;

export function setSessionCoookie(sessionId) {
  var now = getNow();
  var time = now.getTime();
  time += cookieTTL;
  now.setTime(time);
  document.cookie =
    "GPWCsession=" + sessionId + "; expires=" + now.toUTCString() + "; path=/";
}

export function getOrCreateSession(renew) {
  const sessionCookie = document.cookie.replace(
    /(?:(?:^|.*;\s*)GPWCsession\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  if (!sessionCookie) {
    console.log("setting new cookie");
    var sessionId = generateUUID();
    setSessionCoookie(sessionId);
    return sessionId;
  } else {
    console.log("newing cookie");
    if (renew) {
      setSessionCoookie(sessionCookie);
    }
    return sessionCookie;
  }
}
