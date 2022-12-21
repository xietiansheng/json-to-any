import { isNull, isObject } from "./utils/shared";
import { parseJsonToProperty } from "./utils/entity";
import { Entity } from "./type/entity";
import { isArrayProperty, isNormalProperty, isObjectProperty, Property, RootProperty } from "./type/property";
import { Options, TransformCode } from "./type/transform";

const parseJsonToObject = (jsonCode: string): Record<any, any> => {
  let result = {};
  try {
    result = JSON.parse(jsonCode);
  } catch (e) {
    throw Error("parse code error ==>" + e);
  }
  return result;
};

/**
 * 递归处理所有实体类
 * @param property
 * @param modelEntityList
 */
const _traverseProperty = (property: RootProperty, modelEntityList: Entity[]): Entity => {
  property.properties.forEach((item: Property) => {
    if (isObjectProperty(item)) {
      item.entity = _traverseProperty(item, modelEntityList);
      modelEntityList.push(item.entity);
    } else if (isArrayProperty(item)) {
      const childProperty = item.childProperty;
      if (isObjectProperty(childProperty)) {
        childProperty.entity = _traverseProperty(childProperty, modelEntityList);
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
  };
};

export const parse = (jsonCode: string | object): Entity[] => {
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
    root = _traverseProperty(rootProperty, modelEntityList);
  } catch (e) {
    throw Error("traverse property error;" + e);
  }
  modelEntityList.unshift(root);
  return modelEntityList;
};

/**
 * 代码生成
 * @param list 请使用parse转换json为可用EntityModel数组
 * @param options 代码实现
 */
export const transformCode: TransformCode = (list: Entity[], options: Options) => {
  let code = "";
  let curRound = 0;
  let newLength = true;
  const getCurRoundData = (codeRes: string | string[] | undefined): string => {
    let codeList = [];
    if (!Array.isArray(codeRes)) {
      codeList.push(codeRes || "");
    } else {
      codeList = [...codeRes];
    }
    let res = "";
    if (codeList.length > curRound + 1) {
      res = codeList[curRound];
      newLength = true;
    } else if (codeList.length === curRound + 1) {
      res = codeList[curRound];
    }
    return res;
  };
  list.forEach(entity => {
    // 将上一轮循环拿到的最大数值继续拿来循环
    code += options.before?.({ entity }) || "";
    curRound = 0;
    do {
      newLength = false;
      entity.properties.forEach(property => {
        const fn = options[property.type];
        if (!fn) {
          code += getCurRoundData(options["default"]({ property, entity }));
          return;
        }
        // code += getCurRoundData(fn?.({ property: property as any, entity }));
        if (isObjectProperty(property)) {
          code += getCurRoundData(options["object"]?.({ property, entity }));
        } else if (isArrayProperty(property)) {
          code += getCurRoundData(options["array"]?.({ property, entity }));
        } else if (isNormalProperty(property)) {
          code += getCurRoundData(options[property.type]?.({ property: property as any, entity }));
        }
      });
      if (newLength) {
        curRound++;
      }
    } while (newLength);
    code += options.after?.({ entity }) || "";
  });
  return code;
};
