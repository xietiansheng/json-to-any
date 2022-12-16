import { isArray, isNull } from "./shared";
import { Property } from "../type/property";

export const parseJsonToProperty = (target: Record<any, any>): Property => {
  return {
    key: "root",
    type: "object",
    value: target,
    properties: Object.keys(target).map(key => {
      const value = target[key];
      const type = isArray(value) ? "array" : isNull(value) ? "null" : typeof value;
      const property = { type, key, value } as Property;
      if (type === "object") {
        property.properties = parseJsonToProperty(value).properties;
      }
      if (type === "array" && value.length) {
        property.properties = parseJsonToProperty(value[0]).properties;
      }
      return property;
    })
  };
};
