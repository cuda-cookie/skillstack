import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

// ── Skills Map ────────────────────────────────────────────────

export const SKILLS_MAP = [
  {
    id: "react",
    name: "React",
    detect: {
      packages: ["react", "react-dom"],
    },
    skills: [
      "vercel-labs/agent-skills/vercel-react-best-practices",
      "vercel-labs/agent-skills/vercel-composition-patterns",
    ],
  },
  {
    id: "nextjs",
    name: "Next.js",
    detect: {
      packages: ["next"],
      configFiles: ["next.config.js", "next.config.mjs", "next.config.ts"],
    },
    skills: [
      "vercel-labs/next-skills/next-best-practices",
      "vercel-labs/next-skills/next-cache-components",
      "vercel-labs/next-skills/next-upgrade",
    ],
  },
  {
    id: "vue",
    name: "Vue",
    detect: {
      packages: ["vue"],
    },
    skills: [
      "hyf0/vue-skills/vue-best-practices",
      "hyf0/vue-skills/vue-debug-guides",
      "antfu/skills/vue",
      "antfu/skills/vue-best-practices",
    ],
  },
  {
    id: "nuxt",
    name: "Nuxt",
    detect: {
      packages: ["nuxt"],
      configFiles: ["nuxt.config.js", "nuxt.config.ts"],
    },
    skills: ["antfu/skills/nuxt"],
  },
  {
    id: "pinia",
    name: "Pinia",
    detect: {
      packages: ["pinia"],
    },
    skills: ["vuejs-ai/skills/vue-pinia-best-practices"],
  },
  {
    id: "svelte",
    name: "Svelte",
    detect: {
      packages: ["svelte", "@sveltejs/kit"],
      configFiles: ["svelte.config.js"],
    },
    skills: [],
  },
  {
    id: "angular",
    name: "Angular",
    detect: {
      packages: ["@angular/core"],
      configFiles: ["angular.json"],
    },
    skills: [],
  },
  {
    id: "astro",
    name: "Astro",
    detect: {
      packages: ["astro"],
      configFiles: ["astro.config.mjs", "astro.config.js", "astro.config.ts"],
    },
    skills: ["astrolicious/agent-skills/astro"],
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    detect: {
      packages: ["tailwindcss", "@tailwindcss/vite"],
      configFiles: ["tailwind.config.js", "tailwind.config.ts", "tailwind.config.cjs"],
    },
    skills: ["giuseppe-trisciuoglio/developer-kit/tailwind-css-patterns"],
  },
  {
    id: "shadcn",
    name: "shadcn/ui",
    detect: {
      configFiles: ["components.json"],
    },
    skills: ["shadcn/ui/shadcn"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    detect: {
      packages: ["typescript"],
      configFiles: ["tsconfig.json"],
    },
    skills: ["wshobson/agents/typescript-advanced-types"],
  },
  {
    id: "supabase",
    name: "Supabase",
    detect: {
      packages: ["@supabase/supabase-js", "@supabase/ssr"],
    },
    skills: ["supabase/agent-skills/supabase-postgres-best-practices"],
  },
  {
    id: "neon",
    name: "Neon Postgres",
    detect: {
      packages: ["@neondatabase/serverless"],
    },
    skills: ["neondatabase/agent-skills/neon-postgres"],
  },
  {
    id: "playwright",
    name: "Playwright",
    detect: {
      packages: ["@playwright/test", "playwright"],
      configFiles: ["playwright.config.ts", "playwright.config.js"],
    },
    skills: ["currents-dev/playwright-best-practices-skill/playwright-best-practices"],
  },
  {
    id: "expo",
    name: "Expo",
    detect: {
      packages: ["expo"],
    },
    skills: [
      "expo/skills/building-native-ui",
      "expo/skills/native-data-fetching",
      "expo/skills/upgrading-expo",
      "expo/skills/expo-tailwind-setup",
      "expo/skills/expo-dev-client",
      "expo/skills/expo-deployment",
      "expo/skills/expo-cicd-workflows",
      "expo/skills/expo-api-routes",
      "expo/skills/use-dom",
    ],
  },
  {
    id: "react-native",
    name: "React Native",
    detect: {
      packages: ["react-native"],
    },
    skills: ["sleekdotdesign/agent-skills/sleek-design-mobile-apps"],
  },
  {
    id: "kotlin-multiplatform",
    name: "Kotlin Multiplatform",
    detect: {
      configFileContent: {
        scanGradleLayout: true,
        patterns: [
          'kotlin("multiplatform")',
          "org.jetbrains.kotlin.multiplatform",
          'id("org.jetbrains.kotlin.multiplatform")',
          "kotlin-multiplatform",
        ],
      },
    },
    skills: [
      "Kotlin/kotlin-agent-skills/kotlin-tooling-cocoapods-spm-migration",
      "Kotlin/kotlin-agent-skills/kotlin-tooling-agp9-migration",
    ],
  },
  {
    id: "android",
    name: "Android",
    detect: {
      configFileContent: {
        scanGradleLayout: true,
        patterns: [
          "com.android.application",
          "com.android.library",
          'id("com.android.application")',
          'id("com.android.library")',
          "com.android.kotlin.multiplatform.library",
        ],
      },
    },
    skills: [
      "krutikJain/android-agent-skills/android-kotlin-core",
      "krutikJain/android-agent-skills/android-compose-foundations",
      "krutikJain/android-agent-skills/android-architecture-clean",
      "krutikJain/android-agent-skills/android-di-hilt",
      "krutikJain/android-agent-skills/android-gradle-build-logic",
      "krutikJain/android-agent-skills/android-coroutines-flow",
      "krutikJain/android-agent-skills/android-networking-retrofit-okhttp",
      "krutikJain/android-agent-skills/android-testing-unit",
    ],
  },
  {
    id: "remotion",
    name: "Remotion",
    detect: {
      packages: ["remotion", "@remotion/cli"],
    },
    skills: ["remotion-dev/skills/remotion-best-practices"],
  },
  {
    id: "better-auth",
    name: "Better Auth",
    detect: {
      packages: ["better-auth"],
    },
    skills: [
      "better-auth/skills/better-auth-best-practices",
      "better-auth/skills/email-and-password-best-practices",
      "better-auth/skills/organization-best-practices",
      "better-auth/skills/two-factor-authentication-best-practices",
    ],
  },
  {
    id: "turborepo",
    name: "Turborepo",
    detect: {
      packages: ["turbo"],
      configFiles: ["turbo.json"],
    },
    skills: ["vercel/turborepo/turborepo"],
  },
  {
    id: "vite",
    name: "Vite",
    detect: {
      packages: ["vite"],
      configFiles: ["vite.config.js", "vite.config.ts", "vite.config.mjs"],
    },
    skills: ["antfu/skills/vite"],
  },
  {
    id: "azure",
    name: "Azure",
    detect: {
      packagePatterns: [/^@azure\//],
    },
    skills: [
      "microsoft/github-copilot-for-azure/azure-deploy",
      "microsoft/github-copilot-for-azure/azure-ai",
      "microsoft/github-copilot-for-azure/azure-cost-optimization",
      "microsoft/github-copilot-for-azure/azure-diagnostics",
    ],
  },
  {
    id: "vercel-ai",
    name: "Vercel AI SDK",
    detect: {
      packages: ["ai", "@ai-sdk/openai", "@ai-sdk/anthropic", "@ai-sdk/google"],
    },
    skills: ["vercel/ai/ai-sdk"],
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    detect: {
      packages: ["elevenlabs"],
    },
    skills: ["inferen-sh/skills/elevenlabs-tts", "inferen-sh/skills/elevenlabs-music"],
  },
  {
    id: "vercel-deploy",
    name: "Vercel",
    detect: {
      configFiles: ["vercel.json", ".vercel"],
      packages: ["vercel", "@astrojs/vercel"],
    },
    skills: ["vercel-labs/agent-skills/deploy-to-vercel"],
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    detect: {
      packages: ["wrangler", "@cloudflare/workers-types", "@astrojs/cloudflare"],
      configFiles: ["wrangler.toml", "wrangler.json", "wrangler.jsonc"],
    },
    skills: [
      "cloudflare/skills/cloudflare",
      "cloudflare/skills/wrangler",
      "cloudflare/skills/workers-best-practices",
      "cloudflare/skills/web-perf",
      "openai/skills/cloudflare-deploy",
    ],
  },
  {
    id: "cloudflare-durable-objects",
    name: "Durable Objects",
    detect: {
      configFileContent: {
        files: ["wrangler.json", "wrangler.jsonc", "wrangler.toml"],
        patterns: ["durable_objects"],
      },
    },
    skills: ["cloudflare/skills/durable-objects"],
  },
  {
    id: "cloudflare-agents",
    name: "Cloudflare Agents",
    detect: {
      packages: ["agents"],
    },
    skills: [
      "cloudflare/skills/agents-sdk",
      "cloudflare/skills/building-mcp-server-on-cloudflare",
      "cloudflare/skills/sandbox-sdk",
    ],
  },
  {
    id: "cloudflare-ai",
    name: "Cloudflare AI",
    detect: {
      packages: ["@cloudflare/ai"],
      configFileContent: {
        files: ["wrangler.json", "wrangler.jsonc"],
        patterns: ['"ai"'],
      },
    },
    skills: ["cloudflare/skills/building-ai-agent-on-cloudflare"],
  },
  {
    id: "aws",
    name: "AWS",
    detect: {
      packagePatterns: [/^@aws-sdk\//, /^aws-cdk/],
    },
    skills: [],
  },
  {
    id: "swiftui",
    name: "SwiftUI",
    detect: {
      configFiles: ["Package.swift"],
    },
    skills: ["avdlee/swiftui-agent-skill/swiftui-expert-skill"],
  },
  {
    id: "oxlint",
    name: "oxlint",
    detect: {
      packages: ["oxlint"],
      configFiles: [".oxlintrc.json", "oxlint.config.ts"],
    },
    skills: ["delexw/claude-code-misc/oxlint"],
  },
  {
    id: "gsap",
    name: "GSAP",
    detect: {
      packages: ["gsap"],
    },
    skills: [
      "greensock/gsap-skills/gsap-core",
      "greensock/gsap-skills/gsap-scrolltrigger",
      "greensock/gsap-skills/gsap-performance",
      "greensock/gsap-skills/gsap-plugins",
      "greensock/gsap-skills/gsap-timeline",
      "greensock/gsap-skills/gsap-utils",
      "greensock/gsap-skills/gsap-frameworks",
    ],
  },
  {
    id: "bun",
    name: "Bun",
    detect: {
      configFiles: ["bun.lockb", "bun.lock", "bunfig.toml"],
    },
    skills: ["https://bun.sh/docs"],
  },
  {
    id: "node",
    name: "Node.js",
    detect: {
      configFiles: ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", ".nvmrc", ".node-version"],
    },
    skills: [
      "wshobson/agents/nodejs-backend-patterns",
      "sickn33/antigravity-awesome-skills/nodejs-best-practices",
    ],
  },
  {
    id: "express",
    name: "Express",
    detect: {
      packages: ["express"],
    },
    skills: [],
  },
  {
    id: "deno",
    name: "Deno",
    detect: {
      configFiles: ["deno.json", "deno.jsonc", "deno.lock"],
    },
    skills: [
      "denoland/skills/deno-expert",
      "denoland/skills/deno-guidance",
      "denoland/skills/deno-frontend",
      "denoland/skills/deno-deploy",
      "denoland/skills/deno-sandbox",
      "mindrally/skills/deno-typescript",
    ],
  },
  {
    id: "wordpress",
    name: "WordPress",
    detect: {
      configFiles: ["wp-config.php", "wp-login.php"],
      packagePatterns: [/^@wordpress\//],
      configFileContent: {
        files: ["composer.json", "style.css"],
        patterns: ["johnpbloch/wordpress", "wpackagist", "Theme Name:"],
      },
    },
    skills: [
      "wordpress/agent-skills/wp-plugin-development",
      "wordpress/agent-skills/wp-rest-api",
      "wordpress/agent-skills/wp-block-themes",
      "wordpress/agent-skills/wp-block-development",
      "wordpress/agent-skills/wp-performance",
      "wordpress/agent-skills/wordpress-router",
      "wordpress/agent-skills/wp-project-triage",
      "wordpress/agent-skills/wp-wpcli-and-ops",
    ],
  },
];

// ── Combo Skills Map (cross-technology) ──────────────────────

export const COMBO_SKILLS_MAP = [
  {
    id: "expo-tailwind",
    name: "Expo + Tailwind CSS",
    requires: ["expo", "tailwind"],
    skills: ["expo/skills/expo-tailwind-setup"],
  },
  {
    id: "nextjs-supabase",
    name: "Next.js + Supabase",
    requires: ["nextjs", "supabase"],
    skills: ["supabase/agent-skills/supabase-postgres-best-practices"],
  },
  {
    id: "react-native-expo",
    name: "React Native + Expo",
    requires: ["react-native", "expo"],
    skills: [
      "expo/skills/building-native-ui",
      "sleekdotdesign/agent-skills/sleek-design-mobile-apps",
    ],
  },
  {
    id: "nextjs-vercel-ai",
    name: "Next.js + Vercel AI SDK",
    requires: ["nextjs", "vercel-ai"],
    skills: ["vercel/ai/ai-sdk", "vercel-labs/next-skills/next-best-practices"],
  },
  {
    id: "nextjs-playwright",
    name: "Next.js + Playwright",
    requires: ["nextjs", "playwright"],
    skills: ["currents-dev/playwright-best-practices-skill/playwright-best-practices"],
  },
  {
    id: "react-shadcn",
    name: "React + shadcn/ui",
    requires: ["react", "shadcn"],
    skills: ["shadcn/ui/shadcn", "vercel-labs/agent-skills/vercel-react-best-practices"],
  },
  {
    id: "tailwind-shadcn",
    name: "Tailwind CSS + shadcn/ui",
    requires: ["tailwind", "shadcn"],
    skills: ["secondsky/claude-skills/tailwind-v4-shadcn"],
  },
  {
    id: "gsap-react",
    name: "GSAP + React",
    requires: ["gsap", "react"],
    skills: ["greensock/gsap-skills/gsap-react"],
  },
  {
    id: "cloudflare-vite",
    name: "Cloudflare + Vite",
    requires: ["cloudflare", "vite"],
    skills: ["cloudflare/vinext/migrate-to-vinext"],
  },
  {
    id: "node-express",
    name: "Node.js + Express",
    requires: ["node", "express"],
    skills: ["aj-geddes/useful-ai-prompts/nodejs-express-server"],
  },
];

export const FRONTEND_PACKAGES = [
  "react",
  "vue",
  "svelte",
  "astro",
  "next",
  "@angular/core",
  "solid-js",
  "lit",
  "preact",
  "nuxt",
  "@sveltejs/kit",
];

export const FRONTEND_BONUS_SKILLS = [
  "anthropics/skills/frontend-design",
  "addyosmani/web-quality-skills/accessibility",
  "addyosmani/web-quality-skills/seo",
];

// Extensions that signal a web frontend (excludes .php — too generic for backend-only projects)
export const WEB_FRONTEND_EXTENSIONS = new Set([
  ".html", ".htm",
  ".css", ".scss", ".sass", ".less",
  ".vue", ".svelte", ".jsx", ".tsx",
  ".twig", ".tpl", ".ejs", ".hbs", ".pug", ".njk",
]);

const SCAN_SKIP_DIRS = new Set([
  "node_modules", ".git", "vendor", ".next", "dist", "build",
  ".output", ".nuxt", ".svelte-kit", "__pycache__", ".cache",
  "coverage", ".turbo", "var",
]);

const GRADLE_SCAN_ROOT_FILES = [
  "build.gradle.kts",
  "build.gradle",
  "settings.gradle.kts",
  "settings.gradle",
  "gradle/libs.versions.toml",
];

/**
 * Builds a list of Gradle build file paths to scan for technology markers.
 * Includes root-level Gradle files and `build.gradle(.kts)` inside immediate subdirectories.
 * @param {string} projectDir - Absolute path to the project root.
 * @returns {string[]} Candidate file paths.
 */
function gradleLayoutCandidatePaths(projectDir) {
  const candidates = [];
  for (const f of GRADLE_SCAN_ROOT_FILES) {
    candidates.push(join(projectDir, f));
  }
  let entries;
  try {
    entries = readdirSync(projectDir, { withFileTypes: true });
  } catch {
    entries = [];
  }
  for (const e of entries) {
    if (!e.isDirectory() || e.name.startsWith(".") || SCAN_SKIP_DIRS.has(e.name)) continue;
    for (const g of ["build.gradle.kts", "build.gradle"]) {
      candidates.push(join(projectDir, e.name, g));
    }
  }
  return candidates;
}

/**
 * Resolves the file paths that should be read when checking `configFileContent` detection rules.
 * Delegates to the Gradle scanner when `scanGradleLayout` is set, otherwise maps `config.files`
 * relative to the given directory.
 * @param {string} projectDir - Directory to resolve paths against.
 * @param {object} config - The `configFileContent` block from a SKILLS_MAP entry.
 * @returns {string[]} Absolute file paths to check.
 */
function resolveConfigFileContentPaths(projectDir, config) {
  if (config.scanGradleLayout) {
    return gradleLayoutCandidatePaths(projectDir);
  }
  return (config.files || []).map((f) => join(projectDir, f));
}

/**
 * Recursively checks whether the project contains files with web-frontend extensions
 * (e.g. `.html`, `.css`, `.vue`, `.blade.php`).
 * Skips common non-source directories like `node_modules` and `.git`.
 * @param {string} projectDir - Root directory to scan.
 * @param {number} [maxDepth=3] - Maximum directory nesting depth to traverse.
 * @returns {boolean} `true` if at least one frontend-related file is found.
 */
export function hasWebFrontendFiles(projectDir, maxDepth = 3) {
  function scan(dir, depth) {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return false;
    }

    for (const entry of entries) {
      if (entry.isFile()) {
        const name = entry.name;
        if (name.endsWith(".blade.php")) return true;
        const dot = name.lastIndexOf(".");
        if (dot !== -1 && WEB_FRONTEND_EXTENSIONS.has(name.slice(dot))) return true;
      } else if (entry.isDirectory() && depth < maxDepth) {
        if (SCAN_SKIP_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;
        if (scan(join(dir, entry.name), depth + 1)) return true;
      }
    }

    return false;
  }

  return scan(projectDir, 0);
}

// ── Workspace Resolution ──────────────────────────────────────

/**
 * Zero-dependency parser for `pnpm-workspace.yaml`.
 * Extracts the `packages:` list entries (supports quoted and unquoted values).
 * @param {string} content - Raw file content of pnpm-workspace.yaml.
 * @returns {string[]} Workspace glob patterns (e.g. `["packages/*", "apps/*"]`).
 */
function parsePnpmWorkspaceYaml(content) {
  const lines = content.split("\n");
  const patterns = [];
  let inPackages = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (line === "packages:" || line === "packages :") {
      inPackages = true;
      continue;
    }
    if (inPackages) {
      if (line.startsWith("- ")) {
        patterns.push(line.slice(2).trim().replace(/^['"]|['"]$/g, ""));
      } else if (line !== "" && !line.startsWith("#")) {
        break;
      }
    }
  }

  return patterns;
}

/**
 * Expands workspace glob patterns (e.g. `packages/*`) into actual directory paths
 * that contain a `package.json`. Non-glob patterns are treated as exact directory references.
 * @param {string} projectDir - Absolute path to the monorepo root.
 * @param {string[]} patterns - Workspace patterns to resolve.
 * @returns {string[]} Absolute paths to workspace directories.
 */
function expandWorkspacePatterns(projectDir, patterns) {
  const dirs = [];

  for (const pattern of patterns) {
    if (pattern.includes("*")) {
      const parent = join(projectDir, pattern.replace(/\/?\*.*$/, ""));
      let entries;
      try {
        entries = readdirSync(parent, { withFileTypes: true });
      } catch {
        continue;
      }
      for (const entry of entries) {
        if (!entry.isDirectory() || SCAN_SKIP_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;
        const wsDir = join(parent, entry.name);
        if (existsSync(join(wsDir, "package.json"))) {
          dirs.push(wsDir);
        }
      }
    } else {
      const wsDir = join(projectDir, pattern);
      if (existsSync(join(wsDir, "package.json"))) {
        dirs.push(wsDir);
      }
    }
  }

  return dirs;
}

/**
 * Discovers workspace directories in a monorepo.
 * Checks `pnpm-workspace.yaml` first (higher priority), then falls back to
 * the `workspaces` field in `package.json` (npm/yarn format).
 * @param {string} projectDir - Absolute path to the project root.
 * @returns {string[]} Absolute paths to workspace subdirectories (excludes the root itself).
 */
export function resolveWorkspaces(projectDir) {
  const pnpmPath = join(projectDir, "pnpm-workspace.yaml");
  if (existsSync(pnpmPath)) {
    try {
      const content = readFileSync(pnpmPath, "utf-8");
      const patterns = parsePnpmWorkspaceYaml(content);
      if (patterns.length > 0) {
        return expandWorkspacePatterns(projectDir, patterns).filter(
          (d) => resolve(d) !== resolve(projectDir),
        );
      }
    } catch {}
  }

  const pkg = readPackageJson(projectDir);
  if (pkg) {
    const ws = pkg.workspaces;
    const patterns = Array.isArray(ws) ? ws : Array.isArray(ws?.packages) ? ws.packages : null;
    if (patterns && patterns.length > 0) {
      return expandWorkspacePatterns(projectDir, patterns).filter(
        (d) => resolve(d) !== resolve(projectDir),
      );
    }
  }

  return [];
}

// ── Detection ─────────────────────────────────────────────────

/**
 * Reads and parses the package.json from the given directory.
 * Returns the parsed object, or null if the file is missing or malformed.
 */
export function readPackageJson(dir) {
  const pkgPath = join(dir, "package.json");
  if (!existsSync(pkgPath)) return null;

  try {
    return JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
    // Malformed JSON — treat as absent
    return null;
  }
}

/**
 * Extracts all package names from the given package.json object.
 * Returns an array of package names from both dependencies and devDependencies.
 */
export function getAllPackageNames(pkg) {
  if (!pkg) return [];

  return [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})];
}

/**
 * Scans a single directory for known technologies by checking packages, package patterns,
 * config files, and config file content against the SKILLS_MAP.
 * Also determines whether the directory looks like a frontend project.
 * @param {string} dir - Directory to scan.
 * @returns {{ detected: object[], isFrontendByPackages: boolean, isFrontendByFiles: boolean }}
 */
function detectTechnologiesInDir(dir) {
  const pkg = readPackageJson(dir);
  const allPackages = getAllPackageNames(pkg);
  const detected = [];

  for (const tech of SKILLS_MAP) {
    let found = false;

    if (tech.detect.packages) {
      found = tech.detect.packages.some((p) => allPackages.includes(p));
    }

    if (!found && tech.detect.packagePatterns) {
      found = tech.detect.packagePatterns.some((pattern) =>
        allPackages.some((p) => pattern.test(p)),
      );
    }

    if (!found && tech.detect.configFiles) {
      found = tech.detect.configFiles.some((f) => existsSync(join(dir, f)));
    }

    if (!found && tech.detect.configFileContent) {
      const cfg = tech.detect.configFileContent;
      const paths = resolveConfigFileContentPaths(dir, cfg);
      const { patterns } = cfg;
      for (const filePath of paths) {
        if (!existsSync(filePath)) continue;
        try {
          const content = readFileSync(filePath, "utf-8");
          if (patterns.some((p) => content.includes(p))) {
            found = true;
            break;
          }
        } catch {}
      }
    }

    if (found) {
      detected.push(tech);
    }
  }

  const isFrontendByPackages = allPackages.some((p) => FRONTEND_PACKAGES.includes(p));
  const isFrontendByFiles = hasWebFrontendFiles(dir);

  return { detected, isFrontendByPackages, isFrontendByFiles };
}

/**
 * Main detection entry point. Scans the project root and all workspace subdirectories,
 * merges and deduplicates detected technologies, and resolves cross-technology combos.
 * @param {string} projectDir - Absolute path to the project root.
 * @returns {{ detected: object[], isFrontend: boolean, combos: object[] }}
 */
export function detectTechnologies(projectDir) {
  const root = detectTechnologiesInDir(projectDir);
  const seenIds = new Map(root.detected.map((t) => [t.id, t]));
  let isFrontend = root.isFrontendByPackages || root.isFrontendByFiles;

  const workspaceDirs = resolveWorkspaces(projectDir);
  for (const wsDir of workspaceDirs) {
    const ws = detectTechnologiesInDir(wsDir);
    for (const tech of ws.detected) {
      if (!seenIds.has(tech.id)) {
        seenIds.set(tech.id, tech);
      }
    }
    if (ws.isFrontendByPackages || ws.isFrontendByFiles) {
      isFrontend = true;
    }
  }

  const detected = [...seenIds.values()];
  const detectedIds = detected.map((t) => t.id);
  const combos = detectCombos(detectedIds);

  return { detected, isFrontend, combos };
}

/**
 * Finds combo skills whose requirements are fully satisfied by the detected technology IDs.
 * @param {string[]} detectedIds - Array of technology IDs found in the project.
 * @returns {object[]} Matching entries from COMBO_SKILLS_MAP.
 */
export function detectCombos(detectedIds) {
  return COMBO_SKILLS_MAP.filter((combo) => combo.requires.every((id) => detectedIds.includes(id)));
}

// ── Helpers ──────────────────────────────────────────────────

/**
 * Splits a skill identifier (e.g. `"owner/repo/skill-name"`) into its repo and skill components.
 * Full URLs are returned as-is in the `repo` field.
 * @param {string} skill - Skill path string.
 * @returns {{ repo: string, skillName: string, full: string }}
 */
export function parseSkillPath(skill) {
  if (skill.startsWith("http")) {
    return { repo: skill, skillName: "", full: skill };
  }
  const parts = skill.split("/");
  return {
    repo: parts.slice(0, 2).join("/"),
    skillName: parts.slice(2).join("/"),
    full: skill,
  };
}

// ── Skill Collection ─────────────────────────────────────────

/**
 * Aggregates the final list of skills to install from detected technologies,
 * combo matches, and frontend bonus skills. Deduplicates by skill path and
 * tracks which sources contributed each skill.
 * @param {object[]} detected - Technologies found in the project.
 * @param {boolean} isFrontend - Whether the project has a web frontend.
 * @param {object[]} [combos=[]] - Matched combo skill entries.
 * @returns {{ skill: string, sources: string[] }[]} Deduplicated skill list.
 */
export function collectSkills(detected, isFrontend, combos = []) {
  const seen = new Set();
  const skills = [];

  function addSkill(skill, source) {
    if (!seen.has(skill)) {
      seen.add(skill);
      skills.push({ skill, sources: [source] });
    } else {
      const existing = skills.find((s) => s.skill === skill);
      if (existing && !existing.sources.includes(source)) {
        existing.sources.push(source);
      }
    }
  }

  for (const tech of detected) {
    for (const skill of tech.skills) {
      addSkill(skill, tech.name);
    }
  }

  for (const combo of combos) {
    for (const skill of combo.skills) {
      addSkill(skill, combo.name);
    }
  }

  if (isFrontend) {
    for (const skill of FRONTEND_BONUS_SKILLS) {
      addSkill(skill, "Frontend");
    }
  }

  return skills;
}
