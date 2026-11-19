import { AuthService } from "./classes/auth.service.ts";
import { MyGeolocation } from "./classes/my-geolocation.ts";

const formRegister = document.getElementById(
  "form-register"
) as HTMLFormElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const email2Input = document.getElementById("email2") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const latInput = document.getElementById("lat") as HTMLInputElement;
const lngInput = document.getElementById("lng") as HTMLInputElement;
const photoInput = document.getElementById("photo") as HTMLInputElement;
const imgPreview = document.getElementById("imgPreview") as HTMLImageElement;
const authService = new AuthService();

authService
  .checkToken()
  .then(() => location.assign("index.html"))
  .catch(() => {
    // No hay sesión: el usuario se queda en esta página
  });

MyGeolocation.getLocation()
  .then(cords => {
    latInput.value = cords.latitude.toString();
    lngInput.value = cords.longitude.toString();
  })
  .catch(console.error);

formRegister.addEventListener("submit", async (evento: Event) => {
  evento.preventDefault();

  try {
    await authService.register({
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      lat: parseFloat(latInput.value),
      lng: parseFloat(lngInput.value),
      photo: imgPreview.src,
    });
    location.assign("login.html");
  } catch (error) {
    const message = (error as { message?: string | string[] }).message;
    alert(
      Array.isArray(message)
        ? message.join("\n")
        : (message ?? "Error al registrar")
    );
  }
});

function checkEmails(): void {
  if (emailInput.value !== email2Input.value) {
    email2Input.setCustomValidity("Los correos no coinciden");
  } else {
    email2Input.setCustomValidity("");
  }
}
emailInput.addEventListener("input", checkEmails);
email2Input.addEventListener("input", checkEmails);

photoInput.addEventListener("change", () => {
  const file = photoInput.files?.[0];

  if (!file) {
    photoInput.setCustomValidity("");
    imgPreview.src = "";
    imgPreview.classList.add("d-none");
    return;
  }

  if (file.size > 200 * 1024) {
    photoInput.setCustomValidity("The photo must be less than 200KB");
    imgPreview.src = "";
    imgPreview.classList.add("d-none");
    return;
  }

  photoInput.setCustomValidity("");

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    imgPreview.src = reader.result as string;
    imgPreview.classList.remove("d-none");
  });
  reader.readAsDataURL(file);
});
