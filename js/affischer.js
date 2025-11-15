// === Hämta affischer från n8n ===
async function loadAffischer() {
  try {
    const response = await fetch("https://conzpiro.duckdns.org/webhook/892e722e-c619-468a-8df0-233d7dc53963");
    const data = await response.json();
    startSlideshow(data);
  } catch (err) {
    console.error("Kunde inte ladda affischer:", err);
  }
}

// === Visa affischer i loop ===
function startSlideshow(affischer) {
  if (!affischer || affischer.length === 0) {
    console.error("Inga affischer att visa.");
    return;
  }

  const img = document.getElementById("affisch");
  let index = 0;

  function showNext() {
    const current = affischer[index];

    // Sätt bilden
    img.src = current.bild;

    // Tidsinställning (sekunder → ms)
    const tid = current.visningstid
      ? current.visningstid * 1000
      : 8000; // fallback: 8 sek

    // Gå vidare
    index = (index + 1) % affischer.length;

    // Visa nästa
    setTimeout(showNext, tid);
  }

  showNext();
}

// Starta allt
loadAffischer();
