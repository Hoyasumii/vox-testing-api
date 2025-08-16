import { VerifyJwtToken } from "./verify-jwt-token";
import * as jwt from "jsonwebtoken";

let service: VerifyJwtToken;

describe("Verify JWT Token Service", () => {
  beforeEach(() => {
    service = new VerifyJwtToken();
  });

  it("should verify a token", async () => {
    const userToken = jwt.sign(
      { userId: "testing" },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: "1h" }
    );

    await expect(service.run(userToken)).resolves.toBeDefined();
  });

  it("should not verify a token if the token is invalid", async () => {
    await expect(service.run("generic-token")).rejects.toBeInstanceOf(
      jwt.JsonWebTokenError
    );
  });

  it("should not verify a token if the token is expired", async () => {
    const userToken = jwt.sign(
      { userId: "testing" },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: "0s" }
    );

    await expect(service.run(userToken)).rejects.toBeInstanceOf(
      jwt.TokenExpiredError
    );
  });
});
