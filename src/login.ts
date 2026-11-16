import { AuthService } from "./classes/auth.service.ts";
import { MyGeolocation } from "./classes/my-geolocation.ts";

const formLogin = document.getElementById("form-login") as HTMLFormElement;
const authService = new AuthService();
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;

formLogin.addEventListener("submit", async (evento: Event) => {
  evento.preventDefault();

  const cords = await MyGeolocation.getLocation();

  try {
    await authService.login({
      email: emailInput.value,
      password: passwordInput.value,
      lat: cords.latitude,
      lng: cords.longitude,
    });
    location.assign("index.html");
  } catch (error) {
    alert((error as { error?: string }).error ?? "Error al iniciar sesión");
  }
});
