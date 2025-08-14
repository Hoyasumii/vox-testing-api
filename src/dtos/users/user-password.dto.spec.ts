import { UserPasswordDTO } from "./user-password.dto";

describe("Password Schema Testing", () => {
  it("should accept a normal password", () => {
    expect(UserPasswordDTO.safeParse("NormalPassword-123").success).toBeTruthy();
  });

  it("should not accept a password with 6 characters", () => {
    expect(UserPasswordDTO.safeParse("Frk-12").success).toBeFalsy();
  });

  it("should not accept a password without lowercase letters", () => {
    expect(UserPasswordDTO.safeParse("PASS-12").success).toBeFalsy();
  });

  it("should not accept a password without uppercase letters", () => {
    expect(UserPasswordDTO.safeParse("pass-12").success).toBeFalsy();
  });
  
  it("should not accept a password without a special charater", () => {
    expect(UserPasswordDTO.safeParse("Pass123").success).toBeFalsy();
  });
});