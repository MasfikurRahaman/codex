const actionPanel = document.getElementById("action-panel");

const renderPanel = ({ title, summary, items }) => {
  actionPanel.innerHTML = `
    <div class="action-panel__content">
      <h3>${title}</h3>
      <p>${summary}</p>
      <ul class="action-panel__list">
        ${items.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </div>
  `;
};

const renderError = (message) => {
  actionPanel.innerHTML = `
    <div class="action-panel__content">
      <h3>Something went wrong</h3>
      <p>${message}</p>
    </div>
  `;
};

const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to load data from the API.");
  }
  return response.json();
};

const handleAction = async (event) => {
  const button = event.target.closest(".action-btn");
  if (!button) {
    return;
  }

  const topic = button.dataset.topic;
  const action = button.dataset.action;
  let endpoint = "/api/roadmap";

  if (action === "focus") {
    endpoint = "/api/focus";
  }

  if (action === "materials" || action === "interview") {
    const query = new URLSearchParams({ topic, type: action });
    endpoint = `/api/topic?${query.toString()}`;
  }

  try {
    const data = await fetchData(endpoint);
    renderPanel(data);
    actionPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    renderError(error.message);
  }
};

document.addEventListener("click", handleAction);
