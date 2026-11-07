(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);

  const experience = $("#experience");
  const introScene = $("#introScene");
  const messageScene = $("#messageScene");
  const finalScene = $("#finalScene");

  const starsContainer = $("#stars");
  const sparklesContainer = $("#sparkles");
  const heartsLayer = $("#heartsLayer");

  const startButton = $("#startButton");
  const continueButton = $("#continueButton");

  const musicControl = $("#musicControl");
  const musicIcon = $("#musicIcon");
  const audio = $("#romanticAudio");

  const moon = $("#moon");

  let experienceStarted = false;
  let musicOn = false;
  let typewriterTimers = [];
  let heartInterval = null;

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randomInt(min, max) {
    return Math.floor(random(min, max + 1));
  }

  function createStars(count = 150) {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const star = document.createElement("span");
      star.className = `star${Math.random() > 0.92 ? " star-large" : ""}`;
      star.style.left = `${random(1, 99)}%`;
      star.style.top = `${random(1, 99)}%`;
      star.style.setProperty("--duration", `${random(2.2, 6.5)}s`);
      star.style.setProperty("--delay", `${random(-6, 0)}s`);
      fragment.appendChild(star);
    }

    starsContainer.appendChild(fragment);
  }

  function createSparkles(count = 22) {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement("span");
      sparkle.className = "sparkle";
      sparkle.style.left = `${random(5, 95)}%`;
      sparkle.style.top = `${random(8, 92)}%`;
      sparkle.style.setProperty("--duration", `${random(3.5, 7)}s`);
      sparkle.style.setProperty("--delay", `${random(-7, 0)}s`);
      fragment.appendChild(sparkle);
    }

    sparklesContainer.appendChild(fragment);
  }

  function createFloatingHeart() {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = Math.random() > 0.35 ? "♡" : "♥";
    heart.style.left = `${random(3, 97)}%`;
    heart.style.setProperty("--size", `${random(12, 25)}px`);
    heart.style.setProperty("--duration", `${random(8, 15)}s`);
    heart.style.setProperty("--delay", `${random(0, 1)}s`);
    heart.style.setProperty("--drift", `${random(-90, 90)}px`);
    heartsLayer.appendChild(heart);

    window.setTimeout(() => heart.remove(), 16000);
  }

  function createHearts(count = 12) {
    for (let i = 0; i < count; i++) {
      window.setTimeout(createFloatingHeart, i * 550);
    }

    if (!heartInterval) {
      heartInterval = window.setInterval(createFloatingHeart, 1100);
    }
  }

  function createHeartExplosion() {
    const symbols = ["❤️", "♡", "♥", "✦"];

    for (let i = 0; i < 34; i++) {
      const heart = document.createElement("span");
      heart.className = "heart-burst";
      heart.textContent = symbols[randomInt(0, symbols.length - 1)];

      const angle = random(0, Math.PI * 2);
      const distance = random(100, 340);

      heart.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
      heart.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
      heart.style.setProperty("--r", `${random(-180, 180)}deg`);

      experience.appendChild(heart);

      window.setTimeout(() => heart.remove(), 1500);
    }
  }

  function typeWriter(element, text, speed = 48) {
    return new Promise(resolve => {
      let index = 0;
      element.textContent = "";

      const timer = window.setInterval(() => {
        element.textContent += text[index];
        index++;

        if (index >= text.length) {
          clearInterval(timer);
          resolve();
        }
      }, speed);

      typewriterTimers.push(timer);
    });
  }

  function clearTypewriters() {
    typewriterTimers.forEach(clearInterval);
    typewriterTimers = [];
  }

  function switchScene(from, to) {
    from.classList.remove("active");

    window.setTimeout(() => {
      to.classList.add("active");
    }, 250);
  }

  async function startExperience() {
    if (experienceStarted) return;
    experienceStarted = true;

    createHeartExplosion();
    startMusic();

    await wait(350);
    switchScene(introScene, messageScene);

    await wait(850);
    await typeWriter($("#smallIntro"), "دي آخر حاجة حبيت أقولهالك قبل ما تنامي...", 42);

    await wait(300);
    await typeWriter($("#messageLineOne"),
      "نامي وإنتِ عارفة إن في حد بيتمنى لكِ ليلة هادية، وقلبه دايمًا بيحب يشوفك مبسوطة ❤️",
      28
    );

    await wait(250);
    await typeWriter($("#messageLineTwo"),
      "تصبحي على خير يا أجمل حاجة حصلتلي...",
      45
    );

    await wait(250);
    await typeWriter($("#messageLineThree"),
      "أحلام سعيدة يا آية ❤️🌙",
      45
    );

    await wait(300);
    $("#loveHeartWrap").classList.add("show");

    await wait(500);
    continueButton.classList.add("show");

    createHearts(18);
  }

  async function showFinalScene() {
    createHeartExplosion();

    await wait(250);
    switchScene(messageScene, finalScene);

    await wait(500);
    createHearts(25);
  }

  async function startMusic() {
    try {
      audio.volume = 0.38;
      await audio.play();
      musicOn = true;
      musicIcon.textContent = "🔊";
      musicControl.setAttribute("aria-label", "إيقاف الموسيقى");
    } catch (error) {
      // إذا لم يوجد الملف الصوتي أو منع المتصفح التشغيل، يستمر الموقع طبيعيًا.
      musicOn = false;
      musicIcon.textContent = "🔇";
    }
  }

  async function toggleMusic() {
    if (!audio.getAttribute("src") && !audio.querySelector("source")) return;

    try {
      if (musicOn) {
        audio.pause();
        musicOn = false;
        musicIcon.textContent = "🔇";
        musicControl.setAttribute("aria-label", "تشغيل الموسيقى");
      } else {
        await audio.play();
        musicOn = true;
        musicIcon.textContent = "🔊";
        musicControl.setAttribute("aria-label", "إيقاف الموسيقى");
      }
    } catch (error) {
      musicOn = false;
      musicIcon.textContent = "🔇";
    }
  }

  function handleParallax(event) {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;

    moon.style.transform =
      `translate3d(${x * 12}px, ${y * 12}px, 0)`;
  }

  function resetParallax() {
    moon.style.transform = "translate3d(0, 0, 0)";
  }

  function bindEvents() {
    startButton.addEventListener("click", startExperience);
    continueButton.addEventListener("click", showFinalScene);
    musicControl.addEventListener("click", toggleMusic);

    window.addEventListener("mousemove", handleParallax, { passive: true });
    window.addEventListener("mouseleave", resetParallax, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && musicOn) {
        audio.pause();
      } else if (!document.hidden && musicOn) {
        audio.play().catch(() => {});
      }
    });
  }

  function init() {
    createStars();
    createSparkles();
    createHearts(10);
    bindEvents();
  }

  clearTypewriters();
  init();
})();
