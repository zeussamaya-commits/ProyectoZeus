import { ProductsService } from "./classes/products.service.ts";
import { type Product } from "./interfaces/product.ts";

const productsService = new ProductsService();
const productsContainer = document.getElementById(
  "productsContainer"
) as HTMLDivElement;
const productTemplate = document.getElementById(
  "productTemplate"
) as HTMLTemplateElement;

let products: Product[] = [];

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

function createCard(product: Product): HTMLDivElement {
  const card = productTemplate.content.firstElementChild?.cloneNode(
    true
  ) as HTMLDivElement;

  const img = card.querySelector(".card-img-top") as HTMLImageElement;
  img.src = product.mainPhoto;
  img.alt = product.title;

  (card.querySelector(".card-title") as HTMLElement).textContent =
    product.title;
  (card.querySelector(".card-text") as HTMLElement).textContent =
    product.description;
  (card.querySelector(".badge") as HTMLElement).textContent =
    product.category.name;
  (card.querySelector(".text-success") as HTMLElement).textContent =
    `${product.price} euros`;

  (card.querySelector(".distance") as HTMLElement).textContent =
    `${distanceFormat.format(product.distance)} km`;

  (card.querySelector("small.text-muted") as HTMLElement).textContent =
    dateFormat.format(new Date(product.datePublished));

  (card.querySelector(".product-img-link") as HTMLAnchorElement).href =
    `product-detail.html?id=${product.id}`;

  const titleLink = card.querySelector(".card-title") as HTMLAnchorElement;
  titleLink.textContent = product.title;
  titleLink.href = `product-detail.html?id=${product.id}`;

  (card.querySelector(".avatar img") as HTMLImageElement).src =
    product.owner.photo;

  (card.querySelector(".avatar-link") as HTMLAnchorElement).href =
    `profile.html?id=${product.owner.id}`;

  const sellerName = card.querySelector(".name") as HTMLAnchorElement;
  sellerName.textContent = product.owner.name;
  sellerName.href = `profile.html?id=${product.owner.id}`;

  (card.querySelector(".views") as HTMLElement).textContent = String(
    product.numVisits
  );

  if (!product.mine) {
    (card.querySelector(".delete") as HTMLElement).classList.add("d-none");
  }

  card.querySelector(".delete")?.addEventListener("click", async () => {
    if (!confirm(`¿Seguro que quieres borrar "${product.title}"?`)) {
      return;
    }

    try {
      await productsService.delete(product.id);
      card.remove();
      products = products.filter(p => p.id !== product.id);
    } catch (error) {
      alert(
        "Error al borrar el producto: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  });

  return card;
}

function showProducts(productsToShow: Product[]): void {
  productsContainer.replaceChildren();
  productsToShow.forEach(element => {
    productsContainer.append(createCard(element));
  });
}

async function loadProducts(): Promise<void> {
  try {
    const resp = await productsService.getAll(1, "", "distance");
    products = resp.products;
    showProducts(products);
  } catch {
    alert("no se han cargado los productos");
  }
}

loadProducts();
