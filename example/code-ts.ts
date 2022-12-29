import { parse, transformCode } from "../dist";
import { isObjectProperty } from "../src/type/property";
import { transformName } from "./util";
import jsonStr from "./mock/easy.json";

const jsonToTs = (json: string | Record<any, any>) => {
  const entities = parse(json);
  const strToTsCode = (content: string) => `  ${ content };\n`;
  return transformCode(entities, {
    before({ entity }) {
      return `interface ${ transformName(entity.key, {
        firstChatUpperCase: true
      }) } {\n`;
    },
    default({ property }) {
      // key: value;
      return [strToTsCode(`${ property.key }: ${ property?.type }`)];
    },

    object({ property }) {
      // key: Model;
      return [strToTsCode(`${ transformName(property.key) }: ${ transformName(property.entity.key, {
        firstChatUpperCase: true
      }) }`)];
    },
    array({ property }) {
      const childProperty = property.childProperty;
      if (isObjectProperty(childProperty)) {
        return strToTsCode(`${ property.key }: ${ transformName(property.childProperty.key, {
          firstChatUpperCase: true
        }) }[]`);
      }
      if (childProperty.type === "null") {
        return strToTsCode(`${ property.key }?: any[]`);
      }
      return strToTsCode(`${ property.key }: ${ childProperty.type }[]`);
    },
    null({ property }) {
      // key?: any;
      return strToTsCode(`${ property.key }?: any`);
    },
    after() {
      return ["}\n\n"];
    },
  });
};
console.log(jsonToTs(jsonStr));
