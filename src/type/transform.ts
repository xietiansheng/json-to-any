import { Property, PropertyType } from "./property";
import { Entity } from "./entity";


type PropTransform = {
  [K in PropertyType | "before" | "after"]?: transformCodeFn
}

export interface Options extends PropTransform {
  default: transformCodeFn;
}

export type transformCodeFn = (options: { property?: Property, entity: Entity }) => string;
