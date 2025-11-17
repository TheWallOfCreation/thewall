// === Visa laddningsskärm ===
function showLoadingScreen(count, total) {
  const container = document.getElementById("affischContainer");
  container.innerHTML = `
    <div style="
      color:white;
      font-size: 2rem;
      text-align:center;
      font-family: sans-serif;
    ">
      Laddar affischer...<br>
      ${count} / ${total}
    </div>
  `;
}

// === Ladda affischer från n8n ===
async function loadAffischer() {
  try {
    const response = await fetch("https://conzpiro.duckdns.org/webhook/892e722e-c619-468a-8df0-233d7dc53963");
    const data = await response.json();

    console.log("Affischer laddade:", data);

    // Starta cachning
    await cacheAllMedia(data);
  } catch (err) {
    console.error("Kunde inte ladda affischer:", err);
  }
}

let cachedMedia = []; // alla förladdade filer

// === Cachning av ALL media innan start ===
async function cacheAllMedia(affischer) {
  const total = affischer.length;
  let done = 0;

  showLoadingScreen(0, total);

  for (let i = 0; i < total; i++) {
    const item = affischer[i];
    const url = item.url;           // <--- Viktigt! Nya n8n-fältet
    const isVideo = item.type === "video"; // <--- Viktigt! Typ från n8n

    if (isVideo) {
      // === Ladda video som blob ===
      try {
        const r = await fetch(url);
        const blob = await r.blob();
        const objectURL = URL.createObjectURL(blob);

        cachedMedia.push({
          type: "video",
          url: objectURL,
          visningstid: parseInt(item.visningstid)
        });

      } catch (err) {
        console.log("Videofel vid caching:", err);
        cachedMedia.push({
          type: "error",
          url: "",
          visningstid: parseInt(item.visningstid)
        });
      }

    } else {
      // === Ladda bild i RAM ===
      await new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = url;

        cachedMedia.push({
          type: "image",
          url: url,
          visningstid: parseInt(item.visningstid)
        });
      });
    }

    done++;
    showLoadingScreen(done, total);
  }

  console.log("Cachning klar:", cachedMedia);

  // Starta slideshow
  startSlideshow();
}

// === Slideshow från RAM ===
function startSlideshow() {
  const container = document.getElementById("affischContainer");
  let index = 0;

  function showNext() {
    const item = cachedMedia[index];
    container.innerHTML = "";

    if (!item) {
      console.error("Saknar item:", index);
      window.location.href = "projekt.html";
      return;
    }

    if (item.type === "video") {
      console.log("Spelar video:", item.url);
      const vid = document.createElement("video");

      vid.src = item.url;
      vid.autoplay = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.controls = false;
      vid.loop = false;
      vid.style.width = "100%";
      vid.style.height = "100%";
      vid.style.objectFit = "contain";

      vid.addEventListener("ended", nextStep);
      vid.addEventListener("error", nextStep);

      container.appendChild(vid);

    } else if (item.type === "image") {
      console.log("Visar bild:", item.url);
      const img = document.createElement("img");
      img.src = item.url;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";
      container.appendChild(img);

      const tid = (item.visningstid || 8) * 1000;
      setTimeout(nextStep, tid);

    } else {
      console.log("Error-item → hoppa");
      nextStep();
    }
  }

  function nextStep() {
    index++;

    if (index >= cachedMedia.length) {
      console.log("Alla affischer visade → projekt.html");
      window.location.href = "projekt.html";
      return;
    }

    showNext();
  }

  showNext();
}

loadAffischer();
