import { useMemo, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Progress,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react'
import api, { API_BASE, authFetch } from '../api'
import {
  BLOCKS,
  GENERIC_EXAMPLES,
  PRESETS,
  type BlockKey,
  type Preset,
} from '../data/presets'
import {
  BlockField,
  Callout,
  MicroLabel,
  OutputCard,
  PresetCard,
  Stepper,
} from './labKit'

const LAB_MODEL = 'gpt-5.4-mini'

type Step = 'data' | 'build' | 'run'

interface RunResult {
  stdout: string
  stderr: string
  exit_code: number | null
  image_base64: string | null
  timed_out: boolean
  timeout_seconds?: number
}

const emptyBlocks = (): Record<BlockKey, string> =>
  Object.fromEntries(BLOCKS.map((b) => [b.key, ''])) as Record<BlockKey, string>

function parseCsvPreview(csv: string, maxRows = 8) {
  const lines = csv.trim().split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) return null
  const header = lines[0].split(',')
  const rows = lines.slice(1, 1 + maxRows).map((l) => l.split(','))
  return { header, rows, total: lines.length - 1 }
}

export default function PythonLab() {
  const toast = useToast({ position: 'top', duration: 3000, isClosable: true })
  const [step, setStep] = useState<Step>('data')
  const [presetKey, setPresetKey] = useState<string | null>(null)
  const [ownCsv, setOwnCsv] = useState('')
  const [blocks, setBlocks] = useState<Record<BlockKey, string>>(emptyBlocks)
  const [running, setRunning] = useState(false)
  const [runResult, setRunResult] = useState<RunResult | null>(null)
  const [coachOutput, setCoachOutput] = useState('')
  const [coachRunning, setCoachRunning] = useState(false)

  const preset: Preset | null =
    PRESETS.find((p) => p.key === presetKey) ?? null
  const isOwn = presetKey === 'own'
  const csv = isOwn ? ownCsv : preset?.csv ?? ''
  const examples = preset?.examples ?? GENERIC_EXAMPLES
  const question = preset
    ? preset.question
    : 'Your own mission: pick a question your data can answer.'
  const preview = useMemo(() => parseCsvPreview(csv), [csv])

  const filledCount = BLOCKS.filter((b) => blocks[b.key].trim()).length

  const script = useMemo(() => {
    const parts: string[] = [
      'import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt',
      'df = pd.read_csv("data.csv")  # the lab puts your dataset here',
    ]
    BLOCKS.forEach((b, i) => {
      const value = blocks[b.key].trim()
      if (value) parts.push(`# ${i + 1} · ${b.label} — ${b.topic.toLowerCase()}\n${value}`)
    })
    return parts.join('\n\n')
  }, [blocks])

  const setBlock = (key: BlockKey, value: string) =>
    setBlocks((prev) => ({ ...prev, [key]: value }))

  const chooseData = () => {
    if (!csv.trim() || !preview) {
      toast({
        status: 'warning',
        title: isOwn
          ? 'Paste some CSV first — a header line plus a few rows.'
          : 'Pick a dataset first.',
      })
      return
    }
    setStep('build')
  }

  const runScript = async () => {
    const missing = BLOCKS.filter((b) => !b.optional && !blocks[b.key].trim())
    if (missing.length > 0) {
      toast({
        status: 'warning',
        title: 'A few blocks are still empty',
        description: `Fill in: ${missing.map((b) => b.label).join(', ')}. The optional ones may wait.`,
      })
      return
    }
    setRunning(true)
    try {
      const res = await api.post('/python/run', { code: script, csv })
      setRunResult(res.data)
      setCoachOutput('')
      setStep('run')
    } catch (error: any) {
      toast({
        status: 'error',
        title:
          error?.response?.data?.detail ||
          'Could not reach the lab server. Is the backend running?',
      })
    } finally {
      setRunning(false)
    }
  }

  const copyScript = async () => {
    await navigator.clipboard.writeText(script)
    toast({
      status: 'success',
      title: 'Copied! It runs anywhere with data.csv next to it.',
    })
  }

  const buildCoachPrompt = () => {
    const ran = runResult
    const outcome = ran?.timed_out
      ? `The script was stopped after ${ran.timeout_seconds ?? 15} seconds (probably an endless loop).`
      : `Exit code: ${ran?.exit_code}\n\nPrinted output:\n${ran?.stdout || '(nothing printed)'}\n\nErrors:\n${ran?.stderr || '(no errors)'}`
    const hasError = Boolean(ran?.timed_out || (ran?.exit_code ?? 0) !== 0)
    return `Task context: You are a friendly Python coach on the last afternoon of a two-day beginner course. The course covered: variables & datatypes, lists, dicts, logic & functions, NumPy, pandas and matplotlib. The participant just built their first complete analysis script out of building blocks.

Request: Review the participant's script and what happened when it ran, and coach them.

The mission they chose:
${question}

The dataset columns: ${preview?.header.join(', ') ?? 'unknown'}

Their script:
${script}

What happened when it ran:
${outcome}

Output format: answer in exactly this structure with markdown headings:
${hasError ? `## Fix the error first
Explain in plain language what the error means, point at the exact line, and show the corrected line in a code block.
` : ''}## Did the script answer the mission?
One honest, encouraging paragraph.
## What each part does
One bullet per course topic the script actually uses (variables, lists, dicts, functions, NumPy, pandas, matplotlib) — one plain-language sentence each about THEIR code, not generic theory.
## One thing to try next
One small, concrete improvement with a short code snippet.

Write in English, warm and concise. No headings other than the ones above.`
  }

  const askCoach = async () => {
    setCoachRunning(true)
    setCoachOutput('')
    try {
      const res = await authFetch(`${API_BASE}/lab/run/stream`, {
        method: 'POST',
        body: JSON.stringify({ prompt: buildCoachPrompt(), model: LAB_MODEL }),
      })
      if (!res.ok || !res.body) {
        let detail = `Server returned ${res.status}`
        try {
          detail = (await res.json())?.detail || detail
        } catch {
          // keep the generic message
        }
        throw new Error(detail)
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || '' // keep the incomplete tail for the next chunk
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data:')) continue
          const payload = JSON.parse(trimmed.slice(5).trim())
          if (payload.token) setCoachOutput((prev) => prev + payload.token)
          else if (payload.error) throw new Error(payload.error)
        }
      }
    } catch (error: any) {
      toast({
        status: 'error',
        title: error?.message || 'The coach is unavailable right now.',
      })
    } finally {
      setCoachRunning(false)
    }
  }

  const hasError = Boolean(
    runResult && (runResult.timed_out || (runResult.exit_code ?? 0) !== 0)
  )

  return (
    <Box h="100%" overflowY="auto" px={{ base: 6, lg: 10 }} py={8}>
      <Box maxW="1100px" mx="auto">
        <Heading fontSize="2xl">The capstone: one script, every lesson</Heading>
        <Text color="gray.500" mt={1}>
          Variables · Lists · Dicts · Functions · NumPy · Pandas · Matplotlib —
          everything from the past two days in one analysis.
        </Text>
        <Stepper
          steps={['1 · Choose your data', '2 · Build your script', '3 · Run & learn']}
          active={step === 'data' ? 0 : step === 'build' ? 1 : 2}
        />

        {step === 'data' && (
          <Box>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
              {PRESETS.map((p) => (
                <PresetCard
                  key={p.key}
                  emoji={p.emoji}
                  label={p.label}
                  description={p.description}
                  selected={presetKey === p.key}
                  onClick={() => setPresetKey(p.key)}
                />
              ))}
              <PresetCard
                label="Bring your own data"
                description="Paste a small CSV from your own work — header line first."
                selected={isOwn}
                dashed
                onClick={() => setPresetKey('own')}
              />
            </SimpleGrid>

            {isOwn && (
              <Textarea
                mt={4}
                rows={8}
                fontFamily="mono"
                fontSize="xs"
                spellCheck={false}
                placeholder={'date,product,amount\n2026-07-01,widget,12.50\n…'}
                value={ownCsv}
                onChange={(e) => setOwnCsv(e.target.value)}
              />
            )}

            {preview && (
              <Box mt={6}>
                <Callout tone="guide" title={`Your mission 🎯`}>
                  {question}
                </Callout>
                <Box
                  mt={4}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                  overflow="hidden"
                >
                  <Box bg="gray.50" px={4} py={2}>
                    <Text fontSize="xs" fontWeight={600} color="gray.500">
                      A peek at the data — {preview.total} rows in total
                    </Text>
                  </Box>
                  <Box overflowX="auto">
                    <Table size="sm">
                      <Thead>
                        <Tr>
                          {preview.header.map((h) => (
                            <Th key={h} fontFamily="mono">
                              {h}
                            </Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {preview.rows.map((row, i) => (
                          <Tr key={i}>
                            {row.map((cell, j) => (
                              <Td key={j} fontFamily="mono" fontSize="xs">
                                {cell}
                              </Td>
                            ))}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              </Box>
            )}

            <HStack mt={6}>
              <Button colorScheme="purple" onClick={chooseData}>
                Start building →
              </Button>
            </HStack>
          </Box>
        )}

        {step === 'build' && (
          <Box>
            <Callout tone="guide" title="Build it block by block 🧱">
              Each block is one thing you learned. Type real Python — your script
              grows along on the right. Stuck? Hover “example” for a snippet that
              fits this dataset, or click it to insert.
            </Callout>

            <Flex
              mt={6}
              gap={6}
              direction={{ base: 'column', lg: 'row' }}
              align="flex-start"
            >
              <Box flex="1" display="flex" flexDirection="column" gap={5}>
                {BLOCKS.map((b) => (
                  <BlockField
                    key={b.key}
                    label={b.label}
                    topic={b.topic}
                    hint={b.hint}
                    example={examples[b.key]}
                    optional={b.optional}
                    rows={b.rows}
                    value={blocks[b.key]}
                    onChange={(v) => setBlock(b.key, v)}
                    onInsertExample={() => setBlock(b.key, examples[b.key])}
                  />
                ))}
              </Box>

              <Box
                flex="1"
                bg="gray.900"
                borderRadius="xl"
                p={5}
                position={{ lg: 'sticky' }}
                top={{ lg: 4 }}
              >
                <Flex justify="space-between" align="center">
                  <MicroLabel onDark>Your script grows along</MicroLabel>
                  <Text fontSize="xs" color="gray.400" fontFamily="body">
                    {filledCount} / {BLOCKS.length} blocks
                  </Text>
                </Flex>
                <Progress
                  value={(filledCount / BLOCKS.length) * 100}
                  size="xs"
                  colorScheme="purple"
                  borderRadius="full"
                  bg="gray.700"
                  mt={2}
                />
                <Box
                  mt={4}
                  fontFamily="mono"
                  fontSize="xs"
                  color="gray.100"
                  whiteSpace="pre-wrap"
                  minH="120px"
                  maxH="55vh"
                  overflowY="auto"
                >
                  {filledCount > 0 ? (
                    script
                  ) : (
                    <Text color="gray.500">
                      Fill in the building blocks — your script appears here,
                      ready to run.
                    </Text>
                  )}
                </Box>
                <HStack mt={5}>
                  <Button
                    colorScheme="purple"
                    onClick={runScript}
                    isLoading={running}
                    loadingText="Running…"
                  >
                    Run my script ▶
                  </Button>
                  <Button
                    variant="outline"
                    color="gray.100"
                    borderColor="gray.600"
                    _hover={{ bg: 'gray.800' }}
                    onClick={copyScript}
                  >
                    Copy script
                  </Button>
                </HStack>
              </Box>
            </Flex>

            <HStack mt={8}>
              <Button variant="outline" onClick={() => setStep('data')}>
                ← Back
              </Button>
            </HStack>
          </Box>
        )}

        {step === 'run' && runResult && (
          <Box>
            <Callout tone="guide" title="The mission 🎯">
              {question}
            </Callout>

            {runResult.timed_out && (
              <Box mt={4}>
                <Callout tone="warn" title="Stopped after the time limit ⏱">
                  Your script ran longer than {runResult.timeout_seconds ?? 15}{' '}
                  seconds — an endless loop somewhere? Go back and check your
                  function and conditions.
                </Callout>
              </Box>
            )}

            {hasError && !runResult.timed_out && (
              <Box mt={4}>
                <Callout tone="warn" title="It crashed — that's part of the job 🔍">
                  Every Python programmer reads tracebacks daily. Start at the
                  LAST line: it names the error. Then find the line number it
                  points at, fix it, and run again.
                </Callout>
              </Box>
            )}

            <Grid
              templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
              gap={6}
              mt={6}
              alignItems="start"
            >
              <Box display="flex" flexDirection="column" gap={4}>
                <OutputCard label="Your script" mono subdued>
                  {script}
                </OutputCard>
              </Box>
              <Box display="flex" flexDirection="column" gap={4}>
                <OutputCard label="What it printed" mono>
                  {runResult.stdout ||
                    '(nothing printed — add a print() so you can see your answer)'}
                </OutputCard>
                {runResult.stderr && (
                  <OutputCard label="The traceback — read it bottom-up" mono>
                    <Box color="orange.700">{runResult.stderr}</Box>
                  </OutputCard>
                )}
                {runResult.image_base64 ? (
                  <Box
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="lg"
                    overflow="hidden"
                  >
                    <Box
                      bg="gray.50"
                      px={4}
                      py={2}
                      borderBottom="1px solid"
                      borderColor="gray.100"
                    >
                      <Text fontSize="xs" fontWeight={600} color="gray.500">
                        Your chart
                      </Text>
                    </Box>
                    <Image
                      src={`data:image/png;base64,${runResult.image_base64}`}
                      alt="Your matplotlib chart"
                      maxW="100%"
                      p={3}
                    />
                  </Box>
                ) : (
                  !hasError && (
                    <Text fontSize="xs" color="gray.500">
                      No chart this run — the matplotlib block draws one.
                    </Text>
                  )
                )}
              </Box>
            </Grid>

            <HStack mt={6}>
              <Button variant="outline" onClick={() => setStep('build')}>
                ← Back to tweak
              </Button>
              <Button
                colorScheme="purple"
                onClick={runScript}
                isLoading={running}
                loadingText="Running…"
              >
                Run again ▶
              </Button>
            </HStack>

            <Divider my={8} />

            <Flex align="center" gap={3}>
              <Badge colorScheme="purple" variant="solid" borderRadius="full" px={3}>
                AI coach
              </Badge>
              <Text fontSize="sm" color="gray.500">
                {hasError
                  ? 'Stuck on the error? The coach explains the traceback.'
                  : 'Get a review: what each part of your script does, and one thing to try next.'}
              </Text>
            </Flex>
            {!coachOutput && (
              <Button
                mt={4}
                colorScheme="purple"
                variant="outline"
                onClick={askCoach}
                isLoading={coachRunning}
                loadingText="Thinking…"
              >
                Ask the AI coach
              </Button>
            )}
            {coachOutput && (
              <Box mt={4}>
                <OutputCard label="The coach's review" maxH="500px">
                  {coachOutput}
                </OutputCard>
                {!coachRunning && (
                  <HStack mt={3}>
                    <Button size="sm" variant="outline" onClick={askCoach}>
                      Ask again
                    </Button>
                    <Text fontSize="xs" color="gray.500">
                      Iterating is the lesson — tweak your blocks and run again.
                    </Text>
                  </HStack>
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}
