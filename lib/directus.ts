import { createDirectus, rest, staticToken } from "@directus/sdk";

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL!)
  .with(staticToken(process.env.DIRECTUS_TOKEN!))
  .with(rest());

export default directus;
