import "./mocks";
import parse, {known} from "../Analyzers/Prebid/adapter";

// self.addEventListener('install', function(event) {
//     event.waitUntil(self.skipWaiting()); // Activate worker immediately
//     console.log('Ready!');
// });

// self.addEventListener('activate', function(event) {
//     event.waitUntil(self.clients.claim()); // Become available to all pages
//     console.log('Ready2!');
// });

let messagePort: MessagePort;
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "INIT_PORT") {
    messagePort = event.ports[0];
    console.log("worker channel intialized", messagePort);
  }
});
self.addEventListener("fetch", (event: FetchEvent) => {
  if (!messagePort) {
    console.log("no message port");
    return;
  }

  // right request:
  if (event.request.method != "POST") {
    return;
  }

  const requestClone = event.request.clone();
  event.respondWith(
    (async () => {
      const response = await fetch(event.request);
      analyze(requestClone, response.clone());
      return response;
    })()
  );
});

async function analyze(req: Request, res: Response) {
  console.log("analyzing", req, res);
  let requestPayload;
  try {
    requestPayload = await req.json();
  } catch (e) {
    console.log("error", e);
    return;
  }
  if (!requestPayload) {
    console.log("cannot parse");
    return;
  }
  console.log("req.url", req.url);
  let urlObj = (new URL(req.url));
  const domain = urlObj.hostname;
  console.log('domain', domain)
  if (known.has(domain)) {
    console.log("rtb detected");
    const parsed = await parse(req.url, requestPayload);
    console.log(parsed);
    // calculate reqs number, win rate, win price, tageting, div id.
  } else {
    console.log("non rtb", requestPayload);
  }
  // messagePort.postMessage({
  //     action: "request",
  //     data: {
  //       url: clone.url,
  //       method: clone.method,
  //       body: bodyData,
  //     },
  //   });
}
