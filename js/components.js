(function () {
  "use strict";

  const navigation = [
    { label: "Home", href: "/" },
    {
      label: "About",
      href: "/company.html",
      match: ["/company"],
      children: [
        { label: "About Us", href: "/company/about-us/" },
        { label: "History", href: "/company/history/" },
        { label: "Company Timeline", href: "/company/company-timeline/" },
        { label: "Facts and Figures", href: "/company/fact-and-figures/" },
        { label: "Our Customers", href: "/company/our-customers/" },
        { label: "Our People", href: "/company/our-people/" }
      ]
    },
    {
      label: "Services",
      href: "/services.html",
      match: ["/services"],
      children: [
        { label: "Sea Freight", href: "/services/logistics/sea-freight/" },
        { label: "Air Freight", href: "/services/logistics/air-freight/" },
        { label: "Overland Network", href: "/services/logistics/overland-network/" },
        { label: "Project Transport", href: "/services/logistics/project-transport/" },
        { label: "Value Added Services", href: "/services/value-added-services/" },
        { label: "Warehousing", href: "/services/warehousing/" }
      ]
    },
    { label: "Global Coverage", href: "/global-coverage.html", match: ["/global-coverage"] },
    { label: "Resources", href: "/resources.html" },
    { label: "Tracking", href: "/tracking.html" },
    { label: "Contact", href: "/contact.html", match: ["/contact"] },
    { label: "Request a Rate", href: "/request-a-rate.html", match: ["/request-a-rate"], cta: true }
  ];

  function normalizePath(path) {
    const normalized = path.replace(/\/index\.html$/, "/").replace(/\/+$/, "");
    return normalized || "/";
  }

  function isCurrent(item) {
    const path = normalizePath(window.location.pathname);
    const href = normalizePath(item.href);
    return path === href || (item.match || []).some((prefix) => path.startsWith(prefix));
  }

  function linkMarkup(item) {
    const current = isCurrent(item) ? ' aria-current="page"' : "";
    const cta = item.cta ? " xolog-nav-cta" : "";
    return `<a class="xolog-nav-link${cta}" href="${item.href}"${current}>${item.label}</a>`;
  }

  function navigationMarkup() {
    return navigation.map((item) => {
      const children = item.children
        ? `<ul class="xolog-submenu" aria-label="${item.label}">${item.children.map((child) => `<li>${linkMarkup(child)}</li>`).join("")}</ul>`
        : "";
      return `<li class="xolog-nav-item">${linkMarkup(item)}${children}</li>`;
    }).join("");
  }

  function headerMarkup() {
    return `
      <header class="xolog-site-header">
        <div class="xolog-nav-shell">
          <a class="xolog-logo" href="/" aria-label="XOLOG home">
            <img src="/images/logo.png" alt="XOLOG">
          </a>
          <button class="xolog-nav-toggle" type="button" aria-expanded="false" aria-controls="xolog-main-navigation">Menu</button>
          <nav class="xolog-main-nav" id="xolog-main-navigation" aria-label="Main navigation">
            <ul class="xolog-nav-list">${navigationMarkup()}</ul>
          </nav>
        </div>
      </header>`;
  }

  function footerMarkup() {
    return `
      <footer class="xolog-site-footer">
        <div class="xolog-footer-shell">
          <div class="xolog-footer-grid">
            <section class="xolog-footer-brand" aria-label="XOLOG">
              <img src="/images/logo.png" alt="XOLOG">
              <p>Reliable freight forwarding, logistics and global shipping from Lebanon to the world.</p>
            </section>
            <section>
              <h2>Company</h2>
              <ul>
                <li><a href="/company.html">About XOLOG</a></li>
                <li><a href="/global-coverage.html">Global coverage</a></li>
                <li><a href="/resources.html">Resources</a></li>
              </ul>
            </section>
            <section>
              <h2>Services</h2>
              <ul>
                <li><a href="/services/logistics/air-freight/">Air freight</a></li>
                <li><a href="/services/logistics/sea-freight/">Sea freight</a></li>
                <li><a href="/services/warehousing/">Warehousing</a></li>
              </ul>
            </section>
            <section>
              <h2>Contact</h2>
              <address>West End 33 Building, 8th Floor<br>Pasteur Street, Beirut, Lebanon</address>
              <p><a href="tel:+9611574333">+961 1 574333</a><br><a href="mailto:info@xolog.com">info@xolog.com</a></p>
            </section>
          </div>
          <div class="xolog-footer-bottom">
            <small>&copy; ${new Date().getFullYear()} XOLOG SAL. All rights reserved.</small>
            <span><a href="https://www.facebook.com/xologsal" rel="noopener noreferrer">Facebook</a> &middot; <a href="https://www.instagram.com/xologlebanon" rel="noopener noreferrer">Instagram</a></span>
          </div>
        </div>
      </footer>`;
  }

  function mountComponents() {
    document.querySelectorAll("[data-xolog-header]").forEach((target) => {
      target.outerHTML = headerMarkup();
    });
    document.querySelectorAll("[data-xolog-footer]").forEach((target) => {
      target.outerHTML = footerMarkup();
    });

    const toggle = document.querySelector(".xolog-nav-toggle");
    const nav = document.querySelector(".xolog-main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }
  }

  mountComponents();
}());
