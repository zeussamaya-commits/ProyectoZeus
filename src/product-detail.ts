import { ProductsService } from "./classes/products.service.ts";
import type { Product } from "./interfaces/product.ts";
import { MapService } from "./classes/map-service.ts";

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
const bookmarkBtn = document.getElementById("bookmarkBtn") as HTMLButtonElement;
const deleteBtn = document.getElementById("deleteProduct") as HTMLButtonElement;
const buyBtn = document.getElementById("buyProduct") as HTMLButtonElement;

if (!id) {
  alert("Producto no encontrado");
  location.assign("index.html");
} else {
  productsService
    .getId(Number(id))
    .then(product => {
      showProduct(product);
      showMap(product);
    })
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

  bookmarkBtn.classList.toggle("active", product.bookmarked);
  bookmarkBtn.onclick = async (): Promise<void> => {
    try {
      if (product.bookmarked) {
        await productsService.removeBookmark(product.id);
      } else {
        await productsService.addBookmark(product.id);
      }
      product.bookmarked = !product.bookmarked;
      bookmarkBtn.classList.toggle("active", product.bookmarked);
    } catch {
      alert("No se ha podido actualizar favoritos");
    }
  };

  deleteBtn.classList.toggle("d-none", !product.mine);
  deleteBtn.onclick = async (): Promise<void> => {
    if (!confirm(`¿Seguro que quieres borrar "${product.title}"?`)) {
      return;
    }

    try {
      await productsService.delete(product.id);
      location.assign("index.html");
    } catch {
      alert("No se ha podido borrar el producto");
    }
  };

  buyBtn.classList.toggle("d-none", !(product.status === 1 && !product.mine));
  buyBtn.onclick = async (): Promise<void> => {
    if (!confirm(`¿Quieres comprar "${product.title}"?`)) {
      return;
    }

    try {
      await productsService.buy(product.id);
      const updated = await productsService.getId(product.id);
      showProduct(updated);
    } catch (error) {
      alert((error as { error?: string }).error ?? "No se ha podido comprar");
    }
  };
}

function showMap(product: Product): void {
  const coords = {
    latitude: product.owner.lat,
    longitude: product.owner.lng,
  };
  const mapService = new MapService(coords, "map", 14);
  mapService.createMarker(coords);
}
