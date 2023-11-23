declare module 'otp-generator' {
  export function generate(
    a: number,
    option?: {
      lowerCaseAlphabets?: boolean;
      upperCaseAlphabets?: boolean;
      specialChars?: boolean;
      digits?: boolean;
    },
  ) {
    return { a, option };
  }
}
