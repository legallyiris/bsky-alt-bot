import { readFileSync } from "node:fs";
import { join } from "node:path";

import { OpenAI } from "openai";
import { config } from "./config";

export type DescriptionLevel = "short" | "explain" | "long" | "text";

export function loadPrompt(filename: string): string {
	try {
		const promptPath = join(process.cwd(), "prompts", filename);
		return readFileSync(promptPath, "utf8");
	} catch (error) {
		console.error(`failed to load prompt: ${error}`);
		throw new Error("failed to load prompt");
	}
}

const openaiClient = new OpenAI({
	apiKey: config.ai.apiKey,
	baseURL: config.ai.baseUrl,
});

export async function getAltText(
	imageUrl: string,
	level: DescriptionLevel = "short",
): Promise<string> {
	const systemPrompt = loadPrompt(`${level}.txt`);
	const modelToUse = Array.isArray(config.ai.models)
		? config.ai.models[0]
		: config.ai.models;

	const userPrompt =
		level === "text"
			? "Extract and transcribe any text visible in this image. If there is no text, respond with 'No text found in image.'"
			: `Generate a ${level} alt text description for this image`;

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
						text: userPrompt,
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
