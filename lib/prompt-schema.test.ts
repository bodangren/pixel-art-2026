import { z } from 'zod'
import { describe, it, expect } from 'vitest'

const PROMPT_METADATA_SCHEMA = z.object({
  id: z.string(),
  version: z.string(),
  created_at: z.string(),
  content_hash: z.string(),
  description: z.string().optional(),
  usage_count: z.number().default(0)
})

const PROMPT_FILE_SCHEMA = z.object({
  metadata: PROMPT_METADATA_SCHEMA,
  content: z.string().min(1)
})

describe('Prompt Schema', () => {
  describe('PROMPT_METADATA_SCHEMA', () => {
    it('validates correct prompt metadata', () => {
      const valid = {
        id: 'prompt-001',
        version: 'v1.0',
        created_at: '2026-04-04T00:00:00Z',
        content_hash: 'abc123def456'
      }
      expect(() => PROMPT_METADATA_SCHEMA.parse(valid)).not.toThrow()
    })

    it('rejects missing required fields', () => {
      const invalid = {
        id: 'prompt-001'
      }
      expect(() => PROMPT_METADATA_SCHEMA.parse(invalid)).toThrow()
    })

    it('rejects invalid version format', () => {
      const invalid = {
        id: 'prompt-001',
        version: 123,
        created_at: '2026-04-04T00:00:00Z',
        content_hash: 'abc123'
      }
      expect(() => PROMPT_METADATA_SCHEMA.parse(invalid)).toThrow()
    })

    it('defaults usage_count to 0', () => {
      const minimal = {
        id: 'prompt-001',
        version: 'v1.0',
        created_at: '2026-04-04T00:00:00Z',
        content_hash: 'abc123'
      }
      const result = PROMPT_METADATA_SCHEMA.parse(minimal)
      expect(result.usage_count).toBe(0)
    })
  })

  describe('PROMPT_FILE_SCHEMA', () => {
    it('validates correct prompt file', () => {
      const valid = {
        metadata: {
          id: 'prompt-001',
          version: 'v1.0',
          created_at: '2026-04-04T00:00:00Z',
          content_hash: 'abc123def456'
        },
        content: 'Generate a pixel art asset pack...'
      }
      expect(() => PROMPT_FILE_SCHEMA.parse(valid)).not.toThrow()
    })

    it('rejects empty content', () => {
      const invalid = {
        metadata: {
          id: 'prompt-001',
          version: 'v1.0',
          created_at: '2026-04-04T00:00:00Z',
          content_hash: 'abc123'
        },
        content: ''
      }
      expect(() => PROMPT_FILE_SCHEMA.parse(invalid)).toThrow()
    })

    it('rejects missing metadata', () => {
      const invalid = {
        content: 'Generate pixel art...'
      }
      expect(() => PROMPT_FILE_SCHEMA.parse(invalid)).toThrow()
    })
  })
})

export { PROMPT_METADATA_SCHEMA, PROMPT_FILE_SCHEMA }
export type PromptMetadata = z.infer<typeof PROMPT_METADATA_SCHEMA>
export type PromptFile = z.infer<typeof PROMPT_FILE_SCHEMA>