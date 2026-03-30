import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

const CLI_PATH = resolve(import.meta.dirname, "..", "index.mjs");

function run(args = [], cwd = process.cwd()) {
  return execFileSync(process.execPath, [CLI_PATH, ...args], {
    cwd,
    encoding: "utf-8",
    timeout: 10_000,
    env: { ...process.env, NO_COLOR: "1" },
  });
}

describe("CLI", () => {
  it("shows help with --help", () => {
    const output = run(["--help"]);
    assert.ok(output.includes("autoskills"));
    assert.ok(output.includes("--dry-run"));
    assert.ok(output.includes("--yes"));
  });

  it("shows help with -h", () => {
    const output = run(["-h"]);
    assert.ok(output.includes("autoskills"));
  });

  describe("--dry-run", () => {
    let tmpDir;

    beforeEach(() => {
      tmpDir = mkdtempSync(join(tmpdir(), "autoskills-cli-"));
    });

    afterEach(() => {
      rmSync(tmpDir, { recursive: true, force: true });
    });

    it("shows detected technologies without installing", () => {
      writeFileSync(
        join(tmpDir, "package.json"),
        JSON.stringify({
          dependencies: { react: "^19", next: "^15" },
          devDependencies: { typescript: "^5" },
        }),
      );
      writeFileSync(join(tmpDir, "tsconfig.json"), "{}");

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("React"));
      assert.ok(output.includes("Next.js"));
      assert.ok(output.includes("TypeScript"));
      assert.ok(output.includes("--dry-run"));
      assert.ok(output.includes("nothing was installed"));
    });

    it("warns when no technologies are detected", () => {
      writeFileSync(join(tmpDir, "package.json"), JSON.stringify({}));

      const output = run(["--dry-run"], tmpDir);
      assert.ok(output.includes("No supported technologies"));
    });

    it("shows skills grouped by source technology", () => {
      writeFileSync(
        join(tmpDir, "package.json"),
        JSON.stringify({
          devDependencies: { tailwindcss: "^4", typescript: "^5" },
        }),
      );
      writeFileSync(join(tmpDir, "tsconfig.json"), "{}");

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("tailwind-css-patterns"));
      assert.ok(output.includes("typescript-advanced-types"));
      assert.ok(output.includes("Tailwind CSS"));
      assert.ok(output.includes("TypeScript"));
    });

    it("detects technologies from config files only", () => {
      writeFileSync(join(tmpDir, "package.json"), JSON.stringify({}));
      writeFileSync(join(tmpDir, "next.config.mjs"), "export default {}");

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("Next.js"));
    });

    it("detects Astro from package.json", () => {
      writeFileSync(
        join(tmpDir, "package.json"),
        JSON.stringify({
          dependencies: { astro: "^5" },
        }),
      );

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("Astro"));
      assert.ok(output.includes("astro"));
    });

    it("detects Astro from config file", () => {
      writeFileSync(join(tmpDir, "package.json"), JSON.stringify({}));
      writeFileSync(join(tmpDir, "astro.config.mjs"), "export default {}");

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("Astro"));
    });

    it("detects oxlint from package.json", () => {
      writeFileSync(
        join(tmpDir, "package.json"),
        JSON.stringify({
          devDependencies: { oxlint: "^0.16" },
        }),
      );

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("oxlint"));
    });

    it("detects oxlint from config file", () => {
      writeFileSync(join(tmpDir, "package.json"), JSON.stringify({}));
      writeFileSync(join(tmpDir, ".oxlintrc.json"), "{}");

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("oxlint"));
    });

    it("detects Pinia from package.json", () => {
      writeFileSync(
        join(tmpDir, "package.json"),
        JSON.stringify({
          dependencies: { pinia: "^2" },
        }),
      );

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("Pinia"));
      assert.ok(output.includes("vue-pinia-best-practices"));
    });

    it("detects GSAP from package.json", () => {
      writeFileSync(
        join(tmpDir, "package.json"),
        JSON.stringify({
          dependencies: { gsap: "^3" },
        }),
      );

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("GSAP"));
      assert.ok(output.includes("gsap-core"));
      assert.ok(output.includes("gsap-scrolltrigger"));
    });

    it("detects GSAP + React combo", () => {
      writeFileSync(
        join(tmpDir, "package.json"),
        JSON.stringify({
          dependencies: { gsap: "^3", react: "^19", "react-dom": "^19" },
        }),
      );

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("GSAP"));
      assert.ok(output.includes("React"));
      assert.ok(output.includes("GSAP + React"));
      assert.ok(output.includes("gsap-react"));
    });

    it("detects Tailwind + shadcn/ui combo", () => {
      writeFileSync(
        join(tmpDir, "package.json"),
        JSON.stringify({
          devDependencies: { tailwindcss: "^4" },
        }),
      );
      writeFileSync(join(tmpDir, "components.json"), "{}");

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("Tailwind CSS"));
      assert.ok(output.includes("shadcn/ui"));
      assert.ok(output.includes("Tailwind CSS + shadcn/ui"));
      assert.ok(output.includes("tailwind-v4-shadcn"));
    });

    it("detects Cloudflare base skills from wrangler package", () => {
      writeFileSync(
        join(tmpDir, "package.json"),
        JSON.stringify({
          devDependencies: { wrangler: "^3" },
        }),
      );

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("Cloudflare"));
      assert.ok(output.includes("cloudflare/skills/cloudflare"));
      assert.ok(output.includes("cloudflare/skills/wrangler"));
      assert.ok(output.includes("workers-best-practices"));
    });

    it("detects Cloudflare from wrangler.json config file", () => {
      writeFileSync(join(tmpDir, "package.json"), JSON.stringify({}));
      writeFileSync(join(tmpDir, "wrangler.json"), JSON.stringify({ name: "my-worker" }));

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("Cloudflare"));
    });

    it("detects Durable Objects from wrangler.json content", () => {
      writeFileSync(join(tmpDir, "package.json"), JSON.stringify({}));
      writeFileSync(
        join(tmpDir, "wrangler.json"),
        JSON.stringify({
          name: "my-worker",
          durable_objects: { bindings: [{ name: "MY_DO", class_name: "MyDO" }] },
        }),
      );

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("Durable Objects"));
      assert.ok(output.includes("cloudflare/skills/durable-objects"));
    });

    it("detects Cloudflare AI from wrangler.json content", () => {
      writeFileSync(join(tmpDir, "package.json"), JSON.stringify({}));
      writeFileSync(
        join(tmpDir, "wrangler.json"),
        JSON.stringify({ name: "my-worker", ai: { binding: "AI" } }),
      );

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("Cloudflare AI"));
      assert.ok(output.includes("building-ai-agent-on-cloudflare"));
    });

    it("detects Cloudflare Agents from agents package", () => {
      writeFileSync(
        join(tmpDir, "package.json"),
        JSON.stringify({
          dependencies: { agents: "^1" },
        }),
      );

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("Cloudflare Agents"));
      assert.ok(output.includes("agents-sdk"));
      assert.ok(output.includes("building-mcp-server-on-cloudflare"));
    });

    it("detects Cloudflare + Vite combo for vinext", () => {
      writeFileSync(
        join(tmpDir, "package.json"),
        JSON.stringify({
          devDependencies: { wrangler: "^3", vite: "^6" },
        }),
      );

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("Cloudflare"));
      assert.ok(output.includes("Vite"));
      assert.ok(output.includes("Cloudflare + Vite"));
      assert.ok(output.includes("migrate-to-vinext"));
    });

    it("detects Vercel deploy from .vercel directory", () => {
      writeFileSync(join(tmpDir, "package.json"), JSON.stringify({}));
      mkdirSync(join(tmpDir, ".vercel"), { recursive: true });

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("Vercel"));
      assert.ok(output.includes("deploy-to-vercel"));
    });

    it("detects Vercel deploy from @astrojs/vercel adapter", () => {
      writeFileSync(
        join(tmpDir, "package.json"),
        JSON.stringify({
          dependencies: { astro: "^5", "@astrojs/vercel": "^8" },
        }),
      );

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("Vercel"));
      assert.ok(output.includes("deploy-to-vercel"));
    });

    it("detects Cloudflare from @astrojs/cloudflare adapter", () => {
      writeFileSync(
        join(tmpDir, "package.json"),
        JSON.stringify({
          dependencies: { astro: "^5", "@astrojs/cloudflare": "^12" },
        }),
      );

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("Cloudflare"));
      assert.ok(output.includes("cloudflare/skills/cloudflare"));
      assert.ok(output.includes("workers-best-practices"));
    });

    it("detects Bun from bun.lockb", () => {
      writeFileSync(join(tmpDir, "package.json"), JSON.stringify({}));
      writeFileSync(join(tmpDir, "bun.lockb"), "");

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("Bun"));
      assert.ok(output.includes("https://bun.sh/docs"));
    });

    it("detects Bun from bunfig.toml", () => {
      writeFileSync(join(tmpDir, "package.json"), JSON.stringify({}));
      writeFileSync(join(tmpDir, "bunfig.toml"), "[install]");

      const output = run(["--dry-run"], tmpDir);

      assert.ok(output.includes("Bun"));
    });
  });
});
