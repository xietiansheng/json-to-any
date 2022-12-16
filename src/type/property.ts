import { Entity } from "./entity";

export type PropertyType = "object" | "array" | "boolean" | "string" | "number" | "null"

export interface Property {
  entity?: Entity;
  type: PropertyType;
  key: string;
  value: any;
  properties: Property[];
}
