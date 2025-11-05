// assets/js/main.js
document.addEventListener("DOMContentLoaded", () => {
  // 🚨 Simple console warning
  console.error("Do not access this page.");
  console.log("Do not access this page.");

  // ---- Element refs ----
  const form = document.getElementById("loginForm");
  const btn = document.getElementById("loginBtn");
  const spinner = document.getElementById("btnSpinner");
  const btnLabel = btn?.querySelector(".btn-label");
  const togglePw = document.getElementById("togglePw");
  const pw = document.getElementById("password");
  const userId = document.getElementById("userId");
  const remember = document.getElementById("rememberMe");
  const contactBtn = document.getElementById("contactAdmin");
  const forgotPw = document.getElementById("forgotPw");
  const whatIsCarflow = document.getElementById("whatIsCarflow");
  const video = document.getElementById("bgVideo");
  const videoToggle = document.getElementById("videoToggle");

  // ---- Prefill username ----
  const savedId = localStorage.getItem("carflow_userId");
  if (savedId) {
    userId.value = savedId;
    remember.checked = true;
  }

  // ---- Toggle password visibility ----
  togglePw?.addEventListener("click", () => {
    const showing = pw.type === "text";
    pw.type = showing ? "password" : "text";
    togglePw.innerHTML = showing
      ? '<i class="bi bi-eye"></i>'
      : '<i class="bi bi-eye-slash"></i>';
    pw.focus();
  });

  // ---- Reusable modal ----
  const showModal = (title, body) => {
    const titleEl = document.getElementById("contactModalLabel");
    const bodyEl = document.getElementById("contactModalBody");
    if (!titleEl || !bodyEl) return;
    titleEl.innerHTML = title;
    bodyEl.innerHTML = body;
    const modal = new bootstrap.Modal(document.getElementById("contactModal"));
    modal.show();
  };

  // ---- Contact Admin (Access restriction) ----
  contactBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    showModal(
      '<i class="bi bi-lock-fill me-2 text-info"></i>Access Restricted',
      `Only authorized users have access.<br>
       If you’d like to register, please contact
       <a href="https://www.instagram.com/jaguar02_" target="_blank" class="link-info text-decoration-none">@jaguar02_</a>
       on Instagram.`
    );
  });

  // ---- Forgot Password (Reset help) ----
  forgotPw?.addEventListener("click", (e) => {
    e.preventDefault();
    showModal(
      '<i class="bi bi-key-fill me-2 text-info"></i>Reset Password',
      `If you’ve lost your password or need help accessing your account,<br>
       please contact
       <a href="https://www.instagram.com/jaguar02_" target="_blank" class="link-info text-decoration-none">@jaguar02_</a>
       on Instagram.`
    );
  });

  // ---- What is CARFLOW? ----
  whatIsCarflow?.addEventListener("click", (e) => {
    e.preventDefault();
    showModal(
      '<i class="bi bi-info-circle-fill me-2 text-info"></i>What is CARFLOW?',
      `CARFLOW is an intelligent vehicle data platform that collects and analyzes information from <strong>your vehicle</strong>.<br>
     It provides insights and personalized suggestions based on your driving behavior,<br>
     and supports both manual input and automatic data collection through APIs.<br><br>
     <em>Currently, CARFLOW is intended for personal and non-commercial use.</em>`
    );
  });

  // ---- Fake login (always fails) ----
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;

    if (remember.checked) localStorage.setItem("carflow_userId", userId.value);
    else localStorage.removeItem("carflow_userId");

    spinner.classList.remove("d-none");
    btn.setAttribute("disabled", "disabled");
    if (btnLabel) btnLabel.textContent = "Signing in...";

    setTimeout(() => {
      spinner.classList.add("d-none");
      btn.removeAttribute("disabled");
      if (btnLabel) btnLabel.textContent = "Sign In";
      pw.value = "";
      pw.focus();
      showToast("Login failed: Invalid username or password.", "danger");
    }, 800);
  });

  // ---- Background video autoplay assist ----
  video?.addEventListener("canplay", () => {
    if (video.paused) video.play().catch(() => { });
  });

  // ---- 🎬 Video Play/Pause Toggle (round liquid button) ----
  videoToggle?.addEventListener("click", () => {
    if (!video) return;
    if (video.paused) {
      video.play();
      videoToggle.innerHTML = '<i class="bi bi-pause-fill"></i>';
    } else {
      video.pause();
      videoToggle.innerHTML = '<i class="bi bi-play-fill"></i>';
    }
  });

  // ===== Anti-scrape / DevTools Guard =====

  // 1) 기본 방어: 우클릭/선택/드래그/클립보드 제한 (입력칸 예외)
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("selectstart", (e) => {
    if (!e.target.closest("input, textarea")) e.preventDefault();
  });
  document.addEventListener("dragstart", (e) => e.preventDefault());
  ["copy", "cut", "paste"].forEach((evt) => {
    document.addEventListener(evt, (e) => {
      if (!e.target.closest("input, textarea")) e.preventDefault();
    });
  });

  // 2) 단축키 차단: F12, Ctrl+Shift+I/J/C/U, Ctrl+S/P/U
  document.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    const ctrl = e.ctrlKey || e.metaKey;
    if (k === "f12") return e.preventDefault();
    if (ctrl && e.shiftKey && ["i", "j", "c", "u"].includes(k)) return e.preventDefault();
    if (ctrl && ["s", "p", "u"].includes(k)) return e.preventDefault();
  });

  // 3) DevTools 열림 감지 → 오버레이 + 배경 블러 + 자동 새로고침(3초)
  let devToolsOpen = false;
  const overlay = document.createElement("div");
  overlay.id = "devtoolsOverlay";
  overlay.innerHTML = `
    <div class="overlay-content">
      <i class="bi bi-shield-exclamation display-6 text-warning mb-2"></i>
      <p>Developer tools are not allowed on this page.</p>
    </div>`;
  document.body.appendChild(overlay);

  setInterval(() => {
    const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
    const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
    const suspected = widthDiff > 160 || heightDiff > 160;

    if (suspected && !devToolsOpen) {
      devToolsOpen = true;
      overlay.classList.add("active");
      document.body.classList.add("blurred");

      // ⏱ 3초 후 자동 새로고침
      setTimeout(() => {
        if (devToolsOpen) location.reload();
      }, 3000);
    } else if (!suspected && devToolsOpen) {
      devToolsOpen = false;
      overlay.classList.remove("active");
      document.body.classList.remove("blurred");
    }
  }, 1000);

  // ---- Toast helper ----
  function showToast(message, variant = "dark") {
    const toastEl = document.getElementById("loginToast");
    const messageEl = document.getElementById("toastMessage");
    if (!toastEl || !messageEl) return;
    toastEl.className = `toast align-items-center text-bg-${variant} border-0`;
    messageEl.textContent = message;
    const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2600 });
    toast.show();
  }
});