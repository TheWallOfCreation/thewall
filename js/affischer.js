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

    // Rensa container
    container.innerHTML = "";

    const url = current.bild;
    const isVideo = url.endsWith(".mp4") || url.includes("video");

    let element;

    if (isVideo) {
      element = document.createElement("video");
      element.src = url;
      element.autoplay = true;
      element.muted = true;
      element.loop = true;
      element.playsInline = true;
      element.style.width = "100%";
      element.style.height = "auto";
    } else {
      element = document.createElement("img");
      element.src = url;
      element.style.width = "100%";
      element.style.height = "auto";
      element.style.objectFit = "contain";
    }

    container.appendChild(element);

    // === Tidsstyrning ===
    let tid = parseInt(current.visningstid) * 1000;
    if (isNaN(tid) || tid < 1000) tid = 8000;

    index++;

    if (index >= affischer.length) {
      console.log("Alla affischer visade. Växlar till projekt.html om", tid, "ms");

      setTimeout(() => {
        window.location.href = "projekt.html";
      }, tid);

      return;
    }

    setTimeout(showNext, tid);
  }

  showNext();
}