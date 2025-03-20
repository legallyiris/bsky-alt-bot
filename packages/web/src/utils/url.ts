export function getBskyUrl(atUri: string): string {
  try {
    const [, , did, , rkey] = atUri.split('/')
    return `https://bsky.app/profile/${did}/post/${rkey}`
  } catch (error) {
    console.error('error parsing atUri:', error)
    return '#'
  }
}
