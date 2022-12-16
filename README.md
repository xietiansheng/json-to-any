# json-to-any
> 支持json转换任意代码格式，支持层级嵌套生成

## 安装
```cmd
npm install json-to-any --save
```

## 使用
> 请参考 `/example` 文件夹下js演示代码
```ts
import { parse } from "json-to-any";

// 支持js对象
// 支持json数据
const jsonCode = {
  name: "Jack",
  age: 20,
  car: {
    brand: "BMW",
  }
};

const entityList = parse(jsonCode);

const result = transformCode(entityList, {
  default({ property }) {
    // 默认行为
  },
  array({ property }) {
    // 数组类型处理
  },
  before({ entity }){
    // 实体前置代码
  },
  after({ entity }) {
    // 实体后置代码
  },
});
```

