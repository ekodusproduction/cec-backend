export const mobileValidator = (val) => {
  const regex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[56789]\d{9}$/;
  return regex.test(val);
};

export const pinCodeValidator = (val) => {
  const regex = /^[1-9][0-9]{5}$/;
  return regex.test(val);
};
