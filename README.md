# Smart-Triage-Rescue-Grid-Using-LoRa-Based-IoT-and-Generative-AI

**An Advanced Off-Grid Communication Ecosystem with Self-Healing Mesh & AI-Driven Triage**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview
In critical scenarios like natural disasters, mining accidents, or remote expeditions, terrestrial networks (Cellular/Internet) often fail, creating "Communication Dark Zones." The **Smart Triage & Rescue Grid** is a 100% off-grid, self-healing ecosystem designed to ensure persistent connectivity. By integrating LoRa mesh networking with local Artificial Intelligence, it provides an intelligent, prioritized rescue management system that operates with zero reliance on external infrastructure.

### 🚩 Problem Statement
Traditional emergency response systems rely on vulnerable infrastructure and manual data sorting, leading to information overload and critical delays. This project develops an integrated hardware-software solution that automates victim detection, enables long-range messaging, and uses AI to prioritize life-threatening emergencies during the "golden hour" of rescue.

---

## ✨ Key Features
- **🌐 100% Off-Grid Connectivity:** A decentralized LoRa mesh network providing reliable communication without cellular service or internet.
- **📱 Zero-App Captive Portal:** Victims connect to a local Wi-Fi node and submit distress forms via a standard browser—no specialized app installation required.
- **🧠 AI-Driven Triage:** A local, offline Large Language Model (Ollama/Llama 3) parses natural language distress signals into medical priorities: **Red** (Immediate), **Yellow** (Urgent), or **Green** (Minor).
- **🧍 Autonomous "Man-Down" Detection:** Edge AI (TinyML) on the MPU6050 sensor detects severe falls or unresponsiveness and autonomously broadcasts an SOS.
- **🛡️ Self-Healing Mesh Protocol:** Intelligent "Store and Forward" routing that automatically bypasses damaged nodes to ensure data reaches the command center.
- **🖥️ Commander Dashboard:** A centralized, real-time interface for monitoring triage queues, node health, and battery levels.

---

## 🛠️ Tech Stack
| Component | Technology |
| :--- | :--- |
| **Edge Hardware** | ESP32, LoRa SX1276, MPU6050 |
| **Firmware** | C++ (Arduino Framework), Edge Impulse (TinyML) |
| **Mesh Protocol** | Custom LoRa Mesh (Store & Forward) |
| **AI (Local LLM)** | Ollama (Llama 3 / Phi-3) |
| **Backend** | Node.js, Express.js, MongoDB (Local) |
| **Frontend** | React.js, Socket.io (Real-time updates) |

---

## 🏗️ System Architecture
1. **Victim/Edge Node:** Hosts a local Wi-Fi AP for SOS submission and runs local inference for fall detection.
2. **Mesh Network:** A decentralized backbone that relays encrypted RF packets across multiple hops.
3. **Command Gateway:** A central LoRa receiver that bridges mesh data to the local server via Serial/USB.
4. **AI Triage Module:** A local intelligence layer that determines injury severity without cloud APIs.
5. **Incident Dashboard:** The visual hub for rescue commanders to manage dispatch and track victim status.

---

## 📂 Project Structure
```text
├── firmware/         # ESP32 C++ Code & TinyML Models
├── backend/          # Node.js Server & MongoDB Logic
├── ai/               # Python Scripts & Ollama Prompt Engineering
├── frontend/         # React Dashboard & Captive Portal UI
└── docs/             # Technical Documentation & Circuit Diagrams
