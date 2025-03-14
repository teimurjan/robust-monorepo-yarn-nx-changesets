const passwordValidator = (
  value: string | null | undefined
): boolean | string => {
  if (!value || !/^[a-zA-Z0-9]{8,20}$/.test(value)) {
    return "Password must be between 8 and 20 characters long and contain only letters and numbers";
  }

  return true;
};

export default passwordValidator;
