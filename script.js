
/* ARCANA — navegação, tema e formulário */
"use strict";

// Elementos do site
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const navLinks = document.querySelectorAll(".nav-link");
const themeToggle = document.querySelector(".theme-toggle");
const contactForm = document.querySelector("#contact-form");
const interestSelect = document.querySelector("#interest");
const messageField = document.querySelector("#message");
const feedback = document.querySelector("#form-feedback");
const toast = document.querySelector("#toast");
const yearElement = document.querySelector("#current-year");

// Atualiza o ano automaticamente
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Notificação reutilizável
let toastTimeout;

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// Menu para dispositivos móveis
function closeMenu() {
  if (!menuToggle || !siteNav) return;

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  siteNav.classList.remove("open");
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Abrir menu" : "Fechar menu"
    );

    siteNav.classList.toggle("open", !isOpen);
  });
}

// Navegação
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();

    navLinks.forEach((item) => {
      item.classList.toggle("active", item === link);
    });
  });
});

// Fecha o menu com Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// Alternância de tema claro/escuro
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const lightEnabled =
      document.body.classList.toggle("light-theme");

    themeToggle.textContent = lightEnabled ? "☾" : "☼";

    themeToggle.setAttribute(
      "aria-label",
      lightEnabled ? "Ativar tema escuro" : "Ativar tema claro"
    );

    themeToggle.setAttribute(
      "title",
      lightEnabled ? "Ativar tema escuro" : "Ativar tema claro"
    );
  });
}

// Seleção automática do serviço
document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    if (interestSelect) {
      interestSelect.value = link.dataset.service;
    }
  });
});

// Seleção automática de produtos
document.querySelectorAll("[data-product]").forEach((link) => {
  link.addEventListener("click", () => {
    const product = link.dataset.product;

    if (interestSelect) {
      const matchingOption = Array.from(
        interestSelect.options
      ).find((option) => option.value === product);

      const fallbackOption = Array.from(
        interestSelect.options
      ).find(
        (option) =>
          option.value === "Informações sobre outros materiais"
      );

      if (matchingOption) {
        interestSelect.value = matchingOption.value;
      } else if (fallbackOption) {
        interestSelect.value = fallbackOption.value;
      }
    }

    if (messageField && !messageField.value.trim()) {
      messageField.value =
        `Tenho interesse em: ${product}.\n` +
        "Gostaria de saber mais sobre conteúdo, valores e disponibilidade.";
    }
  });
});

// Formulário de contato
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (feedback) feedback.textContent = "";

    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const interest = String(formData.get("interest") || "").trim();
    const message = String(formData.get("message") || "").trim();

    // SUBSTITUA pelo seu endereço de e-mail real
    const contactEmail = "SEUEMAIL@EXEMPLO.COM";

    if (
      !contactEmail ||
      contactEmail === "SEUEMAIL@EXEMPLO.COM"
    ) {
      if (feedback) {
        feedback.textContent =
          "O formulário foi validado, mas falta configurar " +
          "o e-mail de atendimento no script.js.";
      }

      showToast("Configure o e-mail antes de enviar.");
      return;
    }

    const subject = encodeURIComponent(
      `Contato Arcana — ${interest}`
    );

    const body = encodeURIComponent(
      `Olá! Meu nome é ${name}.\n` +
      `Meu e-mail: ${email}\n` +
      `Assunto: ${interest}\n\n` +
      `Mensagem:\n${message}`
    );

    const mailtoUrl =
      `mailto:${contactEmail}?subject=${subject}&body=${body}`;

    if (feedback) {
      feedback.textContent =
        "Tentando abrir seu aplicativo de e-mail. " +
        "Confira se a mensagem foi preparada corretamente.";
    }

    showToast("Preparando sua mensagem...");
    window.location.href = mailtoUrl;
  });
}
