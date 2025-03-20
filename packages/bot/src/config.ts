import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { z } from 'zod'

const atProtoSchema = z.object({
  pds: z.string().url().default('https://bsky.social'),
  identifier: z.string(),
  password: z.string(),
})

const aiSchema = z.object({
  baseUrl: z.string().url().default('https://openrouter.ai/api/v1'),
  apiKey: z.string(),
  models: z.union([z.string(), z.array(z.string())]),
})

const webSchema = z.object({
  baseUrl: z.string().url(),
})

const configSchema = z.object({
  atProto: atProtoSchema,
  ai: aiSchema,
  web: webSchema,
})

export type Config = z.infer<typeof configSchema>

const loadConfig = (filepath: string): Config => {
  const cwd = process.cwd()
  const configPath = join(cwd, filepath)

  try {
    const config = readFileSync(configPath, 'utf8')
    return configSchema.parse(JSON.parse(config))
  } catch (error) {
    if (error instanceof z.ZodError) {
      for (const issue of error.issues) {
        console.error(`invalid config: ${issue.path.join('.')}: ${issue.message}`)
      }
      process.exit(1)
    } else if (error instanceof Error) {
      if (error.message.includes('ENOENT: no such file or directory')) {
        console.error(`config file not found: ${configPath}`)
      } else {
        console.error(`failed to parse config file: ${error.message}`)
      }
      process.exit(1)
    }

    throw new Error('failed to load config')
  }
}

export const config = loadConfig(process.env.CONFIG_FILE || '.altbotrc.json')
