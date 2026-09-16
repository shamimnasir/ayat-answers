import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * The TWA on Play (procreators.io.alquran) is only allowed to render this site
 * fullscreen if Android can verify the domain owns the app. Verification fetches
 * /.well-known/assetlinks.json over HTTPS and looks for the *app signing* key
 * that Play re-signs every release with - not the upload key we sign locally.
 *
 * If this file goes missing or the fingerprint drifts, the app still launches but
 * Chrome keeps its URL bar on screen, so it stops looking like a native app.
 * That failure is invisible in the browser, hence this test.
 */
const PACKAGE = "procreators.io.alquran";
const APP_SIGNING_SHA256 =
  "11:D5:2C:6A:57:A7:9F:F3:0B:5E:37:C5:71:46:40:B1:88:A9:1E:51:85:26:06:C5:B2:AB:0D:85:06:4C:D9:94";

const statements = JSON.parse(
  readFileSync(resolve(__dirname, "../../public/.well-known/assetlinks.json"), "utf-8")
);

describe("Digital Asset Links", () => {
  it("is a non-empty array of statements", () => {
    expect(Array.isArray(statements)).toBe(true);
    expect(statements.length).toBeGreaterThan(0);
  });

  it("delegates URL handling to the Play package", () => {
    const s = statements.find(
      (x: { target?: { package_name?: string } }) => x.target?.package_name === PACKAGE
    );
    expect(s, `no statement for ${PACKAGE}`).toBeDefined();
    expect(s.relation).toContain("delegate_permission/common.handle_all_urls");
    expect(s.target.namespace).toBe("android_app");
  });

  it("pins Play's app signing certificate, not the upload certificate", () => {
    const s = statements.find(
      (x: { target?: { package_name?: string } }) => x.target?.package_name === PACKAGE
    );
    expect(s.target.sha256_cert_fingerprints).toContain(APP_SIGNING_SHA256);
  });

  it("uses well-formed SHA-256 fingerprints", () => {
    for (const s of statements) {
      for (const fp of s.target.sha256_cert_fingerprints) {
        expect(fp, fp).toMatch(/^[0-9A-F]{2}(:[0-9A-F]{2}){31}$/);
      }
    }
  });
});
