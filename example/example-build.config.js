const path = require("path");

const examplePath = (name) => path.join("example", name);

const build = () => require("esbuild").build({
  entryPoints: [examplePath("code-java.ts"), examplePath("code-ts.ts")],
  sourcemap: "inline",
  bundle: true,
  outdir: examplePath("dist"),
});

build();
