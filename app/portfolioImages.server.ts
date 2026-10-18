import { getImageFromManifest } from "./images";
import portfolioImages from "./images/portfolio.json";

export const getPortfolioImage = (featuredImage: string | null) =>
  featuredImage
    ? getImageFromManifest(portfolioImages, "portfolio/" + featuredImage)
    : null;
