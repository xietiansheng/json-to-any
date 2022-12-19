import { getPropertyType } from "./shared";
import {
  ArrayChildProperty,
  ArrayProperty,
  ObjectProperty,
  Property,
  PropertyType,
  RootProperty
} from "../type/property";

export const parseJsonToProperty = (target: Record<any, any>): RootProperty => {
  return {
    key: "root",
    type: "object",
    value: target,
    properties: <Property[]>Object.keys(target).map(key => {
      const value = target[key];
      const type = getPropertyType(value);
      if (type === "object") {
        return {
          key,
          value,
          type,
          properties: parseJsonToProperty(value).properties,
        };
      }
      if (type === "array" && value.length) {
        return handleArrayType({
          key,
          value,
        });
      }
      return {
        key,
        type,
        value,
      };
    })
  };
};

function handleArrayType({ key, value }: { key: string, value: any }): ArrayProperty {
  // 确定所有子级的类型
  const childrenTypes = new Set(value.map((item: any) => getPropertyType(item)));
  const childType = [...childrenTypes][0] as PropertyType;
  let childProperty: ArrayChildProperty = {
    key,
    value: "",
    type: "null",
  };
  // 联合类型，做any处理
  if (childrenTypes.size !== 1) {
    childProperty.type = "null";
  } else if (childType === "object") {
    // 处理对象类型，多个对象会合并所有属性
    childProperty.type = "object";
    // 单个对象直接返回
    if (value.length === 1) {
      childProperty.value = value[0];
    } else {
      const mergeObject = value.reduce((pre: Record<any, any>, item: Record<any, any>) => Object.assign(pre, item), {});
      childProperty.value = mergeObject;
      (<ObjectProperty>childProperty).properties = parseJsonToProperty(mergeObject).properties;
    }
  } else {
    // 其他类型不作处理
    childProperty.type = childType;
  }

  return {
    key,
    value,
    type: "array",
    childProperty,
  };

}
