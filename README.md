# 🫂 Gathered

> Simple, fast group video calls. No account needed.

Gathered is an open-source group video calling web app built with Next.js, WebRTC, and Socket.io. Create a room, share the code, and start talking — no sign-up, no downloads, no friction.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![DaisyUI](https://img.shields.io/badge/DaisyUI-v5-5a0ef5?style=flat-square)
![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?style=flat-square&logo=socket.io)
![WebRTC](https://img.shields.io/badge/WebRTC-p2p-orange?style=flat-square)

---

## ✨ Features

- 🎥 **Group video & audio** — up to 8 participants via WebRTC mesh
- 💬 **Live chat** — real-time in-meeting text chat
- 🖥️ **Screen sharing** — share your screen with one click
- 🔇 **Mute / camera toggle** — control your own audio and video
- 🔗 **Shareable room codes** — invite anyone with a simple code
- 🚫 **No account needed** — just enter a name and go
- 🌑 **Dark UI** — easy on the eyes

---

## 🛠️ Tech Stack

| Layer            | Technology                   |
| ---------------- | ---------------------------- |
| Framework        | Next.js 16 (App Router)      |
| UI               | DaisyUI v5 + Tailwind CSS v4 |
| Video / Audio    | WebRTC via `simple-peer`     |
| Signaling + Chat | Socket.io                    |
| Room codes       | `nanoid`                     |
| Deployment       | Railway                      |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone [https://github.com/sheikhsulaiman/gathered.git](https://github.com/sheikhsulaiman/gathered)
cd gathered

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> ⚠️ Camera and microphone access requires a **secure context**. Always use `localhost` for local development, not your network IP address.

---

## 🧪 Testing Locally

1. Open `http://localhost:3000` in **Window 1**
2. Enter your name → click **Create a Room**
3. Copy the room code from the top bar
4. Open `http://localhost:3000` in a **new browser window**
5. Enter a different name → click **Join a Room** → paste the code

> Use a new window, not just a new tab, to avoid camera stream conflicts.

---

## 📁 Project Structure

```
gathered/
├── app/
│   ├── page.jsx                  # Home — create or join a room
│   ├── layout.jsx                # Root layout
│   ├── globals.css               # Tailwind v4 + DaisyUI imports
│   └── room/[roomId]/
│       └── page.jsx              # Room page
├── components/
│   ├── VideoGrid.jsx             # Responsive video tile grid
│   ├── VideoTile.jsx             # Single participant video
│   ├── Controls.jsx              # Bottom control bar
│   └── ChatPanel.jsx             # Slide-in chat sidebar
├── hooks/
│   ├── useSocket.js              # Socket.io client connection
│   └── useWebRTC.js              # WebRTC peer connections + streams
└── pages/
    └── api/
        └── socket.js             # Socket.io server (signaling + chat)
```

---

## 🌐 Deployment

Gathered requires a **persistent server** for Socket.io — it cannot be deployed on Vercel's serverless platform. [Railway](https://railway.app) is the recommended deployment target.

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Get your public HTTPS domain
railway domain
```

Your app will be live at `https://your-app.up.railway.app` with full HTTPS — camera and mic work out of the box.

---

## ⚙️ How It Works

```
User A (browser)                    User B (browser)
     |                                    |
     |──── join room ────► Socket.io ◄── join room ──|
     |                     (Next.js API)              |
     |◄─── peers list ─────────────────► peers list ─|
     |                                    |
     |◄══════════ WebRTC (simple-peer) ══►|
           direct peer-to-peer video/audio
```

1. Users connect to Socket.io and join a room by code
2. Socket.io exchanges WebRTC **offer / answer / ICE candidates** between peers
3. Once connected, video and audio flow **directly peer-to-peer** — the server is no longer involved
4. **Chat** messages are broadcast through Socket.io
5. **Screen sharing** replaces the video track on all active peer connections

### Group call topology

Gathered uses a **mesh network** — each participant connects directly to every other participant.

```
     A
    / \
   B - C      3 people = 3 connections
```

This works well up to ~6–8 participants. Beyond that, an SFU (e.g. mediasoup) would be needed.

---

## 🔒 Limitations

- **Max ~8 participants** — mesh WebRTC scales poorly beyond this
- **No persistent chat** — messages are not saved after the call ends
- **No authentication** — anyone with the room code can join
- **LAN / localhost only for dev** — HTTPS required for camera access on remote URLs

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

```bash
# Create a feature branch
git checkout -b feature/my-feature

# Commit your changes
git commit -m "feat: add my feature"

# Push and open a PR
git push origin feature/my-feature
```

---

## 📄 License

[MIT](LICENSE)

---

<p align="center">Built with ❤️ using Next.js, WebRTC, and Socket.io</p>
