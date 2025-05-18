import bcrypt from "bcrypt";

const hashPassword = async (password: string) => {
  try {
    const salt = 10;
    const sPassword = await bcrypt.hash(password, salt);
    return sPassword;
  } catch (error) {
    console.log("Error Hashing Password.", error);
  }
};

export default hashPassword;
