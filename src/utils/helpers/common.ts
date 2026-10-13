export const formatNumber = (number: string | number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const randomStringMaker = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return passwordRegex.test(password);
};
// export const validatePhoneNumber = (phoneNumber: string): boolean => {
//     const phoneNumberRegex = /^(?:\+880|880|01)[1-9]\d{8}$/;
//     return phoneNumberRegex.test(phoneNumber);
// }
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneNumberRegex =
    /^(?:\+?1[-.\s]?)?(?:\([2-9]\d{2}\)|[2-9]\d{2})[-.\s]?[2-9]\d{2}[-.\s]?\d{4}$/;

  return phoneNumberRegex.test(phoneNumber.trim());
};
