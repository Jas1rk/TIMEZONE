const generateOrderid = (length = 6) => {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits.charAt(randomIndex);
  }

  return otp;
};

module.exports = generateOrderid;
