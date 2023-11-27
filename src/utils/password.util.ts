import bcrypt from 'bcrypt';
import keygen from 'keygen';
const saltRounds = 10; // Number of salt rounds

const createSalt = async (rounds = saltRounds) => {
  return bcrypt.genSalt(rounds);
};

// Function to generate a salt and hash a password
const createHashPassword = async (password: string, salt: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, salt);
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
  const passwordSalt = await createSalt();
  return {
    passwordSalt,
    passwordHash: await createHashPassword(plainPassword, passwordSalt),
  };
};

export const validateAndComparePassword = async (plainPassword: string, passwordsalt: string) => {
  try {
    const hashPassword = await createHashPassword(plainPassword, passwordsalt);
    return comparePassword(plainPassword, hashPassword);
  } catch (e) {
    console.error('password comparsion error', e);
    return false;
  }
};

// Generates a unique hash token.
export const createUniqueHash = () => {
    return keygen.url()
}