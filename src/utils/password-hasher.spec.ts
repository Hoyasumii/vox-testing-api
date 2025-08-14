import * as argon2 from "argon2";
import { PasswordHasher } from "./password-hasher";

const SECRET = "Plinplin";
const PASSWORD = "MyImagination";

let hasher: PasswordHasher;

describe("PasswordHasher", () => {
  beforeEach(() => {
    hasher = new PasswordHasher(SECRET);
  })

  it("should hash a password", async () => {
    const hash = await hasher.hash(PASSWORD);
    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(0);
  });

  it("should verify a correct password", async () => {
    const hash = await hasher.hash(PASSWORD);
    const isValid = await hasher.verify(hash, PASSWORD);
    expect(isValid).toBe(true);
  });

  it("should not verify an incorrect password", async () => {
    const hash = await hasher.hash(PASSWORD);
    const isValid = await hasher.verify(hash, "wrong-password");
    expect(isValid).toBe(false);
  });

  it("should produce different hashes for different passwords", async () => {
    const hash1 = await hasher.hash(PASSWORD);
    const hash2 = await hasher.hash("AnotherPassword123");
    expect(hash1).not.toBe(hash2);
  });

  it("should produce different hashes for the same password (due to salt)", async () => {
    const hash1 = await hasher.hash(PASSWORD);
    const hash2 = await hasher.hash(PASSWORD);
    expect(hash1).not.toBe(hash2);
  });

  it("should be compatible with direct argon2 usage", async () => {
    const hasher = new PasswordHasher(SECRET);
    const hash = await hasher.hash(PASSWORD);
    const valid = await argon2.verify(hash, PASSWORD, { secret: Buffer.from(SECRET) });
    expect(valid).toBe(true);
  });
});