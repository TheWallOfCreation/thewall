// === Ladda affischer från n8n ===
async function loadAffischer() {
  try {
    const response = await fetch("https://conzpiro.duckdns.org/webhook/892e722e-c619-468a-8df0-233d7dc53963");
    const data = await response.json();
    console.log("Affischer laddade:", data);
    startSlideshow(data);
  } catch (err) {
    console.error("Kunde inte ladda affischer:", err);
  }
}

// === Visa alla affischer en gång → sedan projekt.html ===
function startSlideshow(affischer) {
  if (!affischer || affischer.length === 0) {
    console.error("Inga affischer att visa.");
    return;
  }

  const container = document.getElementById("affischContainer");
  let index = 0;

  function showNext() {
    const current = affischer[index];
    console.log("Visar affisch index:", index, current);

    container.innerHTML = "";

    // n8n skickar STRÄNG:
    const url = current.bild || "";
    const isVideo = url.toLowerCase().includes(".mp4");

    console.log("URL:", url);
    console.log("isVideo:", isVideo);

    let tid = parseInt(current.visningstid) * 1000;
    if (isNaN(tid) || tid < 1000) tid = 8000;

    let element;

    if (isVideo) {
      console.log("Detta är en VIDEO");

      element = document.createElement("video");
      element.src = url;
      element.autoplay = true;
      element.muted = true;
      element.playsInline = true;
      element.controls = false;
      element.loop = false;
      element.preload = "auto";
      element.style.width = "100%";
      element.style.height = "100%";
      element.style.objectFit = "contain";

      // === Fallback om videon aldrig startar ===
      const fallbackTimeout = setTimeout(() => {
        console.log("Video fastnade → fallback timeout");
        nextStep();
      }, tid + 3000);

      // När videon startar → rensa fallback
      element.addEventListener("playing", () => {
        console.log("Video playing → okej");
        clearTimeout(fallbackTimeout);
      });

      // När videon är slut → nästa
      element.addEventListener("ended", () => {
        console.log("Video klar → nästa");
        clearTimeout(fallbackTimeout);
        nextStep();
      });

      // Om videon får error → fallback
      element.addEventListener("error", () => {
        console.log("Video error → nästa");
        clearTimeout(fallbackTimeout);
        setTimeout(nextStep, 500);
      });

      container.appendChild(element);

    } else {
      console.log("Detta är en BILD");

      element = document.createElement("img");
      element.src = url;
      element.style.width = "100%";
      element.style.height = "100%";
      element.style.objectFit = "contain";
      container.appendChild(element);

      setTimeout(nextStep, tid);
    }
  }

  function nextStep() {
    index++;
    if (index >= affischer.length) {
      console.log("Alla affischer visade → projekt.html");
      window.location.href = "projekt.html";
      return;
    }
    showNext();
  }

  showNext();
}

loadAffischer();
