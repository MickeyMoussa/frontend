# Nottube (Frontend)

A React-based single-page video streaming platform inspired by YouTube.  
Nottube supports browsing and watching videos, liking/saving content, basic channel views, and an **administrator panel** for managing flags and appeals on videos, accounts, and comments.

---

## 1. Project Description

Nottube (Frontend) is a purely client-side prototype that demonstrates:

- A home feed of videos (seed data + user uploads).
- Per-video watch pages with like/save functionality.
- User flows for signing up, logging in, and managing profile settings.
- Uploading videos and managing uploaded content.
- An administrator view with tools to:
  - Manage user appeals.
  - Flag videos, comments, and accounts.

All state (videos, uploads, flags, likes, etc.) is stored in the browser (e.g., local storage / in-memory), and **no backend or external API** is required.

---

## 2. Tech Stack

- **Framework:** React
- **Build Tool/Bundler:** (e.g., Vite / Create React App – whichever you used)
- **Language:** JavaScript (JSX)
- **Styling:** Plain CSS-in-JSX / inline styles
- **State Management:** Custom React context (`NotTubeState`) + browser storage

---

## 3. Setup & Installation

### Prerequisites

- **Node.js** (recommended: v18+)
- **npm** (comes with Node) or **yarn**

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/MickeyMoussa/frontend.git
cd frontend   # or: cd nottube915/nottube, depending on your folder name
npm install
