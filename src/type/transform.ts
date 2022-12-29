import { ArrayProperty, NormalProperty, ObjectProperty, Property } from "./property";
import { Entity } from "./entity";

type TransformOptions<P, > = (params: { property: P, entity: Entity, }) => string | string[]

export interface Options {
  before?: TransformCodeEntityFn;
  after?: TransformCodeEntityFn;
  childAfter?: TransformCodeEntityFn;
  childBefore?: TransformCodeEntityFn;
  default: TransformOptions<Property>;
  // 数据类型
  array?: TransformOptions<ArrayProperty>;
  object?: TransformOptions<ObjectProperty>;
  string?: TransformOptions<NormalProperty>;
  boolean?: TransformOptions<NormalProperty>;
  number?: TransformOptions<NormalProperty>;
  null?: TransformOptions<NormalProperty>;
}

export type TransformCode = (list: Entity[], options: Options,) => string | string[];
export type TransformCodeEntityFn = (params: { entity: Entity }) => string | string[];
