const sveltePreprocess = require("svelte-preprocess");
import adapter from "@sveltejs/adapter-vercel";
const production = !process.env.ROLLUP_WATCH;

module.exports = {
  preprocess: sveltePreprocess({
    sourceMap: !production,
    postcss: true,
  }),
  kit: {
    adapter: adapter(),
  },
  compilerOptions: {
    dev: !production,
  },
};
