import express from "express";

const app = express();
const port = process.env.TOPIC_SERVICE_PORT || 4001;

const topics = [
  "Linux & Networking",
  "Cloud Platforms",
  "Containers & Kubernetes",
  "CI/CD & GitOps",
  "Infrastructure as Code",
  "Observability & SRE"
];

const makeQuestion = (topic, index) => ({
  id: index,
  question: `${topic}: Interview question #${index}`,
  answer: `Sample answer for ${topic} question #${index}. Focus on core concepts, practical trade-offs, and real-world troubleshooting steps.`
});

const buildQuestions = (topic) => Array.from({ length: 100 }, (_, i) => makeQuestion(topic, i + 1));

app.get("/topics", (req, res) => {
  res.json({ topics });
});

app.get("/topics/:topic/questions", (req, res) => {
  const topicName = decodeURIComponent(req.params.topic);
  if (!topics.includes(topicName)) {
    res.status(404).json({ message: "Topic not found" });
    return;
  }

  const questions = buildQuestions(topicName).map(({ id, question }) => ({ id, question }));
  res.json({ topic: topicName, questions });
});

app.get("/topics/:topic/questions/:id", (req, res) => {
  const topicName = decodeURIComponent(req.params.topic);
  const id = Number(req.params.id);
  if (!topics.includes(topicName) || Number.isNaN(id) || id < 1 || id > 100) {
    res.status(404).json({ message: "Question not found" });
    return;
  }

  const question = makeQuestion(topicName, id);
  res.json({ topic: topicName, ...question });
});

app.listen(port, () => {
  console.log(`Topic service running on http://localhost:${port}`);
});
