import { UserService } from "./classes/user.service.ts";
import { type User } from "./interfaces/user.ts";

const userService = new UserService();
const id = new URLSearchParams(location.search).get("id");

const photo = document.getElementById("photo") as HTMLImageElement;
const photoInput = document.getElementById("photoInput") as HTMLInputElement;
const photoLabel = photo.nextElementSibling as HTMLLabelElement;
const nameTitle = document.getElementById("name") as HTMLHeadingElement;
const emailTitle = document.querySelector("#email small") as HTMLElement;
const editProfileBtn = document.getElementById(
  "editProfile"
) as HTMLButtonElement;
const editPasswordBtn = document.getElementById(
  "editPassword"
) as HTMLButtonElement;

const linkSelling = document.getElementById("linkSelling") as HTMLAnchorElement;
const linkSold = document.getElementById("linkSold") as HTMLAnchorElement;
const linkBought = document.getElementById("linkBought") as HTMLAnchorElement;
const linkFavorites = document.getElementById(
  "linkFavorites"
) as HTMLAnchorElement;

const profileForm = document.querySelector(
  "#profileForm form"
) as HTMLFormElement;
const nameInput = profileForm.querySelector("#name") as HTMLInputElement;
const emailInput = profileForm.querySelector("#email") as HTMLInputElement;

const profileFormContainer = document.getElementById(
  "profileForm"
) as HTMLDivElement;
const passwordFormContainer = document.getElementById(
  "passwordForm"
) as HTMLDivElement;
const passwordForm = document.querySelector(
  "#passwordForm form"
) as HTMLFormElement;
const cancelEditProfileBtn = document.getElementById(
  "cancelEditProfile"
) as HTMLButtonElement;
const cancelEditPasswordBtn = document.getElementById(
  "cancelEditPassword"
) as HTMLButtonElement;

const passwordInput = document.getElementById("password") as HTMLInputElement;
const password2Input = document.getElementById("password2") as HTMLInputElement;

userService
  .getProfile(id ? Number(id) : undefined)
  .then(showUser)
  .catch(() => alert("No se ha podido cargar el perfil"));

function showUser(user: User): void {
  photo.src = user.photo;
  nameTitle.textContent = user.name;
  emailTitle.textContent = user.email;

  nameInput.value = user.name;
  emailInput.value = user.email;

  editProfileBtn.classList.toggle("d-none", !user.me);
  editPasswordBtn.classList.toggle("d-none", !user.me);
  photoLabel.classList.toggle("d-none", !user.me);

  linkSelling.href = `index.html?user=${user.id}&status=selling`;
  linkSold.href = `index.html?user=${user.id}&status=sold`;
  linkBought.href = `index.html?user=${user.id}&status=bought`;
  linkFavorites.href = `index.html?user=${user.id}&status=bookmarks`;
}

function toggleEditMode(
  button: HTMLButtonElement,
  formContainer: HTMLDivElement,
  editing: boolean
): void {
  button.classList.toggle("d-none", editing);
  formContainer.classList.toggle("d-none", !editing);
}

editProfileBtn.addEventListener("click", () =>
  toggleEditMode(editProfileBtn, profileFormContainer, true)
);
cancelEditProfileBtn.addEventListener("click", () =>
  toggleEditMode(editProfileBtn, profileFormContainer, false)
);

editPasswordBtn.addEventListener("click", () =>
  toggleEditMode(editPasswordBtn, passwordFormContainer, true)
);
cancelEditPasswordBtn.addEventListener("click", () => {
  passwordForm.reset();
  toggleEditMode(editPasswordBtn, passwordFormContainer, false);
});

profileForm.addEventListener("submit", async (event): Promise<void> => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  try {
    await userService.saveProfile(name, email);
    nameTitle.textContent = name;
    emailTitle.textContent = email;
    toggleEditMode(editProfileBtn, profileFormContainer, false);
    alert("Perfil actualizado correctamente");
  } catch (error) {
    const message = (error as { message?: string | string[] }).message;
    alert(
      Array.isArray(message)
        ? message.join("\n")
        : (message ?? "No se ha podido actualizar el perfil")
    );
  }
});

passwordForm.addEventListener("submit", async (event): Promise<void> => {
  event.preventDefault();

  if (passwordInput.value !== password2Input.value) {
    alert("Las contraseñas no coinciden");
    return;
  }

  try {
    await userService.savePassword(passwordInput.value);
    passwordForm.reset();
    toggleEditMode(editPasswordBtn, passwordFormContainer, false);
    alert("Contraseña actualizada correctamente");
  } catch (error) {
    const message = (error as { message?: string | string[] }).message;
    alert(
      Array.isArray(message)
        ? message.join(" ")
        : (message ?? "No se ha podido actualizar la contraseña")
    );
  }
});

photoInput.addEventListener("change", () => {
  const file = photoInput.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", async (): Promise<void> => {
    try {
      const photoUrl = await userService.savePhoto(reader.result as string);
      photo.src = photoUrl;
      alert("Foto actualizada correctamente");
    } catch {
      alert("No se ha podido actualizar la foto");
    }
  });
  reader.readAsDataURL(file);
});
