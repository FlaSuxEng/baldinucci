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

// Add more objects to `items` to make each room scroll through multiple photos fullscreen.
const galleryGroups = {
  "camera-1": {
    title: "Camera 1",
    items: [
      {
        src: "assets/images/appartamento-camera.svg",
        alt: "Camera 1 dell'appartamento",
      },
    ],
  },
  "camera-2": {
    title: "Camera 2",
    items: [
      {
        src: "assets/images/appartamento-camera-2.svg",
        alt: "Camera 2 dell'appartamento",
      },
    ],
  },
  "camera-3": {
    title: "Camera 3",
    items: [
      {
        src: "assets/images/appartamento-camera-3.svg",
        alt: "Camera 3 dell'appartamento",
      },
    ],
  },
  cucina: {
    title: "Cucina",
    items: [
      {
        src: "assets/images/appartamento-cucina.svg",
        alt: "Cucina dell'appartamento",
      },
    ],
  },
  bagno: {
    title: "Bagno",
    items: [
      {
        src: "assets/images/appartamento-bagno.svg",
        alt: "Bagno dell'appartamento",
      },
    ],
  },
};

const galleryTriggers = Array.from(document.querySelectorAll("[data-gallery-group]"));
const lightbox = document.querySelector("[data-lightbox]");
const lightboxStage = document.querySelector("[data-lightbox-stage]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxHint = document.querySelector("[data-lightbox-hint]");
const lightboxCounter = document.querySelector("[data-lightbox-counter]");
const lightboxClose = document.querySelector("[data-close-lightbox]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");

let activeGroupKey = "";
let activeImageIndex = 0;
let lastFocusedElement = null;
let touchStartX = 0;

function getActiveGroup() {
  return galleryGroups[activeGroupKey];
}

function updateLightboxNavigation(totalItems) {
  const hasMultipleItems = totalItems > 1;

  lightboxPrev.hidden = !hasMultipleItems;
  lightboxNext.hidden = !hasMultipleItems;
  lightboxHint.textContent = hasMultipleItems
    ? "Scorri lateralmente o usa le frecce per vedere le altre foto di questa stanza."
    : "";
}

function renderLightbox(index) {
  const activeGroup = getActiveGroup();
  const totalItems = activeGroup.items.length;
  const normalizedIndex = (index + totalItems) % totalItems;
  const activeItem = activeGroup.items[normalizedIndex];

  activeImageIndex = normalizedIndex;
  lightboxImage.src = activeItem.src;
  lightboxImage.alt = activeItem.alt;
  lightboxTitle.textContent = activeGroup.title;
  lightboxCounter.textContent = `${normalizedIndex + 1} / ${totalItems}`;
  updateLightboxNavigation(totalItems);
}

function openLightbox(groupKey, startIndex = 0) {
  lastFocusedElement = document.activeElement;
  activeGroupKey = groupKey;
  renderLightbox(startIndex);
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

galleryTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    const groupKey = trigger.dataset.galleryGroup;

    event.preventDefault();
    openLightbox(groupKey);
  });
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

lightboxPrev.addEventListener("click", () => {
  renderLightbox(activeImageIndex - 1);
});

lightboxNext.addEventListener("click", () => {
  renderLightbox(activeImageIndex + 1);
});

lightboxStage.addEventListener(
  "touchstart",
  (event) => {
    if (lightbox.hidden) {
      return;
    }

    touchStartX = event.changedTouches[0].clientX;
  },
  { passive: true },
);

lightboxStage.addEventListener(
  "touchend",
  (event) => {
    const activeGroup = getActiveGroup();

    if (lightbox.hidden || activeGroup.items.length < 2) {
      return;
    }

    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (Math.abs(deltaX) < 40) {
      return;
    }

    if (deltaX < 0) {
      renderLightbox(activeImageIndex + 1);
      return;
    }

    renderLightbox(activeImageIndex - 1);
  },
  { passive: true },
);

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    renderLightbox(activeImageIndex - 1);
  }

  if (event.key === "ArrowRight") {
    renderLightbox(activeImageIndex + 1);
  }
});
