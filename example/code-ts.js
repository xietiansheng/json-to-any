const { parse, transformCode } = require("../dist/index")["default"];
const jsonStr = {
  "currentAppId": "156841514891354",
  "currentOrganization": {
    "orgId": "5545",
    "content": {
      "memo": null
    }
  },
  "language": [{
    "code": "1.8.1",
    "data": {
      "name": "zn"
    }
  },],
  "path": "",
  "ws": {},
  "timeout": 55000,
  "timeoutObj": null,
  "wsAppId": "",
  "wsUrl": "ws://localhost:32847",
  "noPopup": false
};
const entityList = parse(jsonStr);
const propertyCode = (content) => {
  return `  ${content};\n`;
};
const tsCode = transformCode(entityList, {
  before({ entity }) {
    return `\ninterface ${entity.modelName} {\n`;
  },
  default({ property }) {
    return propertyCode(`${property.key}: ${property.type}`);
  },
  object({ property, entity }) {
    return propertyCode(`${property.key}: ${entity.modelName}`);
  },
  array({ property, entity }) {
    return propertyCode(`${property.key}: ${entity.modelName}[]`);
  },
  null({ property }) {
    return propertyCode(`${property.key}?: any`);
  },
  after() {
    return "}";
  },
});
console.log(tsCode, "code");
