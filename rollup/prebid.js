const fs = require('fs');
const path = require('path');

const SPECIAL_IMPORT = {
  'c1x': 'c1xAdapter',
  'triplelift': 'tripleliftAdapterSpec',
  'unruly':'adapter'
}

const limitedList = [
  'triplelift'
]


function prepareBiddersMap(){
  const modules = {};
  const folder = './node_modules/prebid.js/modules';
  let fileCount = 0;
  let urlCount = 0;
  fs.readdirSync(folder).filter(file=>limitedList.includes(file.replace('BidAdapter.js',''))).forEach(file => {
    if (!file.endsWith('BidAdapter.js')){
      return;
    }
    const name = file.split('BidAdapter.js')[0].replace(/[-_]/,'');
    fileCount++;
    const content = fs.readFileSync(path.join(folder, file), 'utf8');
    // console.log(content)
    const matches = content.match(/(?:END_POINT|ENDPOINT_URL|BID_URL|ENDPOINT|\ URL|DEFAULT_SERVER_URL|ENDPOINT_ENGINE|ENDPOINT_PRODUCTION)\ = [\'"]([^"']+)[\'"]/i);
    if (matches && matches.length > 1 && matches[1] > ''){
      urlCount++;
      const fullMatchedUrl = matches[1];
      const cleanUrl = fullMatchedUrl.replace('https://', '').replace('//','');
      let domain = cleanUrl;
      try {
        let urlObj = (new URL(fullMatchedUrl));
        domain = urlObj.hostname;
      } catch(e) {
        console.log('oh no', e);
        // pass
      }
      modules[cleanUrl] = {file, domain, name};
    }
  });
  // console.log(modules)
  let content = "// File is auto generated \n";
  let known = "export const known = new Set();\n"
  let loader = "";

  // let mocks = 'self.window = {location: {search: ""}};self.window.self = self.window;self.FEATURES = [];self.$$PREBID_GLOBAL$$ = {};';

  Object.keys(modules).forEach(url => {
    const name = modules[url]?.name;
    const importName = SPECIAL_IMPORT[name]?SPECIAL_IMPORT[name]:'spec';
    if (name) {
      loader+= `import {${importName} as adapter${name}} from \"prebid.js/modules/${modules[url]?.file}\";\n`;
      content += `if (url.includes("${url}")) {try {return adapter${name}.interpretResponse(body, {})}catch(e){}};\n`;
      known += `known.add("${modules[url]?.domain}");\n`
    }
  })

  fs.writeFileSync('src/Analyzers/Prebid/adapter.ts',`${loader}\n${known}\nasync function parse(url: string, body: string) {${content}}\nexport default parse;`)
}


export default prepareBiddersMap;