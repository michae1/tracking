export function setSessionCoookie(sessionId) {
  var now = getNow();
  var time = now.getTime();
  time += cookieTTL;
  now.setTime(time);
  document.cookie =
    "XNSSsession=" + sessionId + "; expires=" + now.toUTCString() + "; path=/";
}

export function getOrCreateSession(renew) {
  const sessionCookie = document.cookie.replace(
    /(?:(?:^|.*;\s*)XNSSsession\s*\=\s*([^;]*).*$)|^.*$/,
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
