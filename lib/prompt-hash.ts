import { createHash } from 'crypto'

function hashPromptContent(content: string): string {
  return createHash('sha256').update(content, 'utf-8').digest('hex')
}

export { hashPromptContent }