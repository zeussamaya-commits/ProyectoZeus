import { AuthService } from "./classes/auth.service.ts";

const authService = new AuthService();

export function initAuthenticatedPage(): void {
  authService.checkToken().catch(() => location.assign("login.html"));

  document.getElementById("logout")?.addEventListener("click", () => {
    authService.logout();
    location.assign("login.html");
  });
}
