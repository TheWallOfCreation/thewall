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

    const url = current.bild;
    const isVideo = url.toLowerCase().includes(".mp4");

    // DEFAULT – visningstid för bilder
    let tid = parseInt(current.visningstid) * 1000;
    if (isNaN(tid) || tid < 1000) tid = 8000;

    let element;

    if (isVideo) {
      console.log("Detta är en video:", url);

      element = document.createElement("video");
      element.src = url;
      element.autoplay = true;
      element.muted = true;
      element.playsInline = true;
      element.controls = false;
      element.loop = false;               // spela EN gång
      element.style.width = "100%";
      element.style.height = "100%";
      element.style.objectFit = "contain";

      // === När videon är klar → nästa affisch ===
      element.addEventListener("ended", () => {
        console.log("Video färdig → nästa");
        nextStep();
      });

      // === Om videon inte kan spelas → fallback till visningstid ===
      element.addEventListener("error", () => {
        console.log("Videofel → fallback-tid");
        setTimeout(nextStep, tid);
      });

      container.appendChild(element);

    } else {
      console.log("Detta är en bild:", url);

      element = document.createElement("img");
      element.src = url;
      element.style.width = "100%";
      element.style.height = "100%";
      element.style.objectFit = "contain";

      container.appendChild(element);

      // Endast bilder använder visningstid direkt
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
