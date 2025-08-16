import { IsJwtTokenExpiringSoon } from "./is-jwt-token-expiring-soon";
import * as jwt from "jsonwebtoken";

let service: IsJwtTokenExpiringSoon;

describe("Is JWT Token Expiring Soon Service", () => {
  beforeEach(() => {
    service = new IsJwtTokenExpiringSoon();
  });

  it("should return true if exp is near to expire", async () => {
    const genericToken = jwt.sign({ data: "testing" }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: "14m",
    });

    await expect(service.run(genericToken)).resolves.toBeTruthy();
  });

  it("should return false if exp isn't near to expire", async () => {
    const genericToken = jwt.sign({ data: "testing" }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: "16m",
    });

    await expect(service.run(genericToken)).resolves.toBeFalsy();
  });

  it("should throws a JsonWebTokenError if the token is invalid", async () => {
    await expect(service.run("generic-jwt")).rejects.toBeInstanceOf(
      jwt.JsonWebTokenError
    );
  });
});
