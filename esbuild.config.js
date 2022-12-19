const build = () => require("esbuild").build({
  outdir: "/dist",
  entryPoints: ["./src/index.ts"],
  bundle: true,
  format: "cjs",
  minify: true,
  sourcemap: "inline"
});

build();
