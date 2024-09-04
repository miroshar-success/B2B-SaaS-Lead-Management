export const linkedInLink = (normalizedValue: string, isCompany = false) => {
  const baseURL = isCompany
    ? "https://www.linkedin.com/company/"
    : "https://www.linkedin.com/in/";
  const fullLinkedInURL = baseURL + normalizedValue;

  return fullLinkedInURL;
};
