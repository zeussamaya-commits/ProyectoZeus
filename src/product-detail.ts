import { ProductsService } from "./classes/products.service.ts";
import type { Product } from "./interfaces/product.ts";

const id = new URLSearchParams(location.search).get("id");
const productsService = new ProductsService();

const distanceFormat = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormat = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const ownerPhoto = document.getElementById("ownerPhoto") as HTMLImageElement;
const ownerName = document.getElementById("ownerName") as HTMLSpanElement;

if (!id) {
  alert("Producto no encontrado");
  location.assign("index.html");
} else {
  productsService
    .getId(Number(id))
    .then(showProduct)
    .catch(() => {
      alert("No se ha podido cargar el producto");
      location.assign("index.html");
    });
}

function showProduct(product: Product): void {
  (document.getElementById("title") as HTMLHeadingElement).textContent =
    product.title;
  (document.getElementById("description") as HTMLParagraphElement).textContent =
    product.description;
  (document.getElementById("price") as HTMLSpanElement).textContent =
    `${product.price} euros`;
  (document.getElementById("category") as HTMLSpanElement).textContent =
    product.category.name;
  (document.getElementById("mainPhoto") as HTMLImageElement).src =
    product.mainPhoto;

  (document.getElementById("datePublished") as HTMLSpanElement).textContent =
    dateFormat.format(new Date(product.datePublished));
  (document.getElementById("numVisits") as HTMLSpanElement).textContent =
    String(product.numVisits);
  (document.getElementById("distance") as HTMLSpanElement).textContent =
    `${distanceFormat.format(product.distance)} `;
  ownerPhoto.src = product.owner.photo;
  ownerName.textContent = product.owner.name;
  (document.getElementById("ownerEmail") as HTMLAnchorElement).textContent =
    product.owner.email;

  const goToProfile = (): void => {
    location.assign(`profile.html?id=${product.owner.id}`);
  };
  ownerPhoto.onclick = goToProfile;
  ownerName.onclick = goToProfile;
}
