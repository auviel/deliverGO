import "dotenv/config";

import { createDoorDashBusinessClient } from "@/lib/integrations/delivery/doordash/business-client";
import { getDoorDashConfig } from "@/lib/integrations/delivery/doordash/config";

async function main() {
  const config = getDoorDashConfig();
  const client = createDoorDashBusinessClient();
  const stores = await client.listStores();

  console.log(`DoorDash stores for business "${config.externalBusinessId}":\n`);

  if (stores.length === 0) {
    console.log("  (none — run npm run doordash:register-store)");
    return;
  }

  for (const store of stores) {
    console.log(`  external_store_id: ${store.external_store_id}`);
    console.log(`  name:            ${store.name}`);
    console.log(`  address:         ${store.address}`);
    console.log(`  phone:           ${store.phone_number}`);
    console.log(`  status:          ${store.status ?? "unknown"}`);
    console.log("");
  }
}

main().catch((error) => {
  console.error(
    "Failed to list DoorDash stores:",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
