import JsonToAny from "../dist";
import { isObjectProperty } from "../src/type/property";

const jsonStr = {
  "id": "1539522860300640256",
  "name": "住院医嘱新开表单【分类-卫材】",
  "lineBarPosition": "top",
  "content":[],
  "resetButtonShow": false
}
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
