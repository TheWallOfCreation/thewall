console.log("JS LOADED!");

fetch("https://conzpiro.duckdns.org/webhook/454e688e-2e17-4cfc-ac06-11438513273d")
  .then(r => {
    console.log("FETCH RESPONSE STATUS:", r.status);
    return r.json();
  })
  .then(data => console.log("FETCH DATA:", data))
  .catch(err => console.error("FETCH ERROR:", err));


async function loadProjects() {
    const response = await fetch("https://conzpiro.duckdns.org/webhook/454e688e-2e17-4cfc-ac06-11438513273d");
    const data = await response.json();
    renderProjects(data);
}

loadProjects();

function renderProjects(projects) {
    const grid = document.getElementById("project-grid");
    grid.innerHTML = "";

    projects.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="image-container">
                <img src="${p.bild}" alt="${p.projektNamn}">
                <h2>${p.projektNamn}</h2>
            </div>

            <div class="card-content">
                <div class="status ${p.steg.toLowerCase()}">
                    ${p.steg}
                </div>
                <br>
				<strong>Ungdom:</strong> ${p.skapadAv}<br>
                <strong>Coach:</strong> ${p.coach}<br>
				<strong>Information</strong><br> ${p.info}


            </div>
        `;

        grid.appendChild(card);
    });
}