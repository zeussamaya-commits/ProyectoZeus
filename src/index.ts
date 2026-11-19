import { ProductsService } from "./classes/products.service.ts";
import { type Product } from "./interfaces/product.ts";
import { initAuthenticatedPage } from "./utils.ts";

initAuthenticatedPage();

const productsService = new ProductsService();
const productsContainer = document.getElementById(
  "productsContainer"
) as HTMLDivElement;
const productTemplate = document.getElementById(
  "productTemplate"
) as HTMLTemplateElement;

let page = 1;
let search = "";
let sort = "distance";

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

const searchForm = document.getElementById("searchForm") as HTMLFormElement;
const searchInput = document.getElementById("search") as HTMLInputElement;
const order = document.getElementById("order") as HTMLSelectElement;

const filterInfo = document.getElementById("filterInfo") as HTMLDivElement;

const urlParams = new URLSearchParams(location.search);
const status = urlParams.get("status");
const user = status ? urlParams.get("user") : null;

const loadMoreBtn = document.getElementById("loadMore") as HTMLButtonElement;

function createCard(product: Product): HTMLDivElement {
  const card = productTemplate.content.firstElementChild?.cloneNode(
    true
  ) as HTMLDivElement;

  const img = card.querySelector(".card-img-top") as HTMLImageElement;
  img.src = product.mainPhoto;
  img.alt = product.title;

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
    } catch (error) {
      alert(
        (error as { error?: string }).error ?? "Error al borrar el producto"
      );
    }
  });

  return card;
}

function showProducts(productsToShow: Product[]): void {
  if (page === 1) productsContainer.replaceChildren();
  productsToShow.forEach(element => {
    productsContainer.append(createCard(element));
  });
}

async function loadProducts(): Promise<void> {
  try {
    const resp = await productsService.getAll(page, search, sort, status, user);

    showProducts(resp.products);
    loadMoreBtn.classList.toggle("d-none", page >= resp.total_pages);
  } catch {
    alert("no se han cargado los productos");
  }
}

function showFilterInfo(): void {
  if (search) {
    filterInfo.textContent = `Filtrando por "${search}" y ordenando por ${sort}.`;
  } else {
    filterInfo.textContent = `Showing all products. Sorted by ${sort}.`;
  }
}

searchForm.addEventListener("submit", (event: Event) => {
  event.preventDefault();
  search = searchInput.value;
  page = 1;
  sort = order.value;
  showFilterInfo();
  loadProducts();
});

loadMoreBtn.addEventListener("click", () => {
  page++;
  loadProducts();
});

loadProducts();
