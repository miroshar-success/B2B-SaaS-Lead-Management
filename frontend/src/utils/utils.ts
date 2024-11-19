export const linkedInLink = (normalizedValue: string, isCompany = false) => {
  const baseURL = isCompany
    ? "https://www.linkedin.com/company/"
    : "https://www.linkedin.com/in/";
  const fullLinkedInURL = baseURL + normalizedValue;

  return fullLinkedInURL;
};

export const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url).origin;
    return `${domain}/favicon.ico`;
  } catch (error) {
    console.error("Invalid URL:", url);
    return "";
  }
};
