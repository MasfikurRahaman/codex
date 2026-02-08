import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const topicServiceUrl = process.env.TOPIC_SERVICE_URL || "http://localhost:4001";

app.use(express.static(__dirname));

app.get("/api/roadmap", (req, res) => {
  res.json({
    title: "DevOps Roadmap",
    summary: "A quick-start roadmap for becoming job-ready in DevOps.",
    items: [
      "Start with Linux, networking, and Git fundamentals",
      "Learn cloud services, IAM, and automation",
      "Build CI/CD pipelines and containerize apps",
      "Scale with Kubernetes, observability, and security"
    ]
  });
});

app.get("/api/focus", (req, res) => {
  res.json({
    title: "Today’s Focus",
    summary: "Cloud infrastructure fundamentals for production readiness.",
    items: [
      "Map IAM roles to least-privilege access",
      "Design a VPC/VNet with private subnets",
      "Set up monitoring dashboards + alerts"
    ]
  });
});

app.get("/api/materials", (req, res) => {
  const { topic } = req.query;
  if (!topic) {
    res.status(400).json({ message: "Missing topic" });
    return;
  }

  res.json({
    title: `${topic} • Study Material`,
    summary: "Curated highlights pulled from the DevOps Atlas gateway.",
    items: [
      `Core concepts for ${topic}`,
      `Recommended labs and walkthroughs for ${topic}`,
      `Reference architecture patterns in ${topic}`
    ]
  });
});

app.get("/api/topics", async (req, res) => {
  try {
    const response = await fetch(`${topicServiceUrl}/topics`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(502).json({ message: "Topic service unavailable" });
  }
});

app.get("/api/topics/:topic/questions", async (req, res) => {
  try {
    const topic = encodeURIComponent(req.params.topic);
    const response = await fetch(`${topicServiceUrl}/topics/${topic}/questions`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(502).json({ message: "Topic service unavailable" });
  }
});

app.get("/api/topics/:topic/questions/:id", async (req, res) => {
  try {
    const topic = encodeURIComponent(req.params.topic);
    const id = req.params.id;
    const response = await fetch(`${topicServiceUrl}/topics/${topic}/questions/${id}`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(502).json({ message: "Topic service unavailable" });
  }
});

app.listen(port, () => {
  console.log(`DevOps Atlas running on http://localhost:${port}`);
});
