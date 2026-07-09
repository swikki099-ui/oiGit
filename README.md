<p align="center">
  <img src="./client/public/favicon.png" width="120" height="120" alt="Oi Git Logo">
</p>

<h1 align="center">Oi Git</h1>

<p align="center">
  <a href="https://oigit.vercel.app">Website</a> •
  <a href="https://oigit.vercel.app/docs">Docs</a> •
  <a href="https://github.com/chaursia/oiGit/issues">Issues</a> •
  <a href="https://github.com/chaursia/oiGit/pulls">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/chaursia/oiGit?style=flat-square&color=blue" alt="Version">
  <img src="https://img.shields.io/github/stars/chaursia/oiGit?style=flat-square&color=yellow" alt="Stars">
  <img src="https://img.shields.io/github/forks/chaursia/oiGit?style=flat-square&color=orange" alt="Forks">
  <img src="https://img.shields.io/github/license/chaursia/oiGit?style=flat-square&color=brightgreen" alt="License">
</p>

---

**Your GitHub, In Print.**

Oi Git is an open-source visualizer that transforms raw GitHub developer data into stunning, high contrast, editorial style layouts. Generate beautiful, embeddable SVGs for your `README.md` instantly without authentication.

---

## 📖 Features

- **No Authentication Required:** Simply pass a username to generate instant SVGs.
- **Advanced Metrics:** We track exactly what matters (Merged PRs, Code Reviews, Total Forks, Algorithmic Global Rank, etc).
- **Theming System:** Support for both classic modern designs and our signature *Newsprint* editorial aesthetic.
- **Zero Config Embeds:** SVGs are dynamically generated on the fly. Drop the image URL into your markdown and you're done.

## 🚀 Usage

You can embed these cards anywhere markdown is supported (like your GitHub profile `README.md`).

**Stats Card (Newsprint Theme)**
```markdown
[![Stats](https://oigit.vercel.app/api?username=chaursia&type=stats&theme=newsprint)](https://github.com/chaursia)
```

**Global Rank Overview**
```markdown
[![Overview](https://oigit.vercel.app/api?username=chaursia&type=overview&theme=newsprint)](https://github.com/chaursia)
```

**Activity Heatmap**
```markdown
[![Heatmap](https://oigit.vercel.app/api?username=chaursia&type=heatmap&theme=newsprint)](https://github.com/chaursia)
```

*See the [official documentation](https://oigit.vercel.app/docs) for all endpoints and themes.*

## 🛠️ Local Development

Oi Git is built with React, Vite, TailwindCSS v4, and Express.

```bash
# Install dependencies
npm install

# Start the local development server (Frontend + API)
npm run dev
```

## 🌐 Deployment

This application is configured for seamless deployment to **Vercel**:
1. Push your code to a GitHub repository.
2. Import the project in the Vercel dashboard.
3. Set your `GITHUB_TOKEN` environment variable in Vercel settings to allow the API to fetch deep GraphQL metrics without hitting rate limits.
4. Deploy!

## 📜 License

[MIT License](LICENSE) - © Oi Git Publishing. All Rights Reserved.
