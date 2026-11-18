import { UserService } from "./classes/user.service.ts";
import { type User } from "./interfaces/user.ts";

const userService = new UserService();
const id = new URLSearchParams(location.search).get("id");

const photo = document.getElementById("photo") as HTMLImageElement;
const photoLabel = photo.nextElementSibling as HTMLLabelElement;
const nameTitle = document.getElementById("name") as HTMLHeadingElement;
const emailTitle = document.querySelector("#email small") as HTMLElement;
const editProfileBtn = document.getElementById(
  "editProfile"
) as HTMLButtonElement;
const editPasswordBtn = document.getElementById(
  "editPassword"
) as HTMLButtonElement;

const profileForm = document.querySelector(
  "#profileForm form"
) as HTMLFormElement;
const nameInput = profileForm.querySelector("#name") as HTMLInputElement;
const emailInput = profileForm.querySelector("#email") as HTMLInputElement;

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
}
