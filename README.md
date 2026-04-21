![Oi Git Logo](./client/public/favicon.png)

# Oi Git

[Website](https://oigit.vercel.app) • [Docs](https://oigit.vercel.app/docs) • [Issues](https://github.com/chaursia/oiGit/issues) • [Contributing](https://github.com/chaursia/oiGit/pulls)

![Version](https://img.shields.io/github/package-json/v/chaursia/oiGit?style=flat-square&color=blue) ![Stars](https://img.shields.io/github/stars/chaursia/oiGit?style=flat-square&color=yellow) ![Forks](https://img.shields.io/github/forks/chaursia/oiGit?style=flat-square&color=orange) ![License](https://img.shields.io/github/license/chaursia/oiGit?style=flat-square&color=brightgreen)

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
