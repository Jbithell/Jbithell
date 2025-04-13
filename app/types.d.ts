export interface EventPortfolioObject {
  slug: string; // Url slug - unique identifier for the event
  date: string; // Date of the first performance of the event
  endDate: string; // Date of the last performance of the event
  name: string; // Name of the event
  author: string; // Author of the text / script for the event
  director: string; // Director of the event
  venue: string; // Venue of the event, seperate sub-events with a pipe character
  roles: string[];
  tags: string[];
  eventType: string;
  performancesAttended: number; // Number of performances I personally attended
  professional: boolean; // Were the performers paid?
  paid: boolean; // Was I paid to work the event?
  featuredImage: string | null;
  imageCredit: string; // Credit to display under the image
  client: string;
}
