const profiles = {
  student: {
    name: "Estudante",
    headline: "Organize seus materiais em poucos toques.",
    summary: "Digitalize cadernos e documentos, corrija o enquadramento e prepare o conteúdo para compartilhar.",
    mode: "Digitalizar documento",
    tip: "Aponte para o documento inteiro. O contorno amarelo ajuda a confirmar o alinhamento antes da captura.",
    dialogTip: "Aproxime o celular até o documento preencher o contorno. Evite sombras sobre a folha.",
    features: [
      ["Detecção de documento", "Identifica automaticamente as bordas da folha ou do caderno."],
      ["Recorte e alinhamento", "Ajusta a perspectiva para deixar a imagem reta."],
      ["Extração de texto", "Mostra onde o OCR pode transformar a foto em texto editável."],
      ["Foco e iluminação", "Sugere melhorias antes de registrar o conteúdo."]
    ],
    tools: ["OCR", "Recorte automático", "Foco guiado"]
  },
  senior: {
    name: "Idoso",
    headline: "Fotografe com confiança e sem medo de errar.",
    summary: "Controles maiores, instruções diretas e apenas as opções necessárias para registrar bons momentos.",
    mode: "Foto simples",
    tip: "Segure o celular com as duas mãos. Quando a imagem estiver estável, use o botão azul central.",
    dialogTip: "Apoie os cotovelos perto do corpo. Isso reduz o movimento e melhora a nitidez.",
    features: [
      ["Botões maiores", "Os controles principais ficam mais fáceis de identificar e tocar."],
      ["Guia passo a passo", "Cada ação aparece em linguagem simples e direta."],
      ["Zoom sugerido", "O assistente orienta quando aproximar ou afastar a imagem."],
      ["Estabilidade", "Um aviso ajuda a evitar fotos tremidas."]
    ],
    tools: ["Botões maiores", "Estabilidade", "Luz automática"]
  },
  creator: {
    name: "Criador",
    headline: "Configure menos. Crie por mais tempo.",
    summary: "Acesse enquadramento, estabilização e luz sem interromper o ritmo da gravação.",
    mode: "Vídeo criativo",
    tip: "Use as linhas da grade para posicionar o assunto. Mantenha os olhos próximos à linha superior.",
    dialogTip: "Antes de gravar, confirme o enquadramento e faça um movimento curto para testar a estabilização.",
    features: [
      ["Grade de enquadramento", "Ajuda a posicionar o assunto com a regra dos terços."],
      ["Estabilização", "Reduz movimentos durante gravações feitas à mão."],
      ["Retrato e iluminação", "Destaca pessoas e melhora a leitura do rosto."],
      ["Controles essenciais", "Mantém os ajustes importantes próximos do polegar."]
    ],
    tools: ["Grade", "Estabilização", "Retrato"]
  }
};

const state = {
  route: "home",
  profile: localStorage.getItem("jovi-profile") || "",
  captures: 0,
  gridVisible: true
};

const appShell = document.querySelector("#app-shell");
const loadingScreen = document.querySelector("#loading-screen");
const main = document.querySelector("#app-content");
const profileForm = document.querySelector("#profile-form");
const profileOptions = document.querySelector("#profile-options");
const profileError = document.querySelector("#profile-error");
const themeButton = document.querySelector("#theme-button");
const helpDialog = document.querySelector("#help-dialog");
const tipDialog = document.querySelector("#tip-dialog");
const toast = document.querySelector("#toast");

function profileCard(key, profile, index) {
  const features = profile.features.slice(0, 3).map(([title]) => `<li>${title}</li>`).join("");
  const checked = state.profile === key ? "checked" : "";
  return `
    <label class="profile-option ${index === 0 ? "lg:row-span-2" : ""}">
      <input type="radio" name="profile" value="${key}" ${checked} />
      <span class="profile-card block">
        <span class="mb-8 block text-sm font-black uppercase tracking-[0.14em] text-jovi-700 dark:text-jovi-500">${profile.name}</span>
        <h2>${profile.headline}</h2>
        <p>${profile.summary}</p>
        <ul>${features}</ul>
      </span>
    </label>
  `;
}

function renderProfiles() {
  profileOptions.innerHTML = Object.entries(profiles).map(([key, profile], index) => profileCard(key, profile, index)).join("");
}

function activeProfile() {
  return profiles[state.profile] || profiles.student;
}

function renderGuide() {
  const profile = activeProfile();
  document.querySelector("#guide-title").textContent = `${profile.name}: ${profile.headline}`;
  document.querySelector("#guide-description").textContent = profile.summary;
  document.querySelector("#guide-features").innerHTML = profile.features.map(([title, description], index) => `
    <article class="guide-feature">
      <span class="guide-feature-number">${String(index + 1).padStart(2, "0")}</span>
      <div><h2>${title}</h2><p>${description}</p></div>
    </article>
  `).join("");
}

function renderCamera() {
  const profile = activeProfile();
  document.querySelector("#camera-title").textContent = `Modo ${profile.name}`;
  document.querySelector("#camera-tip").textContent = profile.tip;
  document.querySelector("#camera-mode").textContent = profile.mode;
  document.querySelector("#tip-title").textContent = `Dica para ${profile.name}`;
  document.querySelector("#tip-dialog-copy").textContent = profile.dialogTip;
  document.querySelector("#camera-tools").innerHTML = profile.tools.map((tool) => `<span class="tool-chip">${tool}</span>`).join("");
  document.querySelector("#scan-frame").classList.toggle("hidden", state.profile !== "student");
}

function renderGallery() {
  const empty = document.querySelector("#gallery-empty");
  const items = document.querySelector("#gallery-items");
  empty.classList.toggle("hidden", state.captures > 0);
  items.innerHTML = Array.from({ length: state.captures }, (_, index) => `
    <article class="gallery-card">
      <img src="assets/camera-student.png" alt="Captura de demonstração ${index + 1}" />
      <div class="p-4">
        <strong class="text-lg">Captura ${index + 1}</strong>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Modo ${activeProfile().name}</p>
      </div>
    </article>
  `).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.add("hidden"), 2600);
}

function navigate(route) {
  if ((route === "guide" || route === "camera") && !state.profile) {
    route = "profiles";
    showToast("Escolha um perfil para continuar.");
  }

  state.route = route;
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("hidden", view.dataset.view !== route);
  });
  document.querySelectorAll(".nav-button").forEach((button) => {
    const current = button.dataset.route === route;
    if (current) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });

  if (route === "guide") renderGuide();
  if (route === "camera") renderCamera();
  if (route === "gallery") renderGallery();
  window.scrollTo({ top: 0, behavior: "smooth" });
  main.focus({ preventScroll: true });
}

function setDialog(dialog, open) {
  dialog.classList.toggle("hidden", !open);
  document.body.style.overflow = open ? "hidden" : "";
  if (open) dialog.querySelector("button").focus();
}

function applyTheme(dark) {
  document.documentElement.classList.toggle("dark", dark);
  themeButton.textContent = dark ? "Tema claro" : "Tema escuro";
  themeButton.setAttribute("aria-pressed", String(dark));
  localStorage.setItem("jovi-theme", dark ? "dark" : "light");
}

document.addEventListener("click", (event) => {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) navigate(routeButton.dataset.route);
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selected = new FormData(profileForm).get("profile");
  if (!selected) {
    profileError.classList.remove("hidden");
    profileOptions.querySelector("input")?.focus();
    return;
  }
  state.profile = selected;
  localStorage.setItem("jovi-profile", selected);
  profileError.classList.add("hidden");
  navigate("guide");
});

document.querySelector("#help-button").addEventListener("click", () => setDialog(helpDialog, true));
document.querySelector("#close-help").addEventListener("click", () => setDialog(helpDialog, false));
document.querySelector("#tip-button").addEventListener("click", () => setDialog(tipDialog, true));
document.querySelector("#close-tip").addEventListener("click", () => setDialog(tipDialog, false));

[helpDialog, tipDialog].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) setDialog(dialog, false);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!helpDialog.classList.contains("hidden")) setDialog(helpDialog, false);
    if (!tipDialog.classList.contains("hidden")) setDialog(tipDialog, false);
  }
});

document.querySelector("#grid-button").addEventListener("click", () => {
  state.gridVisible = !state.gridVisible;
  document.querySelector("#camera-grid").classList.toggle("hidden", !state.gridVisible);
  const button = document.querySelector("#grid-button");
  button.textContent = state.gridVisible ? "Grade ativa" : "Grade oculta";
  button.setAttribute("aria-pressed", String(state.gridVisible));
});

document.querySelector("#capture-button").addEventListener("click", () => {
  const flash = document.querySelector("#flash-layer");
  flash.classList.remove("is-flashing");
  void flash.offsetWidth;
  flash.classList.add("is-flashing");
  state.captures += 1;
  document.querySelector("#gallery-count").textContent = state.captures;
  showToast("Captura criada. Ela já está na galeria.");
});

document.querySelector("#gallery-button").addEventListener("click", () => navigate("gallery"));

themeButton.addEventListener("click", () => {
  applyTheme(!document.documentElement.classList.contains("dark"));
});

const savedTheme = localStorage.getItem("jovi-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme ? savedTheme === "dark" : prefersDark);
renderProfiles();

window.setTimeout(() => {
  loadingScreen.classList.add("hidden");
  appShell.classList.remove("hidden");
  navigate("home");
}, 650);
