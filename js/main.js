document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("themeToggle").onclick = () =>
  document.body.classList.toggle("light");

const projects = [
  {
    title: "Internal Event Management Platform",
    image: "assets/event-app.png",
    description:
      "Designed and built a Power Apps solution to replace third-party event management software, reducing licensing costs and centralizing internal event data.",
    link: "https://github.com/owendonnell"
  },
  {
    title: "Digital Tour Guide Application",
    image: "assets/tour-app.png",
    description:
      "Developed an interactive tour guide application integrated with Power BI to track engagement and usage analytics across departments.",
    link: "https://github.com/owendonnell"
  },
  {
    title: "Enterprise SharePoint Collaboration Hub",
    image: "assets/sharepoint-hub.png",
    description:
      "Led the design of a SharePoint Online collaboration hub consolidating tools, documentation, and workflows for cross-functional teams.",
    link: "https://github.com/owendonnell"
  }
];

const grid = document.getElementById("projectGrid");

projects.forEach(p => {
  const card = document.createElement("div");
  card.className = "project-card";
  card.innerHTML = `
    <img src="${p.image}" alt="${p.title}">
    <div class="content">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <a href="${p.link}" target="_blank">View Details →</a>
    </div>
  `;
  grid.appendChild(card);
});
