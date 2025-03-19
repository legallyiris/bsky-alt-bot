# altbot

a bot for bluesky that ✨ auto-magically ✨ generates alt text for images using
llms.

## what is this?

altbot aims to help blind and visually impaired users by generating descriptive
alt text for images. when mentioned in a reply to a post containing images, it
will analyze the images and respond with appropriate alt text descriptions.

## usage

1. find a post with images that need alt text
2. reply to that post and mention @altbot.legallyiris.dev
3. the bot will reply with generated alt text descriptions for each image

## setup

to run your own instance:

1. clone this repo
2. install [bun](https://bun.sh/)
3. create a `.altbotrc.json` file with your configuration (see example below)
4. install dependencies with `bun install`
5. run with `bun start`

### example configuration (`.altbotrc.json`)

```jsonc
{
  "atProto": {
    "identifier": "your-bot-handle.bsky.social",
    "password": "your-bot-password",
    "pds": "https://bsky.social",
  },
  "ai": {
    "baseUrl": "https://openrouter.ai/api/v1",
    "apiKey": "your-api-key",
    "models": "openai/gpt-4-vision", // make sure to use a model that supports vision
  },
}
```

by default, altbot uses [openrouter](https://openrouter.ai) because _it's
cheap_ and i'm a cheap bitch. you can however use any other ai provider that
supports the openai api, such as [ollama](https://ollama.ai).

---

## copying

altbot is licensed under the copyleft gnu affero general public license
v3.0 (agplv3). you can find the complete license text in the [COPYING](COPYING)
file.

all files in this repository are licensed under the same gnu affero general
public license v3.0 unless explicitly stated otherwise.

in simple terms, this means you are free to use, modify, and distribute altbot,
provided that if you distribute or use altbox in a way that allows others to
access it over a network (such as deploying it as a web application or
service), you must also make the source code of your modifications and/or the
entire application available under the same agplv3 license. this includes any
derivative works you create.

commercial use is permitted, provided you comply with the source code
distribution requirement outlined above. the license also grants patent rights.
note that the agplv3 license contains clauses regarding termination and other
legal implications.

> [!WARNING]
> this does not constitute legal advice; please read the full license text
> linked above and/or consult a lawyer if you have any questions or concerns.
