# GitHub Repository Setup

This guide covers creating a GitHub repository and pushing the Innovexle portfolio project with company standards.

## Prerequisites

- [Git](https://git-scm.com/downloads) installed
- [GitHub account](https://github.com/join) (personal or organization)
- Project ready to deploy (see [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel)

## 1. Create the Repository on GitHub

### Option A: GitHub website

1. Go to [GitHub](https://github.com) and sign in.
2. Click **+** (top right) → **New repository**.
3. Fill in:
   - **Repository name**: `innovexle` (or `innovexle-website` if you prefer).
   - **Description**: e.g. `Innovexle company portfolio and marketing website. Next.js 14, TypeScript, Tailwind.`
   - **Visibility**: **Private** (until launch) or **Public** (for open portfolio).
   - **Do not** check "Add a README", ".gitignore", or "License"  - the project already has these.
4. Click **Create repository**.
5. Leave the "Quick setup" page open; you will use the repository URL in step 4 below.

### Option B: GitHub CLI

```bash
# Install GitHub CLI: https://cli.github.com/
gh auth login
gh repo create innovexle --private --source=. --remote=origin --description "Innovexle company portfolio website. Next.js 14, TypeScript, Tailwind."
# If repo already exists locally, use: gh repo create org/innovexle --private --source=. --push
```

---

## 2. Initialize Git and Prepare the Project

Run these commands from the project root (`d:\projects\innovexle` or your path):

```bash
# Initialize repository (skip if already done)
git init

# Ensure default branch is main
git branch -M main

# Check that sensitive files are ignored
# .env, .env.local, node_modules, .next should NOT appear in git status
git status
```

**Before first commit:** Confirm that `.env` and `.env.local` are not listed. Only `.env.example` should be tracked.

---

## 3. Commit Standards (Company Portfolio)

Use clear, consistent commit messages so the history is readable and professional.

### Format

- **Type**: short prefix indicating the kind of change.
- **Scope** (optional): area of the app, e.g. `contact`, `seo`, `deps`.
- **Message**: imperative, concise description.

```
<type>(<scope>): <short description>

[optional body]
```

### Types

| Type       | Use for |
|-----------|---------|
| `feat`    | New feature or page |
| `fix`     | Bug fix |
| `docs`    | README, DEPLOYMENT, GITHUB, comments |
| `style`   | Formatting, CSS, no logic change |
| `refactor`| Code change that is not fix/feat |
| `perf`    | Performance improvement |
| `chore`   | Build, config, tooling, dependencies |
| `content` | Copy, images, case studies (optional for portfolio) |

### Examples

```bash
feat(contact): add rate limiting to contact API
fix(seo): correct canonical URL on service pages
docs: add GitHub setup and deployment guide
chore(deps): bump Next.js to 14.2
content: update case study for Project Alpha
```

### First commit example

```bash
git add .
git commit -m "chore: initial commit  - Innovexle portfolio (Next.js 14, TypeScript, Tailwind)"
```

---

## 4. Add Remote and Push

Replace `YOUR_USERNAME` or `YOUR_ORG` with your GitHub username or organization name.

```bash
# Add remote (use SSH if you use SSH keys)
git remote add origin https://github.com/YOUR_USERNAME/innovexle.git

# Or with SSH
# git remote add origin git@github.com:YOUR_USERNAME/innovexle.git

# Verify
git remote -v

# Push and set upstream
git push -u origin main
```

If the repo already had a README or other files on GitHub and you need to reconcile:

```bash
git pull origin main --allow-unrelated-histories
# Resolve any conflicts, then:
git push -u origin main
```

---

## 5. Repository Settings (Recommended for Company Portfolio)

After the first push:

1. **About** (repo homepage):  
   - Set **Description** and **Website** (e.g. `https://innovexle.com`).  
   - Add **Topics**: `nextjs`, `typescript`, `tailwindcss`, `portfolio`, `vercel`.

2. **Branches** → **Branch protection** (optional for solo/small team):
   - Add rule for `main`: require pull request reviews and status checks before merge if you use PRs.

3. **Secrets** (if you use GitHub Actions later):  
   - Do **not** put production env vars in the repo; use Vercel (or your host) environment variables.  
   - Use GitHub Secrets only for CI (e.g. deploy tokens) if needed.

---

## 6. After Pushing: Deploy

- Connect the repo to Vercel and deploy: see [DEPLOYMENT.md](./DEPLOYMENT.md).
- Keep `main` as the branch that triggers production deploys.

---

## Quick Reference

| Step | Command / action |
|------|-------------------|
| Init | `git init` |
| Branch | `git branch -M main` |
| Stage | `git add .` |
| Commit | `git commit -m "type(scope): message"` |
| Remote | `git remote add origin https://github.com/USER/innovexle.git` |
| Push | `git push -u origin main` |

---

## Troubleshooting

- **"Permission denied" or "Authentication failed"**  
  Use a [Personal Access Token](https://github.com/settings/tokens) (HTTPS) or set up [SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).

- **Large files or build artifacts**  
  Ensure `.next/`, `node_modules/`, and `.env` are in `.gitignore`. If something was committed by mistake:  
  `git rm -r --cached .next` (or the path), commit, then push.

- **Wrong remote URL**  
  `git remote set-url origin https://github.com/USER/innovexle.git`
