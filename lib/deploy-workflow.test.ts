import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { parse } from 'yaml'

describe('GitHub Actions Deploy Workflow', () => {
  const workflowPath = '.github/workflows/deploy.yml'

  it('deploy.yml file exists', () => {
    expect(() => readFileSync(workflowPath, 'utf8')).not.toThrow()
  })

  it('parses as valid YAML', () => {
    const content = readFileSync(workflowPath, 'utf8')
    expect(() => { parse(content) }).not.toThrow()
  })

  it('has name "Deploy"', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    expect(parsed.name).toBe('Deploy')
  })

  it('triggers only on push to main', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    const on = parsed['on']
    expect(on.push).toBeDefined()
    expect(on.push.branches).toContain('main')
  })

  it('has deploy job running on ubuntu-latest', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    expect(parsed.jobs.deploy).toBeDefined()
    expect(parsed.jobs.deploy['runs-on']).toBe('ubuntu-latest')
  })

  it('deploy job only runs on main branch', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    const job = parsed.jobs.deploy
    expect(job['if']).toContain('main')
  })

  it('has Vercel deployment step', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    const steps = parsed.jobs.deploy.steps
    const vercelStep = steps.find((s: { name: string }) => s.name === 'Deploy to Vercel')
    expect(vercelStep).toBeDefined()
  })

  it('has environment protection for production', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    const job = parsed.jobs.deploy
    expect(job.environment).toBeDefined()
    expect(job.environment.url).toBeDefined()
  })

  it('checkout action is v4', () => {
    const content = readFileSync(workflowPath, 'utf8')
    const parsed = parse(content)
    const steps = parsed.jobs.deploy.steps
    const checkout = steps.find((s: { name: string }) => s.name === 'Checkout')
    expect(checkout.uses).toBe('actions/checkout@v4')
  })
})