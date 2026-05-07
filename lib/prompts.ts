import { parse as parseYaml } from 'yaml'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { PROMPT_FILE_SCHEMA, type PromptFile } from './prompt-schema'

function parsePromptFile(content: string): PromptFile {
  const parts = content.split('---')
  if (parts.length < 3) {
    throw new Error('Invalid prompt file format: missing YAML frontmatter')
  }

  const yamlContent = parts[1].trim()
  const bodyContent = parts.slice(2).join('---').trim()

  const metadata = parseYaml(yamlContent) as object

  return PROMPT_FILE_SCHEMA.parse({
    metadata,
    content: bodyContent
  })
}

function listPrompts(promptsDir: string = 'prompts'): string[] {
  try {
    return readdirSync(promptsDir)
      .filter(f => f.endsWith('.md'))
      .sort()
  } catch {
    return []
  }
}

function getPromptById(id: string, promptsDir: string = 'prompts'): PromptFile | null {
  const prompts = listPrompts(promptsDir)

  for (const filename of prompts) {
    const filepath = join(promptsDir, filename)
    try {
      const content = readFileSync(filepath, 'utf-8')
      const prompt = parsePromptFile(content)
      if (prompt.metadata.id === id) {
        return prompt
      }
    } catch {
      continue
    }
  }

  return null
}

function getPromptByVersion(version: string, promptsDir: string = 'prompts'): PromptFile | null {
  const prompts = listPrompts(promptsDir)

  for (const filename of prompts) {
    const filepath = join(promptsDir, filename)
    try {
      const content = readFileSync(filepath, 'utf-8')
      const prompt = parsePromptFile(content)
      if (prompt.metadata.version === version) {
        return prompt
      }
    } catch {
      continue
    }
  }

  return null
}

function getAllPrompts(promptsDir: string = 'prompts'): PromptFile[] {
  const prompts: PromptFile[] = []
  const files = listPrompts(promptsDir)

  for (const filename of files) {
    const filepath = join(promptsDir, filename)
    try {
      const content = readFileSync(filepath, 'utf-8')
      prompts.push(parsePromptFile(content))
    } catch {
      continue
    }
  }

  return prompts
}

export { parsePromptFile, listPrompts, getPromptById, getPromptByVersion, getAllPrompts }
export type { PromptFile }