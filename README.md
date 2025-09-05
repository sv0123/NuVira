# NuVira

🚀 **NuVira** is a **Full-stack chat and video-calling app** with:  
✅ Real-time messaging (1-on-1 & group chat)  
✅ Video & audio calling with screen sharing  
✅ Responsive and scalable design  


---


## 📌 Table of Contents

- [✨ Features](#-features)  
- [🛠 Tech Stack](#-tech-stack)  
- [📂 Project Structure](#-project-structure)  
- [⚡ Getting Started](#-getting-started)  
- [🎮 Usage](#-usage)  
- [⚙️ Environment Variables](#️-environment-variables)  
- [🤝 Contributing](#-contributing)  
- [📜 License](#-license)  
- [📧 Contact](#-contact)  


---


## ✨ Features

- 🔥 **Real-time chat** using WebSockets (1-on-1 & group messaging)  
- 🎥 **Video & audio calling** with **screen sharing**  
- 📱 **Responsive UI** for desktop and mobile  
- 🔐 **Secure & scalable architecture**  


---


## Tech Stack

| Layer      | Tools / Technologies                                 |
|------------|------------------------------------------------------|
| Frontend   | React.js, WebRTC, CSS framework Tailwind             |
| Backend    | Node.js, Express.js, Socket.IO                       |
| Database   | MongoDB                                              |
| Deployment | Render                                               |


---


## Project Structure

NuVira/
├── backend/ # API and signaling server
├── frontend/ # React app for UI and client logic
├── .gitignore
├── README.md
└── package.json


---


## Getting Started

### Prerequisites

- Node.js (v14 or higher)  
- npm or yarn  
- MongoDB instance (local or cloud)

### Installation

```bash
# Clone the repo
git clone https://github.com/sv0123/NuVira.git
cd NuVira

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install

Environment Variables
In backend/.env:
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key

Usage :
Create or join a chat room
Send and receive real-time messages
Start or join video/audio calls
Share your screen during calls



 📧 Contact:
-------------
👤 Shourabh Verma
🔗 GitHub: @sv0123
📂 Project Link: NuVira Repo
