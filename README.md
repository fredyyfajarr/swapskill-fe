```text
  _________                             __   .__.__  .__           ______________________
 /   _____/_  _  _______  ______  _____|  | _|__|  | |  |          \_   _____/\_   _____/
 \_____  \\ \/ \/ /\__  \ \____ \/  ___/  |/ /  |  | |  |    ______ |    __)   |    __)_ 
 /        \\     /  / __ \|  |_> >___ \|    <|  |  |_|  |__ /_____/ |     \    |        \
/_______  / \/\_/  (____  /   __/____  >__|_ \__|____/____/         \___  /   /_______  /
        \/              \/|__|       \/     \/                          \/            \/ 
```

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="NextJS" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</div>

## 📑 Table of Contents
- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License / Copyright](#license--copyright)

## 🚀 About The Project

**SwapSkill Frontend** is the sleek, interactive user-facing application for the SwapSkill platform. Built exclusively to facilitate seamless peer-to-peer skill exchanges, it offers an intuitive and responsive interface that works flawlessly across all devices. Utilizing the highly optimized Next.js 16 environment alongside React 19, this frontend ensures users experience instantaneous page loads, rich interactions, and dynamic real-time feedback.

Focusing on usability and modern aesthetics, the project incorporates advanced UI/UX practices through Framer Motion for liquid-smooth animations, Tailwind CSS for utility-first styling, and robust data-fetching strategies via SWR to keep interfaces instantly synchronized with the backend. It perfectly complements the SwapSkill APIs, forming a unified, premium digital experience.

## ✨ Key Features
- **Modern Next.js Implementation**: Leveraging the newest App Router architecture for optimized SSR/SSG.
- **Fluid UI Animations**: Rich, non-blocking component transitions powered by Framer Motion.
- **Real-time Theming**: Automatic dark and light mode switching supported natively via `next-themes`.
- **Intelligent Data Fetching**: Fast, cached, and automatically revalidating API calls using `swr` and `axios`.
- **Scalable Component Architecture**: Modularized design using Tailwind CSS alongside tools like `tailwind-merge` and `clsx` for flawless dynamic styling.

## 🛠 Tech Stack
- **Framework:** Next.js (16.x)
- **Library:** React (19.x)
- **Styling:** Tailwind CSS (v4)
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Data Fetching:** Axios, SWR
- **Utilities:** Date-fns, React Hot Toast

## 📂 Project Structure
```text
swapskill-fe/
├── app/                  # Next.js App Router endpoints and page layouts
├── components/           # Reusable UI elements and layout components
├── features/             # Domain-specific modules and composite views
├── lib/                  # Core utilities, API clients, and helper functions
├── public/               # Static assets (images, icons)
├── middleware.ts         # Edge routing logic and request interceptors
└── package.json          # Project metadata and script configurations
```

## 🏁 Getting Started

### Prerequisites
- **Node.js**: v18.x or newer (v20+ recommended)
- **npm**: v9.x or newer

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/fredyyfajarr/swapskill-fe.git
   ```
2. Navigate into the frontend directory:
   ```bash
   cd swapskill-fe
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Setup your local environment variables (duplicate `.env.example` to `.env` if available and link the Next.js app to your backend API URL).

## 💻 Usage

To start the local development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser. The application will hot-reload automatically as you modify source files. 

For a production build, compile the application using:
```bash
npm run build
npm run start
```

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License / Copyright

Copyright &copy; 2026 Fredy Fajar Adi Putra. All Rights Reserved.
