import { CategoriesService } from "./classes/categories.service.ts";
import { ProductsService } from "./classes/products.service.ts";
import type { ProductInsert } from "./interfaces/product.ts";

const categoriesService = new CategoriesService();
const productsService = new ProductsService();

const newProductForm = document.getElementById("newProduct") as HTMLFormElement;
const categorySelect = document.getElementById("category") as HTMLSelectElement;
const imageInput = document.getElementById("image") as HTMLInputElement;
const imgPreview = document.getElementById("imgPreview") as HTMLImageElement;


async function loadCategories(): Promise<void> {
    try {
        const categories = await categoriesService.getAll();

        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = String(category.id);
            option.textContent = category.name;
            categorySelect.append(option);
        });
    } catch{
        alert("No se han podido agregar las categorias");
    }
}

loadCategories();

imageInput.addEventListener("change", () => {
    const file = imageInput.files?.[0];

    if(!file) {
        imageInput.setCustomValidity("");
        imgPreview.src = "";
        imgPreview.classList.add("d-none");
        return;
    }

    if (file.size > 200 * 1024) {
    imageInput.setCustomValidity("The photo must be less than 200KB");
    imgPreview.src = "";
    imgPreview.classList.add("d-none");
    return;
    }

    imageInput.setCustomValidity("");

    const reader = new FileReader();
    reader.addEventListener("load", () => {
        imgPreview.src = reader.result as string; 
        imgPreview.classList.remove("d-none");
    });
    reader.readAsDataURL(file);
});

newProductForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const product: ProductInsert = {
        title: (document.getElementById("title")as HTMLInputElement).value.trim(),
        description: (document.getElementById("description") as HTMLTextAreaElement).value.trim(),
        price: Number((document.getElementById("price") as HTMLInputElement).value),
        category: Number(categorySelect.value),
        mainPhoto: imgPreview.src,
    };

    try {
        await productsService.post(product);
        location.assign("index.html");
    } catch (error) {
        alert("Error al guardar el producto: " + (error instanceof Error ? error.message : String(error)));
    }
});

