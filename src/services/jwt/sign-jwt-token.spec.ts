import { SignJwtToken } from "./sign-jwt-token";

let service: SignJwtToken;

describe("Sign JWT Token Service", () => {
  beforeEach(() => {
    service = new SignJwtToken();
  });

  it("should sign a token", async () => {
    const signedToken = await service.run({ message: "Hello World" });
    expect(typeof signedToken).toBe("string");
  });
});
