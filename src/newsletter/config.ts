import dotenv from "dotenv";
dotenv.config();

export const newsletterConfig = {
  apiKey: process.env.BEEHIIV_API_KEY || "",
  publicationId: process.env.BEEHIIV_PUBLICATION_ID || "",
  logoUrl: process.env.NEWSLETTER_LOGO_URL || "",
  avatarUrl: process.env.NEWSLETTER_AVATAR_URL || "",
  authorName: process.env.NEWSLETTER_AUTHOR_NAME || "Seif Khalil",
  authorTitle: process.env.NEWSLETTER_AUTHOR_TITLE || "CEO @ Netswick",
  linkedinUrl: process.env.NEWSLETTER_LINKEDIN_URL || "https://www.linkedin.com/in/seifkhalil/",
  youtubeUrl: process.env.NEWSLETTER_YOUTUBE_URL || "https://www.youtube.com/@seifkhalil",
  websiteUrl: process.env.NEWSLETTER_WEBSITE_URL || "https://netswick.com",
};

export function renderConfig() {
  return {
    logoUrl: newsletterConfig.logoUrl || undefined,
    avatarUrl: newsletterConfig.avatarUrl || undefined,
    authorName: newsletterConfig.authorName,
    authorTitle: newsletterConfig.authorTitle,
    linkedinUrl: newsletterConfig.linkedinUrl,
    youtubeUrl: newsletterConfig.youtubeUrl,
    websiteUrl: newsletterConfig.websiteUrl,
  };
}
