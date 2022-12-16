export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === "object";
export const isString = (val: unknown): val is string => typeof val === "string";
export const isNumber = (val: unknown): val is number => typeof val === "number";
export const isBoolean = (val: unknown): val is number => typeof val === "boolean";
export const isArray = Array.isArray;
export const isNull = (val: unknown): val is null => Object.prototype.toString.call(val).includes("Null");
export const firstChatToUpperCase = (val: string) => (val && val[0].toUpperCase() + val.slice(1, val.length)) || "";
