import { resolve } from "path";
import { defineConfig } from "vite";

const page = name => resolve(import.meta.dirname, `${name}.html`);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: page("index"),
        login: page("login"),
        register: page("register"),
        addProduct: page("add-product"),
        productDetail: page("product-detail"),
        profile: page("profile"),
      },
    },
  },
});
