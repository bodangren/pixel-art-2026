import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { parse } from 'yaml'

describe('GitHub Actions CI Workflow', () => {
  const workflowPath = '.github/workflows/ci.yml'
  let workflow: ReturnType<typeof parse>

  it('ci.yml file exists', () => {
    expect(() => readFileSync(workflowPath, 'utf8')).not.toThrow()
  })

  it('parses as valid YAML', () => {
    const content = readFileSync(workflowPath, 'utf8')
    expect(() => { workflow = parse(content) }).not.toThrow()
  })

  it('has name "CI"', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    expect(parsed.name).toBe('CI')
  })

  it('triggers on push and pull_request to main', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    const on = parsed['on']
    expect(on.push).toBeDefined()
    expect(on.pull_request).toBeDefined()
    const branches = on.push?.branches ?? on.pull_request?.branches
    expect(branches).toContain('main')
  })

  it('has concurrency config to cancel duplicates', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    expect(parsed.concurrency).toBeDefined()
    expect(parsed.concurrency.group).toBeDefined()
    expect(parsed.concurrency['cancel-in-progress']).toBe(true)
  })

  it('has ci job running on ubuntu-latest', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    expect(parsed.jobs.ci).toBeDefined()
    expect(parsed.jobs.ci['runs-on']).toBe('ubuntu-latest')
  })

  it('runs on Node 20 and 22 matrix', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    const matrix = parsed.jobs.ci.strategy.matrix
    expect(matrix.node_version).toContain('20')
    expect(matrix.node_version).toContain('22')
  })

  it('checkout action is v4', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    const steps = parsed.jobs.ci.steps
    const checkout = steps.find((s: { name: string }) => s.name === 'Checkout')
    expect(checkout.uses).toBe('actions/checkout@v4')
  })

  it('has lint step', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    const steps = parsed.jobs.ci.steps
    expect(steps.some((s: { name: string; run: string }) => s.name === 'Lint' && s.run === 'npm run lint')).toBe(true)
  })

  it('has typecheck step using tsc --noEmit', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    const steps = parsed.jobs.ci.steps
    expect(steps.some((s: { name: string; run: string }) => s.name === 'Typecheck' && s.run.includes('tsc --noEmit'))).toBe(true)
  })

  it('has test step', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    const steps = parsed.jobs.ci.steps
    expect(steps.some((s: { name: string; run: string }) => s.name === 'Test' && s.run === 'npm run test')).toBe(true)
  })

  it('has build step', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    const steps = parsed.jobs.ci.steps
    expect(steps.some((s: { name: string; run: string }) => s.name === 'Build' && s.run === 'npm run build')).toBe(true)
  })

  it('has npm cache configured', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    const setupNode = parsed.jobs.ci.steps.find((s: { name: string }) => s.name?.includes('Setup Node'))
    expect(setupNode.with?.cache).toBe('npm')
  })
})