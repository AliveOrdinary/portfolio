export type Featured = {
  slug: string;
  name: string;
  summary: string;
  where: string;
  before: string;
  now: string;
  status: string;
  stack: string[];
};

export const featured: Featured[] = [
  {
    slug: 'sortlog',
    name: 'Sortlog',
    summary: 'Daily sorting reports and hours for a containment-sorting crew at IQ Automotive Services.',
    where: 'A containment-sorting crew at a customer plant near Toronto. I work on this floor.',
    before: 'One Excel workbook per part, filled in by hand at the end of every shift. Hours typed again into a separate sheet.',
    now: 'Photograph the skid labels. The app reads the barcodes, files each skid under its part, works out everyone’s times and builds the reports in IQ’s own format.',
    status: 'Used every shift since late September 2026',
    stack: ['Next.js 16', 'Supabase', 'Barcode reading in the browser', 'Claude Haiku', 'ExcelJS', 'jsPDF'],
  },
  {
    slug: '613-automotive',
    name: '613 Automotive',
    summary: 'Estimates, work orders, inspections and invoices for a collision and mechanical shop.',
    where: 'The front desk and the bays of a body, paint and mechanical shop in Kingston, Ontario.',
    before: 'No real paperwork. Sample estimates made in ChatGPT, totals worked out on a calculator.',
    now: 'A job moves from estimate to paid in one place, prints four documents, and the inspection is filled in on a phone in the bay. I also redrew their logo into a brand for the app and paperwork.',
    status: 'In live testing at the shop, October 2026',
    stack: ['Next.js 16', 'Supabase', 'jsPDF', 'Tailwind 4', 'Vitest', 'NHTSA VIN decoder'],
  },
  {
    slug: 'amplifier',
    name: 'Amplifier',
    summary: 'A reference library Claude scores, and a visual brief that finds what a client actually likes, not just what they say.',
    where: 'Amplifier, the small design studio I’m a partner in.',
    before: 'A tagged reference library nobody kept up, and first meetings that started from a few adjectives and a guess.',
    now: 'Clients spend about eight minutes choosing between images on their phone. The studio gets a prep page: what they said, what they chose, where the two disagree, and a starter moodboard.',
    status: 'Rebuilt October 2026, in testing with the studio',
    stack: ['Next.js 16', 'Supabase and pgvector', 'Claude Sonnet', 'Voyage multimodal embeddings'],
  },
];

export const alsoBuilt = [
  {
    name: 'Francis, art director portfolio',
    note: 'Image-heavy portfolio on a free CMS the client edits himself.',
    href: 'https://francisdes.com',
    domain: 'francisdes.com',
  },
  {
    name: 'Eldhose Kuriyan, portfolio rebuild',
    note: 'Moved a Framer site to plain HTML, CSS and JavaScript. Same design, faster, and features Framer couldn’t do.',
    href: 'https://eldhosekuriyan.com',
    domain: 'eldhosekuriyan.com',
  },
];

export const tools = [
  { group: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Astro', 'Tailwind', 'Canvas API and Fabric.js'] },
  { group: 'Backend and data', items: ['Supabase: Postgres, auth, row-level security, storage', 'Node.js', 'SQL migrations tested in PGlite'] },
  { group: 'AI and automation', items: ['Claude API: vision, structured extraction', 'Gemini API', 'n8n pipelines', 'Instagram and Facebook publishing'] },
  { group: 'Paperwork and the floor', items: ['PDFs with jsPDF', 'Excel with live formulas (ExcelJS)', 'Barcode reading in the browser', 'Phone camera capture'] },
  { group: 'Deploy', items: ['Google Cloud (Associate Cloud Engineer)', 'Vercel', 'Netlify', 'Cloudflare', 'Git'] },
];
