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

  new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(product.distance);

  new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(product.datePublished));

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
