import bcrypt from 'bcrypt';
import keygen from 'keygen';
const saltRounds = 10; // Number of salt rounds

// Function to generate a salt and hash a password
const createHashPassword = async (password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
    throw new Error('Hashing failed');
  }
};

// Function to compare a password with its hash
const comparePassword = async (password: string, hashedPassword: string) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw new Error('Comparison failed');
  }
};

export const createHashPaswordAndSalt = async (plainPassword: string) => {
  return {
    passwordHash: await createHashPassword(plainPassword),
  };
};

export const validateAndComparePassword = async (plainPassword: string, passwordHash: string) => {
  try {
    return comparePassword(plainPassword, passwordHash);
  } catch (e) {
    console.error('password comparision error', e);
    return false;
  }
};

// Generates a unique hash token.
export const createUniqueHash = () => {
    return keygen.url()
}