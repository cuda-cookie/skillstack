#!/usr/bin/env node

import { resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { createInterface } from 'node:readline'
import { detectTechnologies, collectSkills, parseSkillPath } from './lib.mjs'

// ── ANSI Colors ───────────────────────────────────────────────

const bold = (s) => `\x1b[1m${s}\x1b[22m`
const dim = (s) => `\x1b[2m${s}\x1b[22m`
const green = (s) => `\x1b[32m${s}\x1b[39m`
const yellow = (s) => `\x1b[33m${s}\x1b[39m`
const cyan = (s) => `\x1b[36m${s}\x1b[39m`
const red = (s) => `\x1b[31m${s}\x1b[39m`
const white = (s) => `\x1b[97m${s}\x1b[39m`
const HIDE_CURSOR = '\x1b[?25l'
const SHOW_CURSOR = '\x1b[?25h'

// ── Terminal UI ───────────────────────────────────────────────

function prompt(question) {
  if (!process.stdin.isTTY) return Promise.resolve('y')
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim().toLowerCase())
    })
  })
}

function printBanner() {
  console.log()
  console.log(bold(cyan('   ╔═══════════════════════════════════════╗')))
  console.log(bold(cyan('   ║')) + bold('   autoskills                          ') + bold(cyan('║')))
  console.log(bold(cyan('   ║')) + dim('   Auto-install the best AI skills     ') + bold(cyan('║')))
  console.log(bold(cyan('   ║')) + dim('   for your project                    ') + bold(cyan('║')))
  console.log(bold(cyan('   ╚═══════════════════════════════════════╝')))
  console.log()
}

/**
 * Interactive multi-select: arrow keys to move, space to toggle, enter to confirm.
 * All items are selected by default. Returns the filtered list of selected items.
 */
function multiSelect(items, { labelFn, hintFn }) {
  if (!process.stdin.isTTY) return Promise.resolve(items)

  return new Promise((resolve) => {
    const selected = new Array(items.length).fill(true)
    let cursor = 0
    let rendered = false

    function render() {
      if (rendered) {
        // Move up: items + blank line + instruction line (no trailing \n)
        process.stdout.write(`\x1b[${items.length + 1}A\r`)
      }
      rendered = true
      // Clear from cursor to end of screen to avoid leftover artifacts
      process.stdout.write('\x1b[J')
      draw()
    }

    function draw() {
      const count = selected.filter(Boolean).length

      for (let i = 0; i < items.length; i++) {
        const pointer = i === cursor ? cyan('❯') : ' '
        const check = selected[i] ? green('◼') : dim('◻')
        const label = labelFn(items[i], i)
        const hint = hintFn ? hintFn(items[i], i) : ''
        const line = selected[i] ? label : dim(label)
        process.stdout.write(`   ${pointer} ${check} ${line}${hint ? '  ' + dim(hint) : ''}\n`)
      }
      process.stdout.write('\n')
      process.stdout.write(
        dim('   ') +
        white(bold('[↑↓]')) + dim(' move · ') +
        white(bold('[space]')) + dim(' toggle · ') +
        white(bold('[a]')) + dim(' all · ') +
        white(bold('[enter]')) + dim(` confirm (${count}/${items.length})`)
      )
    }

    process.stdout.write(HIDE_CURSOR)
    render()

    const { stdin } = process
    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf-8')

    function onData(key) {
      if (key === '\x03') {
        cleanup()
        process.stdout.write(SHOW_CURSOR + '\n')
        process.exit(0)
      }

      if (key === '\r' || key === '\n') {
        cleanup()
        // Clear blank + instruction lines, keep items visible
        process.stdout.write('\x1b[1A\r\x1b[J')
        process.stdout.write(SHOW_CURSOR)
        const result = items.filter((_, i) => selected[i])
        resolve(result)
        return
      }

      if (key === ' ') {
        selected[cursor] = !selected[cursor]
        render()
        return
      }

      if (key === 'a') {
        const allSelected = selected.every(Boolean)
        selected.fill(!allSelected)
        render()
        return
      }

      if (key === '\x1b[A' || key === 'k') {
        cursor = (cursor - 1 + items.length) % items.length
        render()
        return
      }
      if (key === '\x1b[B' || key === 'j') {
        cursor = (cursor + 1) % items.length
        render()
        return
      }
    }

    function cleanup() {
      stdin.setRawMode(false)
      stdin.pause()
      stdin.removeListener('data', onData)
    }

    stdin.on('data', onData)
  })
}

// ── Installation ──────────────────────────────────────────────

function installSkill(skillPath) {
  const { repo, skillName } = parseSkillPath(skillPath)
  return new Promise((resolve) => {
    const child = spawn('npx', ['-y', 'skills', 'add', repo, '--skill', skillName, '-y'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    let output = ''
    child.stdout?.on('data', (d) => { output += d.toString() })
    child.stderr?.on('data', (d) => { output += d.toString() })

    child.on('close', (code) => {
      resolve({ success: code === 0, output })
    })

    child.on('error', (err) => {
      resolve({ success: false, output: err.message })
    })
  })
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const autoYes = args.includes('-y') || args.includes('--yes')
  const dryRun = args.includes('--dry-run')

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
  ${bold('autoskills')} — Auto-install the best AI skills for your project

  ${bold('Usage:')}
    npx autoskills            Detect & install skills
    npx autoskills ${dim('-y')}        Skip confirmation
    npx autoskills ${dim('--dry-run')} Show what would be installed

  ${bold('Options:')}
    -y, --yes       Skip confirmation prompt
    --dry-run       Show skills without installing
    -h, --help      Show this help message

`)
    process.exit(0)
  }

  printBanner()

  const projectDir = resolve('.')

  // ── Detect technologies
  process.stdout.write(dim('   Scanning project...\r'))
  const { detected, isFrontend, combos } = detectTechnologies(projectDir)
  process.stdout.write('\x1b[K')

  if (detected.length === 0) {
    console.log(yellow('   ⚠ No supported technologies detected.'))
    console.log(dim('   Make sure you run this in a project directory.'))
    console.log()
    process.exit(0)
  }

  // ── Show detected technologies
  const withSkills = detected.filter((t) => t.skills.length > 0)
  const withoutSkills = detected.filter((t) => t.skills.length === 0)

  console.log(bold('   Detected technologies:'))
  console.log()

  for (const tech of withSkills) {
    console.log(green(`     ✔ ${tech.name}`))
  }
  for (const tech of withoutSkills) {
    console.log(dim(`     ● ${tech.name}`) + dim(' (no skills yet)'))
  }

  if (combos.length > 0) {
    console.log()
    console.log(bold('   Detected combos:'))
    console.log()
    for (const combo of combos) {
      console.log(cyan(`     ⚡ ${combo.name}`))
    }
  }
  console.log()

  // ── Collect unique skills
  const skills = collectSkills(detected, isFrontend, combos)

  if (skills.length === 0) {
    console.log(yellow('   No skills available for your stack yet.'))
    console.log(dim('   Check https://skills.sh for the latest.'))
    console.log()
    process.exit(0)
  }

  const skillNames = skills.map((s) => parseSkillPath(s.skill).skillName)
  const maxSkillLen = Math.max(...skillNames.map((n) => n.length))

  // ── Dry run: just list and exit
  if (dryRun) {
    console.log(bold(`   Skills to install ${dim(`(${skills.length})`)}:`))
    console.log()
    for (let i = 0; i < skills.length; i++) {
      const { skillName } = parseSkillPath(skills[i].skill)
      const { sources } = skills[i]
      const pad = ' '.repeat(maxSkillLen - skillName.length)
      const num = String(i + 1).padStart(2, ' ')
      console.log(dim(`   ${num}.`) + ` ${cyan(skillName)}${pad}  ${dim(`← ${sources.join(', ')}`)}`)
    }
    console.log()
    console.log(dim('   --dry-run: nothing was installed.'))
    console.log()
    process.exit(0)
  }

  // ── Interactive select or auto-yes
  let selectedSkills

  if (autoYes) {
    console.log(bold(`   Skills to install ${dim(`(${skills.length})`)}:`))
    console.log()
    for (let i = 0; i < skills.length; i++) {
      const { skillName } = parseSkillPath(skills[i].skill)
      const { sources } = skills[i]
      const pad = ' '.repeat(maxSkillLen - skillName.length)
      const num = String(i + 1).padStart(2, ' ')
      console.log(dim(`   ${num}.`) + ` ${cyan(skillName)}${pad}  ${dim(`← ${sources.join(', ')}`)}`)
    }
    console.log()
    selectedSkills = skills
  } else {
    console.log(bold(`   Select skills to install ${dim(`(${skills.length} found)`)}:`))
    console.log()

    selectedSkills = await multiSelect(skills, {
      labelFn: (s) => {
        const { skillName } = parseSkillPath(s.skill)
        return skillName + ' '.repeat(maxSkillLen - skillName.length)
      },
      hintFn: (s) => `← ${s.sources.join(', ')}`,
    })

    if (selectedSkills.length === 0) {
      console.log()
      console.log(dim('   Nothing selected.'))
      console.log()
      process.exit(0)
    }
  }

  console.log()

  // ── Install skills
  let installed = 0
  let failed = 0

  for (const { skill } of selectedSkills) {
    const { skillName } = parseSkillPath(skill)
    process.stdout.write(dim(`   ◌ ${skillName}...`))

    const result = await installSkill(skill)

    process.stdout.write('\r\x1b[K')

    if (result.success) {
      console.log(green(`   ✔ ${skillName}`))
      installed++
    } else {
      console.log(red(`   ✘ ${skillName}`) + dim(' — failed'))
      failed++
    }
  }

  // ── Summary
  console.log()
  if (failed === 0) {
    console.log(
      green(bold(`   ✔ Done! ${installed} skills installed.`)),
    )
  } else {
    console.log(
      yellow(
        `   Done: ${green(`${installed} installed`)}, ${red(`${failed} failed`)}.`,
      ),
    )
  }
  console.log()
}

main().catch((err) => {
  console.error(red(`\n   Error: ${err.message}\n`))
  process.exit(1)
})
