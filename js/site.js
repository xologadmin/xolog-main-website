const trackingData = {
  XO240915: {
    status: "In Transit",
    statusClass: "is-transit",
    route: "Beirut -> Hamburg",
    eta: "12 Sep 2026",
    milestones: [
      "Booking confirmed with export documents validated.",
      "Cargo received at Beirut consolidation hub.",
      "Container departed origin terminal.",
      "Final-mile delivery scheduled with destination agent."
    ]
  },
  XO240722: {
    status: "Customs Clearance",
    statusClass: "is-customs",
    route: "Shanghai -> Beirut",
    eta: "06 Sep 2026",
    milestones: [
      "Pre-alert shared with consignee.",
      "Shipment arrived at Beirut port.",
      "Customs documentation under final review.",
      "Delivery slot reserved for inland dispatch."
    ]
  },
  XO240611: {
    status: "Delivered",
    statusClass: "is-delivered",
    route: "Istanbul -> Riyadh",
    eta: "Delivered 30 Aug 2026",
    milestones: [
      "Linehaul departed Istanbul gateway.",
      "Border crossing completed successfully.",
      "Proof of delivery signed by consignee.",
      "Post-delivery report shared with account manager."
    ]
  }
};

const translations = {
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_services: "Services",
    nav_coverage: "Coverage",
    nav_cases: "Case Studies",
    nav_resources: "Resources",
    nav_tracking: "Tracking",
    nav_contact: "Contact",
    nav_quote: "Request a Rate",
    ui_cta_quote: "Request a Rate",
    ui_cta_tracking: "Track Shipment",
    ui_cta_contact: "Talk to XOLOG",
    ui_tracking_placeholder: "Enter a tracking number like XO240915",
    ui_chat_title: "XOLOG Assistant",
    ui_chat_intro: "Ask about tracking, rates, warehousing, or global coverage.",
    ui_chat_input: "Ask a question",
    ui_chat_send: "Send",
    ui_quote_success: "Thanks, your request is ready for the XOLOG team. Please use the generated email link below to send it directly.",
    ui_contact_success: "Thanks, your message is ready. Please send it using the generated email link below.",
    ui_tracking_missing: "Enter a valid tracking number to view the latest shipment milestones.",
    ui_tracking_not_found: "We could not find that shipment number. Try XO240915, XO240722, or XO240611.",
    ui_tracking_eta: "Estimated milestone",
    ui_tracking_route: "Route",
    ui_tracking_status: "Status",
    ui_coverage_intro: "Coverage available across the selected region."
  },
  ar: {
    nav_home: "الرئيسية",
    nav_about: "من نحن",
    nav_services: "الخدمات",
    nav_coverage: "الانتشار",
    nav_cases: "دراسات الحالة",
    nav_resources: "الموارد",
    nav_tracking: "التتبع",
    nav_contact: "اتصل بنا",
    nav_quote: "اطلب سعراً",
    ui_cta_quote: "اطلب سعراً",
    ui_cta_tracking: "تتبع الشحنة",
    ui_cta_contact: "تواصل مع XOLOG",
    ui_tracking_placeholder: "أدخل رقم تتبع مثل XO240915",
    ui_chat_title: "مساعد XOLOG",
    ui_chat_intro: "اسأل عن التتبع أو الأسعار أو التخزين أو التغطية العالمية.",
    ui_chat_input: "اكتب سؤالك",
    ui_chat_send: "إرسال",
    ui_quote_success: "شكراً لك، تم تجهيز طلبك لفريق XOLOG. استخدم رابط البريد الإلكتروني بالأسفل لإرساله مباشرة.",
    ui_contact_success: "شكراً لك، رسالتك جاهزة الآن. يرجى إرسالها عبر رابط البريد الإلكتروني بالأسفل.",
    ui_tracking_missing: "أدخل رقم تتبع صالحاً لعرض آخر تحديثات الشحنة.",
    ui_tracking_not_found: "لم نعثر على رقم الشحنة هذا. جرّب XO240915 أو XO240722 أو XO240611.",
    ui_tracking_eta: "الموعد المتوقع",
    ui_tracking_route: "المسار",
    ui_tracking_status: "الحالة",
    ui_coverage_intro: "التغطية متاحة في المنطقة المحددة."
  }
};

function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

function toggleNav() {
  const nav = qs("[data-site-nav]");
  const button = qs("[data-nav-toggle]");
  if (!nav || !button) {
    return;
  }

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });

  qsa("a", nav).forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

function handleHeaderState() {
  const header = qs(".site-header");
  if (!header || !header.classList.contains("is-overlay")) {
    return;
  }

  const update = () => {
    header.classList.toggle("is-solid", window.scrollY > 24);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setLanguage(language) {
  const dictionary = translations[language] || translations.en;
  document.documentElement.lang = language === "ar" ? "ar" : "en";
  document.body.dir = language === "ar" ? "rtl" : "ltr";

  qsa("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (!dictionary[key]) {
      return;
    }
    element.textContent = dictionary[key];
  });

  qsa("[data-i18n-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    if (!dictionary[key]) {
      return;
    }
    element.setAttribute("placeholder", dictionary[key]);
  });

  qsa("[data-lang-button]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.langButton === language));
  });

  localStorage.setItem("xolog-language", language);
}

function initLanguageToggle() {
  const saved = localStorage.getItem("xolog-language") || "en";
  setLanguage(saved);

  qsa("[data-lang-button]").forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.langButton);
    });
  });
}

function initCoverageTabs() {
  const buttons = qsa("[data-coverage-target]");
  if (!buttons.length) {
    return;
  }

  const showPanel = (target) => {
    qsa("[data-coverage-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.coveragePanel !== target;
    });
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.coverageTarget === target));
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => showPanel(button.dataset.coverageTarget));
  });

  showPanel(buttons[0].dataset.coverageTarget);
}

function initFaq() {
  qsa("[data-faq-button]").forEach((button) => {
    button.addEventListener("click", () => {
      const answer = qs(`#${button.getAttribute("aria-controls")}`);
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      if (answer) {
        answer.hidden = expanded;
      }
    });
  });
}

function validateForm(form) {
  let isValid = true;
  let firstInvalidField = null;

  qsa("[data-error-for]", form).forEach((item) => {
    item.textContent = "";
  });

  qsa("[data-required]", form).forEach((field) => {
    const value = field.type === "checkbox" ? field.checked : field.value.trim();
    const errorTarget = qs(`[data-error-for="${field.name}"]`, form);
    field.setAttribute("aria-invalid", "false");

    if (!value) {
      isValid = false;
      firstInvalidField ||= field;
      field.setAttribute("aria-invalid", "true");
      if (errorTarget) {
        errorTarget.textContent = "This field is required.";
      }
      return;
    }

    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      isValid = false;
      firstInvalidField ||= field;
      field.setAttribute("aria-invalid", "true");
      if (errorTarget) {
        errorTarget.textContent = "Enter a valid email address.";
      }
    }
  });

  firstInvalidField?.focus();
  return isValid;
}

function buildMailto(subject, body) {
  const params = new URLSearchParams({
    subject,
    body
  });
  return `mailto:info@xolog.com?${params.toString()}`;
}

function initForms() {
  qsa("[data-form-type]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateForm(form)) {
        return;
      }

      const formType = form.dataset.formType;
      const message = qs("[data-form-message]", form.parentElement || document);
      const mailLink = qs("[data-mailto-link]", form.parentElement || document);
      const entries = new FormData(form);
      const bodyLines = [];

      entries.forEach((value, key) => {
        bodyLines.push(`${key}: ${value}`);
      });

      const subject = formType === "quote"
        ? `XOLOG Rate Request - ${entries.get("company") || entries.get("name") || "New Enquiry"}`
        : `XOLOG Contact Enquiry - ${entries.get("subject") || entries.get("name") || "Website Lead"}`;

      if (message) {
        const locale = document.documentElement.lang === "ar" ? "ar" : "en";
        message.textContent = formType === "quote"
          ? translations[locale].ui_quote_success
          : translations[locale].ui_contact_success;
        message.classList.add("is-visible");
      }

      if (mailLink) {
        mailLink.href = buildMailto(subject, bodyLines.join("\n"));
        mailLink.hidden = false;
      }

      form.reset();
      qsa("[aria-invalid]", form).forEach((field) => field.setAttribute("aria-invalid", "false"));
    });
  });
}

function initTracking() {
  qsa("[data-tracking-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = qs("[data-tracking-input]", form);
      const result = qs("[data-tracking-result]");
      const status = qs("[data-tracking-status]");
      const route = qs("[data-tracking-route]");
      const eta = qs("[data-tracking-eta]");
      const timeline = qs("[data-tracking-timeline]");
      const locale = document.documentElement.lang === "ar" ? "ar" : "en";

      if (!input || !result || !status || !route || !eta || !timeline) {
        return;
      }

      const key = input.value.trim().toUpperCase();

      if (!key) {
        result.classList.add("is-visible");
        status.className = "status-pill";
        status.textContent = translations[locale].ui_tracking_missing;
        route.textContent = "";
        eta.textContent = "";
        timeline.innerHTML = "";
        return;
      }

      const shipment = trackingData[key];
      if (!shipment) {
        result.classList.add("is-visible");
        status.className = "status-pill";
        status.textContent = translations[locale].ui_tracking_not_found;
        route.textContent = "";
        eta.textContent = "";
        timeline.innerHTML = "";
        return;
      }

      status.className = `status-pill ${shipment.statusClass}`;
      status.textContent = `${translations[locale].ui_tracking_status}: ${shipment.status}`;
      route.textContent = `${translations[locale].ui_tracking_route}: ${shipment.route}`;
      eta.textContent = `${translations[locale].ui_tracking_eta}: ${shipment.eta}`;
      timeline.innerHTML = shipment.milestones.map((item) => `<li>${item}</li>`).join("");
      result.classList.add("is-visible");
    });
  });
}

function chatbotReply(message) {
  const text = message.toLowerCase();

  if (text.includes("track") || text.includes("shipment") || text.includes("cargo")) {
    return "Use the shipment tracking page and try demo references XO240915, XO240722, or XO240611 for live status examples.";
  }

  if (text.includes("rate") || text.includes("quote") || text.includes("price")) {
    return "The fastest path is the Request a Rate page. Share origin, destination, mode, cargo type, and required timeline for a tailored quotation.";
  }

  if (text.includes("warehouse") || text.includes("storage")) {
    return "XOLOG supports bonded and free storage, cross-docking, inventory visibility, and distribution planning. The Warehousing page covers the full offer.";
  }

  if (text.includes("coverage") || text.includes("country") || text.includes("network")) {
    return "XOLOG covers MENA, Europe, Asia, Africa, and the Americas through partner agencies and destination coordination teams.";
  }

  return "I can help with shipment tracking, quoting, warehousing, service selection, or global coverage. Ask one of those and I will point you to the right page.";
}

function appendChatBubble(text, isUser = false) {
  const log = qs("[data-chat-log]");
  if (!log) {
    return;
  }

  const bubble = document.createElement("div");
  bubble.className = `chat-bubble${isUser ? " is-user" : ""}`;
  bubble.textContent = text;
  log.appendChild(bubble);
  log.scrollTop = log.scrollHeight;
}

function initChatbot() {
  const toggle = qs("[data-chat-toggle]");
  const panel = qs("[data-chat-panel]");
  const form = qs("[data-chat-form]");
  const input = qs("[data-chat-input]");

  if (!toggle || !panel || !form || !input) {
    return;
  }

  toggle.addEventListener("click", () => {
    const hidden = panel.hasAttribute("hidden");
    if (hidden) {
      panel.removeAttribute("hidden");
    } else {
      panel.setAttribute("hidden", "");
    }
  });

  qsa("[data-chat-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      const prompt = button.dataset.chatPrompt;
      appendChatBubble(prompt, true);
      appendChatBubble(chatbotReply(prompt));
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) {
      return;
    }
    appendChatBubble(value, true);
    appendChatBubble(chatbotReply(value));
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  toggleNav();
  handleHeaderState();
  initLanguageToggle();
  initCoverageTabs();
  initFaq();
  initForms();
  initTracking();
  initChatbot();
});
