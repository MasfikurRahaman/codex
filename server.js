import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const topicData = {
  "Linux & Networking": {
    materials: [
      "Linux boot process + systemd deep dive",
      "Networking troubleshooting: traceroute, tcpdump",
      "Security hardening checklist"
    ],
    interview: [
      "Explain the TCP handshake and common failure points",
      "How do you debug DNS resolution issues?",
      "Describe iptables vs nftables"
    ]
  },
  "Cloud Platforms": {
    materials: [
      "IAM best practices + least privilege",
      "Designing multi-AZ architectures",
      "Cost optimization and tagging strategy"
    ],
    interview: [
      "How do you design a highly available architecture?",
      "Explain shared responsibility model",
      "How do you estimate cloud costs?"
    ]
  },
  "Containers & Kubernetes": {
    materials: [
      "Dockerfile optimization + multi-stage builds",
      "Kubernetes networking and services",
      "Helm charts structure and templating"
    ],
    interview: [
      "Explain how a Kubernetes scheduler works",
      "When would you use a DaemonSet?",
      "Describe rolling updates vs blue/green"
    ]
  },
  "CI/CD & GitOps": {
    materials: [
      "Pipeline design with quality gates",
      "Secrets management in CI/CD",
      "GitOps workflow with pull-based deploys"
    ],
    interview: [
      "How do you manage secrets in pipelines?",
      "What is the difference between CI and CD?",
      "How do you implement rollback strategies?"
    ]
  },
  "Infrastructure as Code": {
    materials: [
      "Terraform module design patterns",
      "State management + remote backends",
      "Ansible roles and idempotency"
    ],
    interview: [
      "How do you manage Terraform state?",
      "Explain immutable vs mutable infrastructure",
      "How do you test IaC?"
    ]
  },
  "Observability & SRE": {
    materials: [
      "Define SLIs and SLOs",
      "Alerting strategies to reduce noise",
      "Incident response playbooks"
    ],
    interview: [
      "How do you set effective SLOs?",
      "Explain RED/USE/Golden signals",
      "Describe a post-incident review process"
    ]
  }
};

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

app.get("/api/topic", (req, res) => {
  const { topic, type } = req.query;
  if (!topic || !type) {
    res.status(400).json({ message: "Missing topic or type" });
    return;
  }

  const data = topicData[topic];
  if (!data || !data[type]) {
    res.status(404).json({ message: "Topic not found" });
    return;
  }

  res.json({
    title: `${topic} • ${type === "materials" ? "Study Material" : "Interview Prep"}`,
    summary: "Curated highlights pulled from the DevOps Atlas backend.",
    items: data[type]
  });
});

app.listen(port, () => {
  console.log(`DevOps Atlas running on http://localhost:${port}`);
});
