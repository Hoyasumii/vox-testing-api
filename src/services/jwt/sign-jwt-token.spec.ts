import { EmptyRepository } from "@/repositories";
import { SignJwtToken } from "./sign-jwt-token";

let service: SignJwtToken;

describe("Sign JWT Token Service", () => {
  beforeEach(() => {
    const repo = new EmptyRepository();
    service = new SignJwtToken(repo);
  });

  it("should sign a token", async () => {
    const signedToken = await service.run({ message: "Hello World" });
    expect(typeof signedToken).toBe("string");
  });
});
