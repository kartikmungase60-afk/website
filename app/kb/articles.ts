export const kbArticles = [
  { slug: "install-papermc", title: "How to Install PaperMC on a Minecraft Server", description: "Install or switch to PaperMC using the Hostlixo game-server software controls.", category: "Minecraft", updated: "2026-06-22", steps: [
    ["Back up the server", "Create a current backup of the world and configuration files before changing server software. Stop the server after the backup completes."],
    ["Choose PaperMC", "Open the server software area in the Hostlixo dashboard, select a PaperMC version compatible with your Minecraft release and review whether reinstalling will replace files."],
    ["Start and verify", "Start the server, review console output for errors, accept the EULA when required and confirm plugins and worlds load correctly. Restore the backup if the migration is unsuccessful."],
  ] },
  { slug: "create-vps", title: "How to Deploy and Secure a New VPS", description: "Choose a region, operating system and plan, then complete the essential first security steps.", category: "VPS", updated: "2026-06-22", steps: [
    ["Choose the workload and region", "Estimate CPU, memory, storage and bandwidth needs. Select Mumbai, Singapore, Germany or USA based on representative user routes and any location requirements."],
    ["Deploy an operating system", "Order the selected plan, choose an available operating-system image and wait for provisioning. Store the initial credentials securely and confirm console access."],
    ["Harden before production", "Install updates, create a non-default administrator account, configure SSH keys where supported, restrict firewall ports, enable backups and monitor resource use."],
  ] },
  { slug: "use-pterodactyl-panel", title: "How to Use the Hostlixo Game Server Panel", description: "Manage console, files, schedules, databases, users and server software from the dashboard.", category: "Game Panel", updated: "2026-06-22", steps: [
    ["Use the console", "Start, stop and restart the service from the server overview. Watch console output during startup and avoid repeatedly forcing power actions while the server is saving data."],
    ["Manage files and configuration", "Use the file manager or supported SFTP access to edit configuration files. Stop the service before changing files that the application rewrites during shutdown."],
    ["Create safe operations", "Use schedules for planned restarts and backups, issue database credentials only where needed, and grant additional users the minimum permissions required."],
  ] },
] as const
export function getKbArticle(slug: string) { return kbArticles.find((article) => article.slug === slug) }
