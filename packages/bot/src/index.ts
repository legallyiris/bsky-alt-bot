import { Bot } from '@skyware/bot'

import { type DescriptionLevel, getAltText } from './altText'
import { config } from './config'

function terminalLink(text: string, url: string): string {
  return `\u001B[34m\u001B[4m\u001B]8;;${url}\u0007${text}\u001B]8;;\u0007\u001B[0m`
}

function parseDescriptionLevel(text: string): DescriptionLevel {
  const words = text.toLowerCase().split(/\s+/)

  if (words.includes('explain')) return 'explain'
  if (words.includes('long')) return 'long'
  if (words.includes('text')) return 'text'
  return 'short'
}

export async function main() {
  const bot = new Bot({ service: config.atProto.pds })

  try {
    console.log(`  logging in as ${config.atProto.identifier}`)
    await bot.login({
      identifier: config.atProto.identifier,
      password: config.atProto.password,
    })
    console.log(
      `✓ logged in as ${bot.profile.did} (${terminalLink(
        bot.profile.handle,
        `https://bsky.app/profile/${bot.profile.handle}`,
      )})`,
    )
  } catch (error) {
    console.error('  error logging in', error)
    throw error
  }

  bot.on('mention', async (mention) => {
    const parent = await mention.fetchParent()
    if (!parent || !parent.embed || !parent.embed?.isImages()) return

    const level = parseDescriptionLevel(mention.text)
    console.log(`alt text requested (${level}) for ${terminalLink(parent.uri, parent.uri)}`)

    const images = parent.embed.images
    const generation = crypto.randomUUID()
    const imageUrls = images
      .map((image, index) => ({
        url: image.url,
        index,
      }))
      .filter(
        (image): image is typeof image & { url: string } =>
          image.url !== undefined && image.url !== null,
      )

    const imageDescriptions = await Promise.all(
      imageUrls.map((img) => getAltText(bot, img.url, parent.uri, img.index, generation, level)),
    )

    let responseText = ''
    if (imageDescriptions.length > 1) {
      responseText = imageDescriptions
        .map((desc, i) => `description #${i + 1}: ${desc.text}`)
        .join('\n\n')
    } else {
      responseText = imageDescriptions[0].text
    }

    const reply = await mention.reply(
      {
        text: responseText,
      },
      { splitLongPost: true },
    )

    const linksText = imageDescriptions
      .map((desc, i) => `description #${i + 1}: ${desc.uri}`)
      .join('\n\n')

    await reply.reply(
      {
        text: linksText,
      },
      { splitLongPost: true },
    )
  })
}

main().catch((error) => {
  console.error(error)
})
