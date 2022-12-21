import { parse, transformCode } from "../dist";
import { isObjectProperty } from "../src/type/property";

const jsonStr = {
  "id": "1539522860300640256",
  // "name": "住院医嘱新开表单【分类-卫材】",
  // "lineBarPosition": "top",
  // "content": [{
  //   name: "测试"
  // }],
  "user_info": {
    brand: "BMW",
  },
  // "resetButtonShow": false
};
const jsonToTs = (json: string | Record<any, any>) => {
  const entities = parse(json);
  const strToTsCode = (content: string) => `  ${ content };\n`;
  return transformCode(entities, {
    before({ entity }) {
      return `\ninterface ${ transformName(entity.key, {
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
      return ["}"];
    },
  });
};
/**
 * 属性名，实体名的统一处理
 * @param name
 * @param options
 * @param options.firstChatUpperCase 首字母是否需要大写
 */
const transformName = (name: string, options?: {
  firstChatUpperCase: boolean
}): string => {
  if (!name) {
    return name;
  }
  if (name.includes("_")) {
    name = transformUnderlineName(name);
  }
  return options?.firstChatUpperCase ? firstChatToUpperCase(name) : name;
};
export const firstChatToUpperCase = (val: string) => (val && val[0].toUpperCase() + val.slice(1, val.length)) || "";
/**
 *  下划线的处理
 *  order_id ==> orderId
 */
const transformUnderlineName = (name: string) => {
  return name.split("_").reduce((pre, item, index) => {
    let res = item;
    if (index !== 0) {
      res = firstChatToUpperCase(item);
    }
    return pre + res;
  }, "");
};
console.log(jsonToTs(jsonStr));
