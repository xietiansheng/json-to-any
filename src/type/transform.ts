import { ArrayProperty, NormalProperty, ObjectProperty, Property } from "./property";
import { Entity } from "./entity";

export interface Options {
  before?: transformCodeEntityFn;
  after?: transformCodeEntityFn;
  default: (property: Property, entity: Entity) => string;
  // 数据类型
  array?: (property: ArrayProperty, entity: Entity) => string;
  object?: (property: ObjectProperty, entity: Entity) => string;
  string?: (property: NormalProperty, entity: Entity) => string;
  boolean?: (property: NormalProperty, entity: Entity) => string;
  number?: (property: NormalProperty, entity: Entity) => string;
  null?: (property: NormalProperty, entity: Entity) => string;
}

export type transformCodeEntityFn = (entity: Entity) => string;
