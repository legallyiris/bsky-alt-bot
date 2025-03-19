import { readFileSync } from "node:fs";
import { join } from "node:path";

import { Bot } from "@skyware/bot";
import { OpenAI } from "openai";
import { config } from "./config";

const openaiClient = new OpenAI({
	apiKey: config.ai.apiKey,
	baseURL: config.ai.baseUrl,
});

function terminalLink(text: string, url: string): string {
	return `\u001B[34m\u001B[4m\u001B]8;;${url}\u0007${text}\u001B]8;;\u0007\u001B[0m`;
}

function loadPrompt(filename: string): string {
	try {
		const promptPath = join(process.cwd(), "prompts", filename);
		return readFileSync(promptPath, "utf8");
	} catch (error) {
		console.error(`failed to load prompt: ${error}`);
		throw new Error("failed to load prompt");
	}
}

async function getAltText(imageUrl: string): Promise<string> {
	const systemPrompt = loadPrompt("system.txt");
	const modelToUse = Array.isArray(config.ai.models)
		? config.ai.models[0]
		: config.ai.models;

	const completion = await openaiClient.chat.completions.create({
		model: modelToUse,
		stream: false,
		messages: [
			{
				role: "system",
				content: systemPrompt,
			},
			{
				role: "user",
				content: [
					{
						type: "text",
						text: "Generate alt text for the following image",
					},
					{
						type: "image_url",
						image_url: {
							url: imageUrl,
						},
					},
				],
			},
		],
	});

	return (
		completion.choices[0]?.message?.content || "unable to generate alt text"
	);
}

async function main() {
	const bot = new Bot({ service: config.atProto.pds });

	try {
		console.log(`  logging in as ${config.atProto.identifier}`);
		await bot.login({
			identifier: config.atProto.identifier,
			password: config.atProto.password,
		});
		console.log(
			`✓ logged in as ${bot.profile.did} (${terminalLink(bot.profile.handle, `https://bsky.app/profile/${bot.profile.handle}`)})`,
		);
	} catch (error) {
		console.error("  error logging in", error);
		process.exit(1);
	}

	bot.on("mention", async (mention) => {
		const parent = await mention.fetchParent();
		if (!parent || !parent.embed || !parent.embed?.isImages()) return;

		console.log(
			`alt text requested for ${terminalLink(parent.uri, parent.uri)}`,
		);
		const images = parent.embed.images;
		const imageUrls = images
			.filter(
				(image): image is typeof image & { url: string } =>
					image.url !== undefined && image.url !== null,
			)
			.map((image) => image.url);

		const imageDescriptions = await Promise.all(
			imageUrls.map((url) => getAltText(url)),
		);

		let responseText = "";
		if (imageDescriptions.length > 1) {
			responseText = imageDescriptions
				.map((desc, i) => `description #${i + 1}: ${desc}`)
				.join("\n\n");
		} else {
			responseText = imageDescriptions[0];
		}

		await mention.reply({
			text: responseText,
		});
	});
}

main().catch((error) => {
	console.error(error);
});
