/* =====================================================================
   Amar Fatima — Dietitian & Nutritionist
   No dependencies. Everything degrades gracefully without JS.
   ===================================================================== */
(function () {
  "use strict";

  /* ---- Where appointment requests go. Change the number in ONE place. ---- */
  var WHATSAPP_NUMBER = "923040401367"; // 0304-0401367 in international format

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ------------------------------------------------------------------
     Theme (light / dark) — respects the OS until the visitor chooses.
  ------------------------------------------------------------------ */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem("af-theme"); } catch (e) { /* private mode */ }

  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", stored || (prefersDark ? "dark" : "light"));

  var themeToggle = $("#themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("af-theme", next); } catch (e) { /* ignore */ }
    });
  }

  /* ------------------------------------------------------------------
     Header: shadow on scroll, mobile drawer, active section highlight
  ------------------------------------------------------------------ */
  var header = $("#header");
  var nav = $("#nav");
  var burger = $("#burger");
  var scrim = $("#navScrim");
  var toTop = $("#toTop");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    scrim.hidden = true;
    document.body.style.overflow = "";
  }

  if (burger) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      scrim.hidden = !open;
      document.body.style.overflow = open ? "hidden" : "";
    });
  }
  if (scrim) scrim.addEventListener("click", closeNav);
  $$(".nav__link").forEach(function (a) { a.addEventListener("click", closeNav); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });

  var onScroll = function () {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-stuck", y > 8);
    if (toTop) toTop.hidden = y < 600;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Active link — driven by which section owns the middle of the viewport. */
  var sections = $$("main section[id]");
  var links = {};
  $$(".nav__link").forEach(function (a) {
    var id = a.getAttribute("href").replace("#", "");
    links[id] = a;
  });

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = links[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          $$(".nav__link").forEach(function (a) { a.classList.remove("is-active"); });
          link.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------------------------
     Reveal on scroll
  ------------------------------------------------------------------ */
  var revealables = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Stagger siblings so grids cascade instead of popping in together.
        var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        el.style.transitionDelay = Math.min(siblings, 6) * 70 + "ms";
        el.classList.add("is-in");
        obs.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ------------------------------------------------------------------
     Clinic hours: highlight today + show an open / closed pill.
     Times below must match the table in index.html.
  ------------------------------------------------------------------ */
  // 0 = Sunday … 6 = Saturday. Each day is a list of [openMinutes, closeMinutes].
  var HOURS = {
    0: [],
    1: [[600, 960]],
    2: [[600, 960]],
    3: [[600, 960]],
    4: [[600, 960]],
    5: [[600, 750], [870, 960]],
    6: [[600, 840]]
  };

  var statusEl = $("#openStatus");
  if (statusEl) {
    var now = new Date();
    var day = now.getDay();
    var mins = now.getHours() * 60 + now.getMinutes();
    var todayRow = $('.hours__table tr[data-day="' + day + '"]');
    if (todayRow) todayRow.classList.add("is-today");

    var isOpen = (HOURS[day] || []).some(function (slot) {
      return mins >= slot[0] && mins < slot[1];
    });

    statusEl.textContent = isOpen ? "Open now" : "Closed now";
    statusEl.classList.add(isOpen ? "is-open" : "is-closed");
  }

  /* ------------------------------------------------------------------
     BMI calculator
  ------------------------------------------------------------------ */
  var bmiForm = $("#bmiForm");
  if (bmiForm) {
    var units = "metric";

    $$(".seg__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        units = btn.dataset.units;
        $$(".seg__btn").forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-selected", String(on));
        });
        $$("[data-unit-group]").forEach(function (group) {
          group.hidden = group.dataset.unitGroup !== units;
        });
      });
    });

    bmiForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var kg, m;
      if (units === "metric") {
        var cm = parseFloat($("#bmiHeightCm").value);
        kg = parseFloat($("#bmiWeightKg").value);
        m = cm / 100;
      } else {
        var ft = parseFloat($("#bmiFeet").value) || 0;
        var inch = parseFloat($("#bmiInches").value) || 0;
        var lb = parseFloat($("#bmiWeightLb").value);
        m = (ft * 12 + inch) * 0.0254;
        kg = lb * 0.45359237;
      }

      var result = $("#bmiResult");
      if (!isFinite(kg) || !isFinite(m) || kg <= 0 || m <= 0.5) {
        result.hidden = false;
        $("#bmiValue").textContent = "—";
        $("#bmiCategory").textContent = "Check your numbers";
        $("#bmiNote").textContent = "Please enter a valid height and weight.";
        $("#bmiPin").style.left = "0%";
        return;
      }

      var bmi = kg / (m * m);
      var category, note;

      if (bmi < 18.5) {
        category = "Underweight";
        note = "You're below the healthy range. A weight-gain plan focuses on nutrient-dense meals rather than empty calories — worth discussing in a consultation.";
      } else if (bmi < 25) {
        category = "Healthy range";
        note = "You're in the healthy range. Nutrition support here is usually about energy, gut health, labs, sports performance or maintaining this as your routine changes.";
      } else if (bmi < 30) {
        category = "Overweight";
        note = "A structured, sustainable plan at this stage often prevents blood pressure, sugar and lipid problems later. Small changes, big results.";
      } else {
        category = "Obese";
        note = "This range is linked to diabetes, hypertension and PCOS complications. A supervised weight-management plan is strongly recommended.";
      }

      // Pin position across a 15–40 BMI scale (the gauge's visual range).
      var pct = Math.max(0, Math.min(100, ((bmi - 15) / 25) * 100));

      result.hidden = false;
      $("#bmiValue").textContent = bmi.toFixed(1);
      $("#bmiCategory").textContent = category;
      $("#bmiNote").textContent = note;
      $("#bmiPin").style.left = pct + "%";
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  /* ------------------------------------------------------------------
     Appointment form → pre-written WhatsApp message
  ------------------------------------------------------------------ */
  var form = $("#appointmentForm");
  if (form) {
    var dateInput = $("#prefDate");
    if (dateInput) {
      var t = new Date();
      var iso = new Date(t.getTime() - t.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      dateInput.min = iso;
    }

    function setError(name, message) {
      var field = form.querySelector("#" + name);
      var slot = form.querySelector('[data-error-for="' + name + '"]');
      if (slot) slot.textContent = message || "";
      if (field) {
        if (message) field.setAttribute("aria-invalid", "true");
        else field.removeAttribute("aria-invalid");
      }
      return !message;
    }

    function validate() {
      var ok = true;
      var name = $("#fullName").value.trim();
      var phone = $("#phone").value.trim();
      var service = $("#service").value;
      var date = $("#prefDate").value;

      ok = setError("fullName", name.length < 3 ? "Please enter your full name." : "") && ok;

      var digits = phone.replace(/\D/g, "");
      ok = setError("phone", digits.length < 10 ? "Enter a valid mobile number, e.g. 0300-1234567." : "") && ok;

      ok = setError("service", service ? "" : "Please choose what you need help with.") && ok;
      ok = setError("prefDate", date ? "" : "Pick a preferred date.") && ok;

      return ok;
    }

    function buildMessage() {
      var mode = form.querySelector('input[name="mode"]:checked');
      var date = $("#prefDate").value;
      var pretty = date;
      if (date) {
        var d = new Date(date + "T00:00:00");
        if (!isNaN(d)) {
          pretty = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
        }
      }

      var lines = [
        "Assalam o Alaikum, I would like to book an appointment.",
        "",
        "Name: " + $("#fullName").value.trim(),
        "Mobile: " + $("#phone").value.trim()
      ];

      if ($("#age").value) lines.push("Age: " + $("#age").value);
      if ($("#gender").value) lines.push("Gender: " + $("#gender").value);
      if ($("#city").value.trim()) lines.push("City: " + $("#city").value.trim());

      lines.push("Service: " + $("#service").value);
      lines.push("Consultation: " + (mode ? mode.value : "In-clinic"));
      lines.push("Preferred date: " + pretty);
      if ($("#prefTime").value) lines.push("Preferred time: " + $("#prefTime").value);
      if ($("#notes").value.trim()) lines.push("", "Notes: " + $("#notes").value.trim());

      lines.push("", "(Sent from your website)");
      return lines.join("\n");
    }

    var status = $("#formStatus");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.classList.remove("is-error");

      if (!validate()) {
        status.textContent = "Please fix the highlighted fields.";
        status.classList.add("is-error");
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(buildMessage());
      window.open(url, "_blank", "noopener");
      status.textContent = "WhatsApp is opening — press send to confirm your request.";
    });

    // Clear a field's error as soon as the visitor starts fixing it.
    $$("input, select, textarea", form).forEach(function (el) {
      el.addEventListener("input", function () {
        if (el.getAttribute("aria-invalid") === "true") setError(el.id, "");
      });
    });

    var copyBtn = $("#copyDetails");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        if (!validate()) {
          status.textContent = "Please fix the highlighted fields.";
          status.classList.add("is-error");
          return;
        }
        var text = buildMessage();
        var done = function () {
          status.classList.remove("is-error");
          status.textContent = "Details copied — paste them into WhatsApp or SMS.";
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () {
            status.textContent = "Could not copy automatically. Please select and copy manually.";
            status.classList.add("is-error");
          });
        } else {
          var ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); done(); } catch (err) {
            status.textContent = "Could not copy automatically. Please select and copy manually.";
            status.classList.add("is-error");
          }
          document.body.removeChild(ta);
        }
      });
    }
  }

  /* ------------------------------------------------------------------
     Accordion: only one answer open at a time
  ------------------------------------------------------------------ */
  var items = $$(".ac");
  items.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      items.forEach(function (other) { if (other !== item) other.open = false; });
    });
  });

  /* ---- Footer year ---- */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
