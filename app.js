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

const renderQuestions = ({ topic, questions }) => {
  actionPanel.innerHTML = `
    <div class="action-panel__content">
      <h3>${topic} • 100 Interview Questions</h3>
      <p>Select a question to reveal the answer.</p>
      <div class="question-list">
        ${questions
          .map(
            (item) =>
              `<button class="question-item" data-topic="${topic}" data-question-id="${item.id}">${item.question}</button>`
          )
          .join("")}
      </div>
      <div class="answer-box" id="answer-box">Choose a question to see the answer.</div>
    </div>
  `;
};

const renderAnswer = ({ topic, id, question, answer }) => {
  const answerBox = document.getElementById("answer-box");
  if (!answerBox) {
    return;
  }
  answerBox.innerHTML = `
    <strong>${topic} • Question ${id}</strong><br />
    ${question}<br /><br />
    ${answer}
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
  const questionButton = event.target.closest(".question-item");
  if (questionButton) {
    const topic = questionButton.dataset.topic;
    const id = questionButton.dataset.questionId;
    try {
      const data = await fetchData(`/api/topics/${encodeURIComponent(topic)}/questions/${id}`);
      renderAnswer(data);
    } catch (error) {
      renderError(error.message);
    }
    return;
  }

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

  if (action === "materials") {
    const query = new URLSearchParams({ topic });
    endpoint = `/api/materials?${query.toString()}`;
  }

  if (action === "questions") {
    endpoint = `/api/topics/${encodeURIComponent(topic)}/questions`;
  }

  try {
    const data = await fetchData(endpoint);
    if (action === "questions") {
      renderQuestions(data);
    } else {
      renderPanel(data);
    }
    actionPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    renderError(error.message);
  }
};

document.addEventListener("click", handleAction);
