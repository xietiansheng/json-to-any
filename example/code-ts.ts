import JsonToAny from "../dist";
import { isObjectProperty } from "../src/type/property";

const jsonStr = {
  name: "json-to-any-web",
  content: [123123, "123123", { s: "123" }],
  content2: [
    { name: "再说" },
    { age: 19, memo: { value: "备注" } }
  ],
  car: {
    brand: "BMW",
    event: {
      name: "click"
    }
  }
};
const jsonToTs = (json: string) => {
  const entities = JsonToAny.parse(json);
  const transformPropertyCode = (content: string) => `  ${ content };\n`;
  return JsonToAny.transformCode(entities, {
    before(entity) {
      return `\ninterface ${ entity.modelName } {\n`;
    },
    default(property) {
      // key: value;
      return transformPropertyCode(`${ property.key }: ${ property?.type }`);
    },
    object(property) {
      // key: Model;
      return transformPropertyCode(`${ property.key }: ${ property.entity.modelName }`);
    },
    array(property) {
      const childProperty = property.childProperty;
      if (isObjectProperty(childProperty)) {
        return transformPropertyCode(`${ property.key }: ${ childProperty.entity.modelName }[]`);
      }
      if (childProperty.type === "null") {
        return transformPropertyCode(`${ property.key }?: any[]`);
      }
      return transformPropertyCode(`${ property.key }: ${ childProperty.type }[]`);
    },
    null(property) {
      // key?: any;
      return transformPropertyCode(`${ property.key }?: any`);
    },
    after() {
      return "}";
    },
  });
};
console.log(jsonToTs(JSON.stringify(jsonStr)), "tsCode");
