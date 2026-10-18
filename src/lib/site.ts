/** Contact details that aren't managed in EmDash's site settings */
export const EMAIL = "hi@jbithell.com";
export const LOCATION = { locality: "London", country: "GB" };

export const socialLinks = (social?: {
  github?: string;
  linkedin?: string;
  facebook?: string;
}) => ({
  github: `https://github.com/${social?.github || "jbithell"}`,
  linkedin: `https://www.linkedin.com/in/${social?.linkedin || "jbithell"}/`,
  messenger: `https://m.me/${social?.facebook || "bithellj"}`,
});
