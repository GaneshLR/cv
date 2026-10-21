/* Ganesh Rathod — portfolio interactions (no dependencies) */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.querySelector("[data-theme-toggle]");

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return prefersDark.matches ? "dark" : "light";
  }

  function labelThemeButton() {
    if (!themeBtn) return;
    var next = currentTheme() === "dark" ? "light" : "dark";
    themeBtn.setAttribute("aria-label", "Switch to " + next + " theme");
  }

  if (themeBtn) {
    labelThemeButton();
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      labelThemeButton();
    });
    prefersDark.addEventListener("change", labelThemeButton);
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector("[data-menu-toggle]");
  var nav = document.getElementById("site-nav");

  function setMenu(open) {
    if (!menuBtn || !nav) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    nav.setAttribute("data-open", String(open));
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuBtn.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (
        menuBtn.getAttribute("aria-expanded") === "true" &&
        !nav.contains(e.target) &&
        !menuBtn.contains(e.target)
      ) {
        setMenu(false);
      }
    });

    // Close the panel if the window grows back to desktop width
    window.matchMedia("(min-width: 64.0625rem)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Header border once the page scrolls ---------- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.setAttribute("data-scrolled", String(window.scrollY > 8));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var hasIO = "IntersectionObserver" in window;

  /* ---------- Highlight the nav link for the section in view ---------- */
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  if (hasIO && navLinks.length) {
    var linkFor = {};
    navLinks.forEach(function (a) {
      linkFor[a.getAttribute("href").slice(1)] = a;
    });

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (a) {
            a.removeAttribute("aria-current");
          });
          var link = linkFor[entry.target.id];
          if (link) link.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    document.querySelectorAll("main section[id]").forEach(function (s) {
      spy.observe(s);
    });
  }

  /* ---------- Gentle reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (!hasIO || reduceMotion.matches) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var revealer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    revealEls.forEach(function (el) {
      revealer.observe(el);
    });
    // Safety net: never leave content hidden (e.g. jumping straight to an anchor)
    window.addEventListener("load", function () {
      setTimeout(function () {
        revealEls.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight) el.classList.add("is-visible");
        });
      }, 300);
    });
  }

  /* ---------- Copy email ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(text).then(function () {
        btn.setAttribute("data-copied", "true");
        btn.setAttribute("aria-label", "Email address copied");
        setTimeout(function () {
          btn.removeAttribute("data-copied");
          btn.setAttribute("aria-label", "Copy email address");
        }, 2000);
      });
    });
  });

  /* ---------- Contact form (Formspree, without leaving the page) ---------- */
  var form = document.querySelector("[data-contact-form]");
  if (form && window.fetch && window.FormData) {
    var status = form.querySelector("[data-form-status]");
    var submit = form.querySelector("[data-submit]");
    var label = submit && submit.querySelector(".btn-label");

    var setStatus = function (msg, state) {
      status.textContent = msg;
      if (state) status.setAttribute("data-state", state);
      else status.removeAttribute("data-state");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submit.disabled = true;
      submit.setAttribute("aria-busy", "true");
      if (label) label.textContent = "Sending…";
      setStatus("");

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            setStatus("Thanks — your message is on its way. I'll reply soon.", "success");
          } else {
            return res.json().then(function (data) {
              var msg =
                data && data.errors && data.errors.length
                  ? data.errors.map(function (er) { return er.message; }).join(", ")
                  : "Something went wrong.";
              setStatus(msg + " You can also email me directly.", "error");
            });
          }
        })
        .catch(function () {
          setStatus("Couldn't send right now. Please email rgrathod2012@gmail.com instead.", "error");
        })
        .finally(function () {
          submit.disabled = false;
          submit.removeAttribute("aria-busy");
          if (label) label.textContent = "Send message";
        });
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
