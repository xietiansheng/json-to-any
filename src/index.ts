import { firstChatToUpperCase, isNull, isObject } from "./utils/shared";
import { parseJsonToProperty } from "./utils/entity";
import { Entity } from "./type/entity";
import { Property } from "./type/property";
import { Options } from "./type/transform";

const parseJsonToObject = (jsonCode: string): Record<any, any> => {
  let result = {};
  try {
    result = JSON.parse(jsonCode);
  } catch (e) {
    throw Error("parse code error ==>" + e);
  }
  return result;
};

const parse = (jsonCode: string | object): Entity[] => {
  if (isNull(jsonCode)) {
    throw Error("The Value cannot be null.");
  }
  const target = isObject(jsonCode) ? jsonCode : parseJsonToObject(jsonCode);
  const property = parseJsonToProperty(target);
  const modelEntityList: Entity[] = [];
  const root = traverseProperty(property, modelEntityList);
  modelEntityList.unshift(root);
  return modelEntityList;
};

/**
 * 递归处理所有实体类
 * @param property
 * @param modelEntityList
 */
const traverseProperty = (property: Property, modelEntityList: Entity[]): Entity => {
  property.properties.forEach(item => {
    if (item.type === "object" || item.type === "array") {
      item.entity = traverseProperty(item, modelEntityList);
      modelEntityList.push(item.entity);
    }
  });
  const { key, type, properties } = property;
  return {
    key,
    type,
    properties,
    parent: { key, type },
    get modelName() {
      return firstChatToUpperCase(this.key);
    }
  };
};

/**
 * 代码生成
 * @param list 请使用parse转换json为可用EntityModel数组
 * @param options 代码实现
 */
const transformCode = (list: Entity[], options: Options) => {
  let code = "";
  list.forEach(entity => {
    code += (options.before?.({ entity }) || "");
    entity.properties.forEach(property => {
      const fn = options[property.type];
      if (fn) {
        code += fn({ property, entity: property.entity! });
      } else {
        code += options.default({ property, entity: property.entity! });
      }
    });
    code += (options.after?.({ entity }) || "");
  });
  return code;
};

export default {
  parse,
  transformCode,
};


