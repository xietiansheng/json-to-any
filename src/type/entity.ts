import { PropertyType } from "./property";
import { Property } from "./property";

export interface Entity {
  key: string;
  type: PropertyType;
  properties: Property[];
  // 合并源
  parent?: {
    key: string;
    type: string;
  };
}
