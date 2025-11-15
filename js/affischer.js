// === Hämta affischer från n8n ===
async function loadAffischer() {
  try {
    const response = await fetch("https://DIN-N8N-WEBHOOK-HÄR");
    const data = await response.json();
    startSlideshow(data);
  } catch (err) {
    console.error("Kunde inte ladda affischer:", err);
  }
}

// === Visa affischer i helskärm, en gång vardera, sedan vidare ===
function startSlideshow(affischer) {
  if (!affischer || affischer.length === 0) {
    console.error("Inga affischer att visa.");
    return;
  }

  const img = document.getElementById("affisch");
  let index = 0;

  function showNext() {
    const current = affischer[index];
    img.src = current.bild;

    const tid = current.visningstid
      ? current.visningstid * 1000
      : 8000; // fallback 8 sek

    index++;

    // === När ALLA affischer visats → gå till projekt.html ===
    if (index >= affischer.length) {
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

// Starta allt
loadAffischer();
