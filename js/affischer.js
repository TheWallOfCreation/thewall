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

  const img = document.getElementById("affisch");
  let index = 0;

  function showNext() {
    const current = affischer[index];

    console.log("Visar affisch index:", index, current);

    img.src = current.bild;

    // Felsäker visningstid, alltid 8000 ms om fel uppstår
    let tid = parseInt(current.visningstid) * 1000;
    if (isNaN(tid) || tid < 1000) tid = 8000;

    index++;

    // === När sista affischen är visad → projekt.html ===
    if (index >= affischer.length) {
      console.log("Alla affischer visade. Växlar till projekt.html om", tid, "ms");

      setTimeout(() => {
        window.location.href = "projekt.html";
      }, tid);

      return;
    }

    // === Annars visa nästa affisch ===
    setTimeout(showNext, tid);
  }

  showNext();
}

loadAffischer();
