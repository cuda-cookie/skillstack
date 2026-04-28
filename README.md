<div align="center">

# skillstack

**One command. Your entire AI skill stack. Installed.**

[![NPM Version](https://img.shields.io/npm/v/skillstack)](https://www.npmjs.com/package/skillstack)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.6.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)

[skillstack.site](https://www.skillstack.site/) | [skills.sh](https://skills.sh) | [Documentation](https://skillstack.sh/docs)

<a href="https://skillstack.sh">
<img src="assets/skillstack-border.png" alt="skillstack" />
</a>

</div>

## Overview

`skillstack` is a sophisticated Node.js CLI tool built with TypeScript that automates the installation of AI agent skills tailored to your project's technology stack. It performs intelligent detection of frameworks, languages, and tools by analyzing configuration files, then fetches and installs the most relevant skills from the [skills.sh](https://skills.sh) registry.

The tool is designed for modern development workflows, supporting monorepos, multi-language projects, and continuous integration environments. It integrates seamlessly with AI assistants like Claude Code, Cursor, and GitHub Copilot.

## Architecture

### System Architecture

The following diagram illustrates the internal component interactions:

```mermaid
graph TD
    subgraph CLI ["CLI Layer (main.ts)"]
        A[Command Parser]
        B[Orchestrator]
    end

    subgraph Core ["Core Logic (lib.ts)"]
        C[Technology Detector]
        D[Combo Detector]
        E[Agent Detector]
        F[Skill Collector]
    end

    subgraph Resources ["Resources (skills-map.ts)"]
        G[("Skills Map")]
        H[("Combo Map")]
    end

    subgraph Infrastructure ["Infrastructure"]
        I["Installer (installer.ts)"]
        J["Claude Integration (claude.ts)"]
        K["UI/UX (ui.ts)"]
    end

    A --> B
    B --> C
    B --> E
    C --> G
    C --> D
    D --> H
    B --> F
    F --> B
    B --> K
    K -- Selection --> B
    B --> I
    B --> J
    I -- write --> L[(".agents/skills")]
    I -- update --> M["skills-lock.json"]
    J -- update --> N["CLAUDE.md"]
```

### Core Components

- **Detector Engine**: Scans `package.json`, `build.gradle`, `Cargo.toml`, and other configuration files to identify technologies.
- **Skills Registry**: Interfaces with the [skills.sh](https://skills.sh) registry to retrieve skill metadata.
- **Installer**: Downloads and installs skills to agent-specific directories (e.g., `.claude/skills/`, `.cursor/skills/`) with conflict resolution.
- **Summarizer**: Maintains `CLAUDE.md` by managing integration summaries for AI assistants.

### Technology Detection

The following diagram illustrates how `skillstack` identifies your project's ecosystem:

```mermaid
flowchart LR
    subgraph Project ["Project Scan"]
        A[Root Directory]
        B[Workspaces]
    end

    subgraph Detectors ["Detection Methods"]
        C["Manifests: package.json, deno.json, Gemfile"]
        D["Configs: next.config.js, tailwind.config.js"]
        E["Layouts: Gradle, .NET, Rust"]
        F["File Extensions: .jsx, .vue, .svelte"]
    end

    subgraph Registry ["Skills.sh Registry"]
        G[Frameworks]
        H[Languages]
        I[Tools]
    end

    Project --> Detectors
    Detectors --> Registry
```

## Installation Flow

```mermaid
flowchart TD
    A[Run npx skillstack] --> B[Scan Project & Workspaces]
    B --> C[Detect Technologies & Agents]
    C --> D[Collect & Filter Skills]
    D --> E{Auto-confirm?}
    E -->|No| F[Interactive Multi-select]
    E -->|Yes| G[Install Skills]
    F --> G
    G --> H[Update skills-lock.json]
    H --> I[Generate CLAUDE.md Summary]
    I --> J[Installation Complete]
```

## Installation

### Prerequisites

- Node.js >= 22.6.0
- npm or pnpm package manager

### Global Installation

```bash
npm install -g skillstack
skillstack --help
```

### One-time Usage

```bash
npx skillstack
```

## Usage

### Basic Command

```bash
npx skillstack
```

Scans the current directory and installs appropriate skills.

### Options

| Option | Description |
|--------|-------------|
| `-y, --yes` | Skip confirmation prompts |
| `--dry-run` | Preview changes without installing |
| `-a, --agent <name>` | Target specific AI agent (claude-code, cursor, copilot) |
| `-v, --verbose` | Enable verbose logging |
| `-h, --help` | Display help information |

### Examples

```bash
# Dry run to see what would be installed
npx skillstack --dry-run

# Install for Claude Code specifically
npx skillstack -a claude-code

# Skip confirmations in CI
npx skillstack --yes
```

### CLAUDE.md Generation

When targeting Claude Code, `skillstack` generates a `CLAUDE.md` file containing:

- Summary of installed skills
- Technology-specific guidance
- Integration instructions
- Best practices for the detected stack

## Supported Technologies

### Frontend & UI
- React, Next.js, Vue, Nuxt, Svelte, Angular
- Astro, Tailwind CSS, shadcn/ui, GSAP, Three.js

### Languages & Runtimes
- TypeScript, JavaScript, Go, Rust, Python
- Node.js, Bun, Deno, Dart

### Backend & APIs
- Express, Hono, NestJS, Spring Boot, FastAPI
- GraphQL, REST APIs, WebSockets

### Mobile & Desktop
- Expo, React Native, Flutter, SwiftUI
- Tauri, Electron, Kotlin Multiplatform

### Data & Storage
- Supabase, Neon, PlanetScale, Prisma, Drizzle ORM
- MongoDB, PostgreSQL, Redis, Zod validation

### Auth & Payments
- Better Auth, Clerk, Auth0, Stripe, Lemon Squeezy

### Testing & Quality
- Vitest, Jest, Playwright, Cypress
- ESLint, Prettier, oxlint, TypeScript

### Cloud & Infrastructure
- Vercel, Netlify, Cloudflare, AWS, Azure
- Terraform, Docker, Kubernetes, CI/CD

### Media & AI
- Remotion, ElevenLabs, OpenAI, Anthropic
- WebRTC, WebGL, Canvas APIs

## Development

### Project Structure

```
skillstack/
├── packages/
│   ├── skillstack/          # Main CLI package
│   │   ├── index.mjs        # Entry point
│   │   ├── lib.ts           # Core logic
│   │   ├── installer.ts     # Skill installation
│   │   ├── claude.ts        # CLAUDE.md generation
│   │   ├── colors.ts        # Terminal colors
│   │   └── tests/           # Unit tests
│   └── autoskills/          # Auto-detection logic
├── src/                     # Astro website
├── scripts/                 # Build and release scripts
└── assets/                  # Static assets
```

### Setup

```bash
# Clone repository
git clone https://github.com/cookie-may/skillstack.git
cd skillstack

# Install dependencies
pnpm install

# Build CLI
cd packages/skillstack
pnpm build

# Run tests
pnpm test
```

### Build Process

The project uses a monorepo structure with pnpm workspaces:

```bash
# Build all packages
pnpm build

# Build website
pnpm dev

# Lint and format
pnpm lint
pnpm fmt
```

### Testing

Tests are written using Node.js built-in test runner:

```bash
# Run all tests
pnpm test

# Run specific test
node --test tests/detect.test.ts

# Benchmark performance
pnpm bench
```

## API Reference

### Programmatic Usage

```typescript
import { detectSkills, installSkills } from 'skillstack';

const technologies = await detectSkills('./');
const skills = await installSkills(technologies, {
  target: 'claude-code',
  dryRun: false
});
```

### Configuration

Skills can be customized via `.skillstackrc.json`:

```json
{
  "exclude": ["experimental-skill"],
  "include": ["custom-skill"],
  "target": "claude-code"
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run `pnpm test` and `pnpm lint`
5. Submit a pull request

### Adding New Skills

Skills are defined in the [skills.sh registry](https://skills.sh). To add a new skill:

1. Create a skill definition JSON
2. Test detection patterns
3. Submit to skills.sh repository

## Security

This project follows security best practices:

- Dependencies are pinned with exact versions
- No installation scripts in dependencies
- Regular security audits via npm audit
- Supply chain protection via [fendo](https://github.com/midudev/fendo)

## Performance

- **Detection**: < 100ms for typical projects
- **Installation**: < 5 seconds for skill bundles
- **Memory**: < 50MB peak usage
- **Network**: Minimal API calls with caching

## Troubleshooting

### Common Issues

**Detection fails**
- Ensure `package.json` exists and contains dependencies
- Check file permissions
- Run with `--verbose` for debug info

**Installation errors**
- Verify internet connection
- Check `.claude/skills/` permissions
- Clear npm/pnpm cache

**CLAUDE.md not generated**
- Ensure `-a claude-code` flag is used
- Check write permissions in project root

### Debug Mode

```bash
DEBUG=skillstack:* npx skillstack --verbose
```

## License

[CC BY-NC 4.0](./LICENSE) — Created by [midudev](https://midu.dev)

## Acknowledgments

- [skills.sh](https://skills.sh) for the skill registry
- [Claude Code](https://claude.ai/code) for AI assistant integration
- [fendo](https://github.com/midudev/fendo) for supply chain security
