import { parse, transformCode } from "../dist";
import { transformName } from "./index";

const jsonStr = {
  "id": "1539522860300640256",
  "name": "住院医嘱新开表单【分类-卫材】",
  "lineBarPosition": "top",
  "content": [{
    name: "测试"
  }],
  "user_info": {
    brand: "BMW",
  },
  "resetButtonShow": false
};
export const ToJava = () => {
  const entities = parse(jsonStr);
  // 将所有实体类名统一
  entities.forEach((entity) => {
    entity.key = transformName(entity.key, { firstChatUpperCase: true });
  });
  const strToJavaCode = (key: string, value: string) =>
    `  private ${value} ${transformName(key)};\n`;
  const type = (type: string) => {
    const map = {
      string: "String",
      number: "double",
      null: "String",
    };
    return map[type as keyof typeof map] || type;
  };
  const codeResult = transformCode(entities, {
    before({ entity }) {
      return `\n\npublic class ${entity.key} {\n`;
    },
    default({ property }) {
      return [
        strToJavaCode(property.key, type(property.type)),
        `\n  public ${type(property.type)} get${property.key}() {` +
        `\n    return this.${property.key} \n  }\n` +
        `\n  public void set${property.key}(${type(property.type)} ${
          property.key
        }) {\n` +
        `    this.${property.key} = ${property.key}\n  }\n`,
      ];
    },
    object({ property }) {
      return strToJavaCode(
        property.key,
        transformName(property.entity.key, {
          firstChatUpperCase: true,
        })
      );
    },
    array({ property }) {
      const childProperty = property.childProperty;
      if (childProperty.type === "object") {
        return strToJavaCode(
          property.key,
          `Array<${(childProperty as any).entity.key}>`
        );
      }
      if (childProperty.type === "null") {
        return strToJavaCode(property.key, `Array<${type("null")}>`);
      }
      return strToJavaCode(property.key, `Array<${type(childProperty.type)}>`);
    },
    after() {
      return "}";
    },
  });
  return "```java\n" + codeResult + "\n```";
};
console.log(ToJava());
