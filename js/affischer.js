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
    const url = current.bild || "";

    console.log("Visar affisch index:", index, current);
    console.log("URL:", url);

    container.innerHTML = "";

    const isVideo = url.toLowerCase().includes(".mp4");

    let tid = parseInt(current.visningstid) * 1000;
    if (isNaN(tid) || tid < 1000) tid = 8000;

    if (isVideo) {
      console.log("Detta är VIDEO → hämtar som blob");

      // Fallback om fetch tar för lång tid
      const hardTimeout = setTimeout(() => {
        console.log("Fetch timeout → nästa");
        nextStep();
      }, tid + 4000);

      // HÄMTA VIDEON SOM BLOB
      fetch(url)
        .then(r => r.blob())
        .then(blob => {
          clearTimeout(hardTimeout);

          const objectURL = URL.createObjectURL(blob);
          console.log("Video blob klar:", objectURL);

          const vid = document.createElement("video");
          vid.src = objectURL;
          vid.autoplay = true;
          vid.muted = true;
          vid.playsInline = true;
          vid.controls = false;
          vid.loop = false;
          vid.style.width = "100%";
          vid.style.height = "100%";
          vid.style.objectFit = "contain";

          // När videon spelar → allt OK
          vid.addEventListener("playing", () => {
            console.log("Video playing");
          });

          // När videon är klar → nästa
          vid.addEventListener("ended", () => {
            console.log("Video klar → nästa");
            URL.revokeObjectURL(objectURL);
            nextStep();
          });

          // Om något går fel → fallback
          vid.addEventListener("error", () => {
            console.log("Videofel → fallback");
            URL.revokeObjectURL(objectURL);
            setTimeout(nextStep, 500);
          });

          container.appendChild(vid);
        })
        .catch(err => {
          console.log("Blob fetch error:", err);
          clearTimeout(hardTimeout);
          setTimeout(nextStep, 500);
        });

    } else {
      console.log("Detta är BILD");

      const img = document.createElement("img");
      img.src = url;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";
      container.appendChild(img);

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
