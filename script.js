const listingConfig = {
  whatsappNumber: "",
  whatsappMessage:
    "Ciao, vorrei ricevere informazioni sull'appartamento in Via Baldinucci xx a Firenze.",
};

const whatsappLinks = document.querySelectorAll(".js-whatsapp-link");

function buildWhatsAppUrl() {
  const normalizedNumber = listingConfig.whatsappNumber.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(listingConfig.whatsappMessage);

  if (normalizedNumber) {
    return `https://wa.me/${normalizedNumber}?text=${encodedMessage}`;
  }

  return `https://api.whatsapp.com/send?text=${encodedMessage}`;
}

function configureWhatsAppLinks() {
  const url = buildWhatsAppUrl();

  whatsappLinks.forEach((link) => {
    link.setAttribute("href", url);
  });
}

configureWhatsAppLinks();

const galleryLinks = Array.from(document.querySelectorAll("[data-gallery-image]"));
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxCounter = document.querySelector("[data-lightbox-counter]");
const lightboxClose = document.querySelector("[data-close-lightbox]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");

let activeIndex = 0;
let lastFocusedElement = null;

function renderLightbox(index) {
  const normalizedIndex = (index + galleryLinks.length) % galleryLinks.length;
  const activeLink = galleryLinks[normalizedIndex];

  activeIndex = normalizedIndex;
  lightboxImage.src = activeLink.dataset.galleryImage;
  lightboxImage.alt = activeLink.dataset.galleryAlt || activeLink.dataset.galleryTitle || "";
  lightboxTitle.textContent = activeLink.dataset.galleryTitle || "";
  lightboxCounter.textContent = `${normalizedIndex + 1} / ${galleryLinks.length}`;
}

function openLightbox(index) {
  lastFocusedElement = document.activeElement;
  renderLightbox(index);
  lightbox.hidden = false;
  document.body.classList.add("modal-open");
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("modal-open");

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

galleryLinks.forEach((link, index) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openLightbox(index);
  });
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

lightboxPrev.addEventListener("click", () => {
  renderLightbox(activeIndex - 1);
});

lightboxNext.addEventListener("click", () => {
  renderLightbox(activeIndex + 1);
});

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    renderLightbox(activeIndex - 1);
  }

  if (event.key === "ArrowRight") {
    renderLightbox(activeIndex + 1);
  }
});
