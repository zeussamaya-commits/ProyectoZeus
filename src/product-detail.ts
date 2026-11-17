import { ProductsService } from "./classes/products.service.ts";

const id = new URLSearchParams(location.search).get("id");
const productsService = new ProductsService();

if (!id) {
  alert("Producto no encontrado");
  location.assign("index.html");
} else {
  productsService
    .getId(Number(id))
    .then(product => {
      (document.getElementById("title") as HTMLHeadingElement).textContent =
        product.title;
      (
        document.getElementById("description") as HTMLParagraphElement
      ).textContent = product.description;
      (document.getElementById("price") as HTMLSpanElement).textContent =
        `${product.price} euros`;
      (document.getElementById("category") as HTMLSpanElement).textContent =
        product.category.name;
      (document.getElementById("mainPhoto") as HTMLImageElement).src =
        product.mainPhoto;
    })
    .catch(() => {
      alert("No se ha podido cargar el producto");
      location.assign("index.html");
    });
}
