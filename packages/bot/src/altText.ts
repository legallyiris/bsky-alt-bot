import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { OpenAI } from 'openai'
import { config } from './config'

import type { Bot } from '@skyware/bot'

async function storeLongDescription(
  agent: Bot,
  text: string,
  post: string,
  imageIndex: number,
  generation: string,
): Promise<string> {
  const rkey = crypto.randomUUID()
  const record = {
    $type: 'dev.legallyiris.altbot.description',
    text,
    post,
    image: imageIndex,
    generation,
    createdAt: new Date().toISOString(),
  }

  const response = await agent.putRecord('dev.legallyiris.altbot.description', record, rkey)

  return response.uri
}

export type DescriptionLevel = 'short' | 'explain' | 'long' | 'text'

export function loadPrompt(filename: string): string {
  try {
    const promptPath = join(process.cwd(), 'prompts', filename)
    return readFileSync(promptPath, 'utf8')
  } catch (error) {
    console.error(`failed to load prompt: ${error}`)
    throw new Error('failed to load prompt')
  }
}

const openaiClient = new OpenAI({
  apiKey: config.ai.apiKey,
  baseURL: config.ai.baseUrl,
})

export async function getAltText(
  agent: Bot,
  imageUrl: string,
  post: string,
  imageIndex: number,
  generationId: string,
  level: DescriptionLevel = 'short',
): Promise<{ text: string; uri: string }> {
  const systemPrompt = loadPrompt(`${level}.txt`)
  const modelToUse = Array.isArray(config.ai.models) ? config.ai.models[0] : config.ai.models

  const userPrompt =
    level === 'text'
      ? "Extract and transcribe any text visible in this image. If there is no text, respond with 'No text found in image.'"
      : `Generate a ${level} alt text description for this image`

  const completion = await openaiClient.chat.completions.create({
    model: modelToUse,
    stream: false,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: userPrompt,
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
  })

  const description = completion.choices[0]?.message?.content || 'unable to generate alt text'
  const uri = await storeLongDescription(agent, description, post, imageIndex, generationId)

  const text =
    description.length > 300 && level !== 'short' ? `${description.slice(0, 297)}...` : description

  return { text, uri }
}
