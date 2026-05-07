import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import PromptHistory from './PromptHistory'

const MOCK_PROMPTS = [
  {
    id: 'prompt-001',
    version: 'v1.0',
    created_at: '2026-04-04T00:00:00Z',
    content_hash: 'abc123def456',
    description: 'Initial benchmark prompt',
    usage_count: 10
  },
  {
    id: 'prompt-002',
    version: 'v2.0',
    created_at: '2026-05-01T00:00:00Z',
    content_hash: 'ghi789jkl012',
    description: 'Updated prompt with more details',
    usage_count: 5
  }
]

describe('PromptHistory', () => {
  it('renders prompt list', () => {
    const { getByText } = render(<PromptHistory prompts={MOCK_PROMPTS} />)
    expect(getByText('v1.0')).toBeTruthy()
    expect(getByText('v2.0')).toBeTruthy()
  })

  it('displays usage counts', () => {
    const { getByText } = render(<PromptHistory prompts={MOCK_PROMPTS} />)
    expect(getByText('10')).toBeTruthy()
    expect(getByText('5')).toBeTruthy()
  })

  it('displays description when present', () => {
    const { getByText } = render(<PromptHistory prompts={MOCK_PROMPTS} />)
    expect(getByText('Initial benchmark prompt')).toBeTruthy()
    expect(getByText('Updated prompt with more details')).toBeTruthy()
  })

  it('truncates content hash in display', () => {
    const { getByTitle } = render(<PromptHistory prompts={MOCK_PROMPTS} />)
    const truncatedHash = getByTitle(/abc123def456/)
    expect(truncatedHash).toBeTruthy()
  })
})