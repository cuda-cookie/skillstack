import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getNpxCommand, getNpxSpawnOptions } from "../installer.mjs";

describe("installer", () => {
  it("uses npx.cmd on Windows", () => {
    assert.equal(getNpxCommand("win32"), "npx.cmd");
  });

  it("uses npx on non-Windows platforms", () => {
    assert.equal(getNpxCommand("linux"), "npx");
    assert.equal(getNpxCommand("darwin"), "npx");
  });

  it("uses shell mode on Windows", () => {
    assert.deepEqual(getNpxSpawnOptions("win32"), {
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,
    });
  });

  it("avoids shell mode on non-Windows platforms", () => {
    assert.deepEqual(getNpxSpawnOptions("linux"), {
      stdio: ["pipe", "pipe", "pipe"],
      shell: false,
    });
    assert.deepEqual(getNpxSpawnOptions("darwin"), {
      stdio: ["pipe", "pipe", "pipe"],
      shell: false,
    });
  });
});
