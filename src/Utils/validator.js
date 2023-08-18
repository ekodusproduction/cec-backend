export const mobileValidator = (val) => {
    const regex = /^[5-9]\d{9}$/;
    return regex.test(val);
};
