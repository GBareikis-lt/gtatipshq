import { siteConfig } from "@/lib/site-config";
import type { FaqItem } from "@/components/faq";

/** Quick-fact stats shown under the hero. */
export const quickFacts = [
  { label: "Release date", value: siteConfig.releaseDateLabel },
  { label: "Setting", value: "Leonida (Vice City)" },
  { label: "Protagonists", value: "Lucia & Jason" },
  { label: "Platforms", value: "PS5 · Xbox Series X|S" },
];

/** "What is GTA 6" key info cards for the SEO info section. */
export const gameInfo = [
  {
    title: "A return to Vice City",
    body: "GTA 6 is set in the modern-day state of Leonida, home to the neon-soaked, Miami-inspired Vice City and its surrounding beaches, swamps and keys — the largest and most detailed world Rockstar has ever built.",
  },
  {
    title: "Two leads, one story",
    body: "For the first time in the series, you follow a duo: Lucia and her partner Jason. Their Bonnie-and-Clyde story drives a campaign that weaves between both characters.",
  },
  {
    title: "A living, breathing world",
    body: "Dynamic weather, denser crowds, reactive AI and a heavily upgraded physics engine make Leonida feel alive — from social-media-obsessed locals to ever-changing in-world events.",
  },
  {
    title: "Online from the ground up",
    body: "Rockstar is building the next evolution of online play on the foundations of GTA 6, designed to grow for years after launch with new content, heists and businesses.",
  },
];

/** FAQ used on the homepage and emitted as FAQPage structured data. */
export const faqItems: FaqItem[] = [
  {
    question: "When is GTA 6 coming out?",
    answer: `Rockstar Games has GTA 6 scheduled for ${siteConfig.releaseDateLabel}. Release windows can shift, so our live countdown always reflects the latest confirmed date and we update it the moment Rockstar announces a change.`,
  },
  {
    question: "What platforms will GTA 6 release on?",
    answer:
      "GTA 6 launches first on PlayStation 5 and Xbox Series X|S. A PC version has not been dated yet, but — as with previous Grand Theft Auto titles — it is widely expected to follow some time after the console release.",
  },
  {
    question: "Where does GTA 6 take place?",
    answer:
      "The game is set in the fictional state of Leonida, a reimagining of Florida centred on a modern Vice City. It is the biggest and most detailed open world Rockstar has ever created.",
  },
  {
    question: "Who are the main characters in GTA 6?",
    answer:
      "GTA 6 stars a duo, Lucia and Jason. Lucia is the first playable female protagonist in the modern GTA era, and the story follows the two of them in a crime-spree narrative inspired by Bonnie and Clyde.",
  },
  {
    question: "Will there be a GTA 6 money guide and tips?",
    answer:
      "Yes. GTATipsHQ publishes beginner guides, money-making methods, mission walkthroughs and hidden-secret tips. Many are prepared now from trailers and official info, then expanded with verified in-game methods as soon as the game launches.",
  },
  {
    question: "Is GTATipsHQ official?",
    answer:
      "No. GTATipsHQ is an independent fan site. We are not affiliated with Rockstar Games or Take-Two Interactive. Grand Theft Auto and GTA are trademarks of Take-Two Interactive.",
  },
];
