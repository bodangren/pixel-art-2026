import { z } from 'zod'

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

export { PROMPT_METADATA_SCHEMA, PROMPT_FILE_SCHEMA }
export type PromptMetadata = z.infer<typeof PROMPT_METADATA_SCHEMA>
export type PromptFile = z.infer<typeof PROMPT_FILE_SCHEMA>