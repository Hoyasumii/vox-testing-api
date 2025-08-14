import { EmptyRepository } from "@/repositories";
import { RefreshJwtToken } from "./refresh-jwt-token";
import * as jwt from "jsonwebtoken";

let service: RefreshJwtToken;

describe("Refresh JWT Token Service", () => {
  beforeEach(() => {
    const repo = new EmptyRepository();
    service = new RefreshJwtToken(repo);
  });

  it("should refresh a token", async () => {
    const newToken = jwt.sign(
      { userId: "123" },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: "1h",
      }
    );

    await expect(service.run(newToken)).resolves.toBeDefined();
  });

  it("should not refresh a token if the token is invalid", async () => {
    await expect(service.run("generic-token-abc")).rejects.toBeInstanceOf(
      jwt.JsonWebTokenError
    );
  });
});
