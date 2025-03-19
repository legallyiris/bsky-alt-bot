import { Bot } from "@skyware/bot";
import { config } from "./config";

async function main() {
	const bot = new Bot({ service: config.atProto.pds });

	try {
		console.log(`logging in as ${config.atProto.identifier}`);
		await bot.login({
			identifier: config.atProto.identifier,
			password: config.atProto.password,
		});
		console.log(`logged in as ${bot.agent.handle}`);
	} catch (error) {
		console.error("error logging in", error);
		process.exit(1);
	}

	bot.on("mention", async (mention) => {
		await mention.reply({ text: "miaow ! " });
	});
}

main().catch((error) => {
	console.error(error);
});
