const usernameValidator = (
  value: string | null | undefined
): boolean | string => {
  if (!value || !/^[a-zA-Z0-9]{3,20}$/.test(value)) {
    return "Username must be between 3 and 20 characters long and contain only letters and numbers";
  }

  return true;
};

export default usernameValidator;
