import { firstChatToUpperCase, isNull, isObject } from "./utils/shared";
import { parseJsonToProperty } from "./utils/entity";
import { Entity } from "./type/entity";
import { isArrayProperty, isNormalProperty, isObjectProperty, Property, RootProperty } from "./type/property";
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
  let target;
  try {
    target = isObject(jsonCode) ? jsonCode : parseJsonToObject(jsonCode);
  } catch (e) {
    throw Error("parse json to object error;" + e);
  }
  let rootProperty;
  try {
    rootProperty = parseJsonToProperty(target);
  } catch (e) {
    throw Error("parse json to property error;" + e);
  }
  const modelEntityList: Entity[] = [];
  let root;
  try {
    root = traverseProperty(rootProperty, modelEntityList);
  } catch (e) {
    throw Error("traverse property error;" + e);
  }
  modelEntityList.unshift(root);
  return modelEntityList;
};

/**
 * 递归处理所有实体类
 * @param property
 * @param modelEntityList
 */
const traverseProperty = (property: RootProperty, modelEntityList: Entity[]): Entity => {
  property.properties.forEach((item: Property) => {
    if (isObjectProperty(item)) {
      item.entity = traverseProperty(item, modelEntityList);
      modelEntityList.push(item.entity);
    } else if (isArrayProperty(item)) {
      const childProperty = item.childProperty;
      if (isObjectProperty(childProperty)) {
        childProperty.entity = traverseProperty(childProperty, modelEntityList);
        modelEntityList.push(childProperty.entity);
      }
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
    code += (options.before?.(entity) || "");
    entity.properties.forEach(property => {
      const fn = options[property.type];
      if (!fn) {
        code += options["default"](property, entity);
        return;
      }
      if (isObjectProperty(property)) {
        code += options["object"]?.(property, entity);
      } else if (isArrayProperty(property)) {
        code += options["array"]?.(property, entity);
      } else if (isNormalProperty(property)) {
        code += options[property.type]?.(property as any, entity);
      }
    });
    code += (options.after?.(entity) || "");
  });
  return code;
};

export default {
  parse,
  transformCode,
};


