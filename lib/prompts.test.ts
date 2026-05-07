import { describe, it, expect } from 'vitest'
import { listPrompts, getPromptById, getPromptByVersion, getAllPrompts, parsePromptFile } from './prompts'

const MOCK_PROMPT_CONTENT = `---
id: prompt-001
version: v1.0
created_at: 2026-04-04T00:00:00Z
content_hash: abc123def456
description: Test prompt
---

# Test Prompt

This is a test prompt content.`

describe('Prompt Loading', () => {
  describe('parsePromptFile', () => {
    it('parses valid prompt file with frontmatter', () => {
      const result = parsePromptFile(MOCK_PROMPT_CONTENT)
      expect(result.metadata.id).toBe('prompt-001')
      expect(result.metadata.version).toBe('v1.0')
      expect(result.content).toContain('Test Prompt')
    })

    it('throws on missing frontmatter', () => {
      const invalid = 'No frontmatter here'
      expect(() => parsePromptFile(invalid)).toThrow()
    })

    it('throws on empty content', () => {
      const empty = `---
id: prompt-001
version: v1.0
created_at: 2026-04-04T00:00:00Z
content_hash: abc123
---

`
      expect(() => parsePromptFile(empty)).toThrow()
    })
  })
})

describe('listPrompts', () => {
  it('returns empty array when directory does not exist', () => {
    const result = listPrompts('/nonexistent/path')
    expect(result).toEqual([])
  })
})

describe('getPromptById', () => {
  it('returns null when directory does not exist', () => {
    const result = getPromptById('prompt-001', '/nonexistent/path')
    expect(result).toBeNull()
  })
})

describe('getPromptByVersion', () => {
  it('returns null when directory does not exist', () => {
    const result = getPromptByVersion('v1.0', '/nonexistent/path')
    expect(result).toBeNull()
  })
})

describe('getAllPrompts', () => {
  it('returns empty array when directory does not exist', () => {
    const result = getAllPrompts('/nonexistent/path')
    expect(result).toEqual([])
  })
})