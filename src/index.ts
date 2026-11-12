import { ProductsService } from "./classes/products.service.ts"; 
import { type Product } from "./interfaces/product.ts";

const productsService = new ProductsService();
const productsContainer = document.getElementById("products-container") as HTMLDivElement;
const productTemplate = document.getElementById("product-template") as HTMLTemplateElement;
const searchInput = document.getElementById("search") as HTMLInputElement;

let products: Product[] = [];

function createCard(product: Product): HTMLDivElement {
    const card = productTemplate.content.firstElementChild?.cloneNode(true) as HTMLDivElement;
    
    const img = card.querySelector(".card-img-top") as HTMLImageElement;
    img.src = product.mainPhoto;
    img.alt = product.title;

    (card.querySelector(".card-title") as HTMLElement).textContent = product.title;
    (card.querySelector(".card-text")as HTMLElement).textContent = product.description;
    (card.querySelector(".category")as HTMLElement).textContent = product.category.name;
    (card.querySelector(".price")as HTMLElement).textContent = `${product.price} euros`;

    card.querySelector(".btn-delete")?.addEventListener("click", async () => {
    if (!confirm(`¿Seguro que quieres borrar "${product.title}"?`)) {
      return;
    }

    try {
      await productsService.delete(product.id);
      card.remove();
      products = products.filter((p) => p.id !== product.id);
    } catch (error) {
      alert("Error al borrar el producto: " + (error instanceof Error ? error.message : String(error))
);
    }
  });

    return card;
}

function showProducts(productsToShow: Product[]) : void {
    productsContainer.replaceChildren();
    productsToShow.forEach(element => {
        productsContainer.append(createCard(element));
    });
}

async function loadProducts () : Promise<void> {
    try {
        products = await productsService.getAll();
        showProducts(products);
    } catch {
        alert("no se han cargado los productos");
    }
}

loadProducts();

searchInput.addEventListener("input", () => {
  const text = searchInput.value.trim().toLowerCase();

  const filtered = products.filter(
    (product) =>
      product.title.toLowerCase().includes(text) ||
      product.description.toLowerCase().includes(text)
  );

  showProducts(filtered);
});