import { BeehiivClient } from "../beehiiv";
import { newsletterConfig } from "../config";

async function main() {
  const client = new BeehiivClient({ apiKey: newsletterConfig.apiKey });
  const res = await client.listPublications();
  if (!res.data?.length) {
    console.log("No publications found on this API key.");
    return;
  }
  console.log(`Found ${res.data.length} publication(s):\n`);
  for (const pub of res.data) {
    console.log(`  ${pub.name}`);
    console.log(`    id: ${pub.id}`);
    if (pub.organization_name) console.log(`    org: ${pub.organization_name}`);
    console.log("");
  }
  console.log("Set BEEHIIV_PUBLICATION_ID in your .env to the id above you want to use.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  if (err.body) console.error("Body:", JSON.stringify(err.body, null, 2));
  process.exit(1);
});
