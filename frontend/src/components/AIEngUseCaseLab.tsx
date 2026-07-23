import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Input,
  Progress,
  SimpleGrid,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import { API_BASE, authFetch } from '../api'
import {
  AIENG_USE_CASE_BLOCKS,
  AIENG_USE_CASE_GENERIC_EXAMPLES,
  AIENG_USE_CASE_PRESETS,
  type AIEngUseCaseBlockKey,
  type AIEngUseCasePreset,
} from '../data/aiengUseCasePresets'
import {
  BlockField,
  Callout,
  MarkdownOutput,
  MicroLabel,
  OutputCard,
  PresetCard,
  Stepper,
} from './labKit'

const LAB_MODEL = 'gpt-5.4-mini'

// Honest ROI: the AI drafts, humans check — assume ~70% of the time saved.
const SAVING_RATIO = 0.7

type Step = 'problem' | 'design' | 'plan' | 'build'

type BuildMsg = { role: 'user' | 'assistant'; content: string }

const emptyBlocks = (): Record<AIEngUseCaseBlockKey, string> =>
  Object.fromEntries(AIENG_USE_CASE_BLOCKS.map((b) => [b.key, ''])) as Record<
    AIEngUseCaseBlockKey,
    string
  >

function parseFrequencyPerMonth(s: string): number {
  const m = s.match(/(\d+(?:[.,]\d+)?)/)
  if (!m) return 0
  const n = parseFloat(m[1].replace(',', '.'))
  return /week/i.test(s) ? n * 4.3 : n
}

function parseMinutesEach(s: string): number {
  const m = s.match(/(\d+(?:[.,]\d+)?)/)
  if (!m) return 0
  const n = parseFloat(m[1].replace(',', '.'))
  return /uur|hour|hr|h\b/i.test(s) ? n * 60 : n
}

function StatCard(props: { label: string; value: string; accent?: string }) {
  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      p={4}
      bg="white"
    >
      <MicroLabel>{props.label}</MicroLabel>
      <Text
        fontFamily="heading"
        fontSize="2xl"
        mt={1}
        color={props.accent ?? 'gray.800'}
      >
        {props.value}
      </Text>
    </Box>
  )
}

export default function AIEngUseCaseLab() {
  const toast = useToast({ position: 'top', duration: 3000, isClosable: true })
  const [step, setStep] = useState<Step>('problem')
  const [presetKey, setPresetKey] = useState<string | null>(null)
  const [problem, setProblem] = useState('')
  const [task, setTask] = useState('')
  const [frequency, setFrequency] = useState('')
  const [timePer, setTimePer] = useState('')
  const [hourlyRate, setHourlyRate] = useState(50)
  const [blocks, setBlocks] = useState<Record<AIEngUseCaseBlockKey, string>>(emptyBlocks)
  const [advice, setAdvice] = useState('')
  const [adviceRunning, setAdviceRunning] = useState(false)
  const [buildMsgs, setBuildMsgs] = useState<BuildMsg[]>([])
  const [buildInput, setBuildInput] = useState('')
  const [buildRunning, setBuildRunning] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight })
  }, [buildMsgs])

  const preset: AIEngUseCasePreset | null =
    AIENG_USE_CASE_PRESETS.find((p) => p.key === presetKey) ?? null
  const examples = preset?.examples ?? AIENG_USE_CASE_GENERIC_EXAMPLES

  const filledCount = AIENG_USE_CASE_BLOCKS.filter((b) => blocks[b.key].trim()).length

  const estimate = useMemo(() => {
    const freqPerMonth = parseFrequencyPerMonth(frequency)
    const minutesEach = parseMinutesEach(timePer)
    const hoursPerMonth = (freqPerMonth * minutesEach) / 60
    const savedHours = hoursPerMonth * SAVING_RATIO
    const savedEuro = savedHours * (hourlyRate || 0)
    return { hoursPerMonth, savedHours, savedEuro }
  }, [frequency, timePer, hourlyRate])

  const assembledPlan = useMemo(
    () =>
      AIENG_USE_CASE_BLOCKS.filter((b) => blocks[b.key].trim())
        .map((b) => `${b.prefix}: ${blocks[b.key].trim()}`)
        .join('\n'),
    [blocks]
  )

  const setBlock = (key: AIEngUseCaseBlockKey, value: string) =>
    setBlocks((prev) => ({ ...prev, [key]: value }))

  const choosePreset = (p: AIEngUseCasePreset) => {
    setPresetKey(p.key)
    setProblem(p.problem)
    setTask(p.task)
    setFrequency(p.frequency)
    setTimePer(p.timePer)
  }

  const goDesign = () => {
    if (!problem.trim() || !task.trim()) {
      toast({
        status: 'warning',
        title: 'Describe the problem and the task first.',
        description: 'Pick a preset if you want a head start.',
      })
      return
    }
    setStep('design')
  }

  const buildPlanPrompt = () => {
    const savedLine =
      estimate.savedHours > 0
        ? `Estimated time saved: ~${estimate.savedHours.toFixed(1)} hours per month.`
        : ''
    return `Task context: You are a level-headed, friendly AI engineering advisor on the last afternoon of an AI engineering training for beginners. The course covered the OpenAI API, structured outputs, function calling, retrieval-augmented generation (RAG), agents, async background jobs, streaming, LangChain, and evaluation. Participants also use AI assistants (like ChatGPT and Claude) to help them write scripts. You are honest about which of these building blocks a use case actually needs — and just as honest about which ones would be overkill.

Request: Assess the AI engineering use case below and help the participant make it concrete.

The problem:
${problem.trim()}
The task: ${task.trim()}
Frequency: ${frequency.trim() || 'unknown'} · Time per instance: ${timePer.trim() || 'unknown'}
${savedLine}

The intended solution, block by block (drafted by the participant themselves):
${assembledPlan}

Output format: Give your answer in exactly this structure with markdown headings:
## Does this fit an LLM-based solution?
One honest paragraph on whether this is actually a language/reasoning task an LLM is good at, or whether a simpler rule-based script would already do the job. If an LLM is overkill, say so plainly and name the better tool.
## Building blocks — right call?
Go through the participant's 8 blocks (OpenAI API, structured outputs, function calling, RAG & agents, async jobs, streaming, LangChain, evaluation) in one tight paragraph. For each one they marked "not needed", say whether you agree. For each one they want to use, say whether it's justified or overkill for this volume/latency. Be specific, not generic.
## First 3 steps
A numbered list of 3 concrete, small steps to start this week — step 1 is almost always: write the plain prompt by hand and test it manually on a handful of real examples before writing any code.
## Starter code
A short Python script (in a code block) that sketches the skeleton using ONLY the blocks the participant actually decided they need (skip structured outputs / function calling / RAG / async / streaming / LangChain if they marked them "not needed"). Use only things a beginner from this course recognizes. Made-up filenames and data are fine.
## Ask your AI assistant
One ready-to-use prompt (in a code block) the participant can paste into ChatGPT or Claude to build the full solution together. Include the task, which building blocks are actually needed, and the desired output.
## Watch out
At most 3 risks, picked for THIS case — think: hallucination on facts that matter, data/privacy exposure in the prompt, cost or latency at the volume described, or too much trust in an unchecked output.

Write in English, concise and practical. No headings other than the ones above.`
  }

  const streamLab = async (
    body: { prompt: string; system_message?: string; model: string },
    onToken: (token: string) => void
  ) => {
    const res = await authFetch(`${API_BASE}/lab/run/stream`, {
      method: 'POST',
      body: JSON.stringify(body),
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
        if (payload.token) onToken(payload.token)
        else if (payload.error) throw new Error(payload.error)
      }
    }
  }

  const runPlan = async () => {
    if (filledCount === 0) {
      toast({
        status: 'warning',
        title: 'Fill in at least one building block first.',
      })
      return
    }
    setStep('plan')
    setAdviceRunning(true)
    setAdvice('')
    setBuildMsgs([]) // fresh advice → fresh build session
    try {
      await streamLab({ prompt: buildPlanPrompt(), model: LAB_MODEL }, (token) =>
        setAdvice((prev) => prev + token)
      )
    } catch (error: any) {
      toast({
        status: 'error',
        title: error?.message || 'The advisor is unavailable right now.',
      })
    } finally {
      setAdviceRunning(false)
    }
  }

  const buildCoachSystem =
    () => `You are a patient, hands-on AI engineering build coach on the last afternoon of an AI engineering training for beginners. The course covered the OpenAI API, structured outputs, function calling, retrieval-augmented generation (RAG), agents, async background jobs, streaming, LangChain, and evaluation. Participants also use AI assistants (like ChatGPT and Claude) to help them write scripts.

The participant designed the AI engineering use case below and already received advice on it. Your job now is to help them actually BUILD the first version, one small step at a time — using only the building blocks they actually decided they need.

The problem:
${problem.trim()}
The task: ${task.trim()}

Their solution plan, block by block:
${assembledPlan}

The advice they received:
${advice}

Coaching rules:
- In your FIRST message: give a short roadmap of 3-6 small numbered build steps that follows their block choices in order (skip any block they marked "not needed"), then immediately start with step 1. Step 1 is almost always: write the plain prompt by hand and test it manually on 2-3 real examples before writing any code.
- Guide ONE step at a time: what to do, the exact code snippet or the exact AI-assistant prompt to use, and how to check it worked. Then stop and wait for the participant.
- Start each step message with a heading like "### Step 2 of 5 — Add structured output". Never dump the whole solution at once — small wins keep momentum.
- If they paste an error or a bad/hallucinated output, debug it with them calmly before moving on. A bad first output is information, not failure.
- Only introduce a building block (structured outputs, function calling, RAG, agents, async jobs, streaming, LangChain) if it appears in their plan — don't add complexity they didn't ask for. Made-up filenames and data are fine; ask what their real data looks like when it matters.
- Keep every message short and practical (under ~200 words), in English, in markdown.
- When the roadmap is complete, congratulate them and suggest one small stretch improvement grounded in their own plan (e.g. tightening the evaluation, or adding a guardrail for low-confidence answers).`

  const buildTurnPrompt = (history: BuildMsg[]) => {
    if (history.length === 0)
      return 'Start the build session now: give the roadmap and step 1.'
    const transcript = history
      .map((m) =>
        m.role === 'user' ? `Participant: ${m.content}` : `Coach: ${m.content}`
      )
      .join('\n\n')
    return `Conversation so far:\n\n${transcript}\n\nReply with the coach's next message only.`
  }

  const runBuildTurn = async (history: BuildMsg[]) => {
    setBuildMsgs([...history, { role: 'assistant', content: '' }])
    setBuildInput('')
    setBuildRunning(true)
    try {
      await streamLab(
        {
          prompt: buildTurnPrompt(history),
          system_message: buildCoachSystem(),
          model: LAB_MODEL,
        },
        (token) =>
          setBuildMsgs((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            next[next.length - 1] = { ...last, content: last.content + token }
            return next
          })
      )
    } catch (error: any) {
      // drop the empty assistant placeholder so the turn can be retried
      setBuildMsgs((prev) =>
        prev.filter((m, i) => i !== prev.length - 1 || m.content.trim() !== '')
      )
      toast({
        status: 'error',
        title: error?.message || 'The coach is unavailable right now.',
      })
    } finally {
      setBuildRunning(false)
    }
  }

  const startBuild = () => {
    setStep('build')
    if (buildMsgs.length === 0) runBuildTurn([])
  }

  const sendBuild = (text: string) => {
    if (!text.trim() || buildRunning) return
    runBuildTurn([...buildMsgs, { role: 'user', content: text.trim() }])
  }

  return (
    <Box h="100%" overflowY="auto" px={{ base: 6, lg: 10 }} py={8}>
      <Box maxW="1100px" mx="auto">
        <Heading fontSize="2xl">Your AI engineering use case: from busywork to LLM feature</Heading>
        <Text color="gray.500" mt={1}>
          What is done by hand today? → Could an LLM-powered feature take it
          over? → A concrete plan to find out, with AI at your side.
        </Text>
        <Stepper
          steps={[
            '1 · The problem',
            '2 · The solution',
            '3 · Make it concrete',
            '4 · Build it',
          ]}
          active={
            step === 'problem'
              ? 0
              : step === 'design'
                ? 1
                : step === 'plan'
                  ? 2
                  : 3
          }
        />

        {step === 'problem' && (
          <Box>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
              {AIENG_USE_CASE_PRESETS.map((p) => (
                <PresetCard
                  key={p.key}
                  emoji={p.emoji}
                  label={p.label}
                  description={p.description}
                  selected={presetKey === p.key}
                  onClick={() => choosePreset(p)}
                />
              ))}
              <PresetCard
                label="Describe your own problem"
                description="A task from your own work that an LLM could plausibly help with today."
                selected={presetKey === 'own'}
                dashed
                onClick={() => setPresetKey('own')}
              />
            </SimpleGrid>

            <Box mt={6}>
              <Text fontWeight={600} fontSize="sm">
                What is the problem?
              </Text>
              <Text fontSize="xs" color="gray.500" mb={2}>
                Describe the situation: which language-heavy task is done by
                hand today, and what it costs.
              </Text>
              <Textarea
                rows={3}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Every day someone writes the same kind of reply…"
              />
            </Box>

            <Box mt={4}>
              <Text fontWeight={600} fontSize="sm">
                Which task exactly?
              </Text>
              <Text fontSize="xs" color="gray.500" mb={2}>
                One sentence — the piece an LLM-powered feature could take over.
              </Text>
              <Input
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Draft a first-response email for each support ticket"
              />
            </Box>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mt={4}>
              <Box>
                <Text fontWeight={600} fontSize="sm" mb={2}>
                  How often?
                </Text>
                <Input
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  placeholder="150 times per week"
                />
              </Box>
              <Box>
                <Text fontWeight={600} fontSize="sm" mb={2}>
                  Time per instance
                </Text>
                <Input
                  value={timePer}
                  onChange={(e) => setTimePer(e.target.value)}
                  placeholder="10 min each"
                />
              </Box>
              <Box>
                <Text fontWeight={600} fontSize="sm" mb={2}>
                  Hourly rate (€)
                </Text>
                <Input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                />
              </Box>
            </SimpleGrid>

            <Box mt={5}>
              {estimate.hoursPerMonth > 0 ? (
                <Callout tone="warn" title="What this costs today 💸">
                  This currently costs about{' '}
                  <b>{estimate.hoursPerMonth.toFixed(1)} hours per month</b>. If
                  an LLM-powered feature takes over the first draft, you win
                  back roughly <b>{estimate.savedHours.toFixed(1)} hours</b> (≈{' '}
                  <b>€{Math.round(estimate.savedEuro)}</b>) every month.
                </Callout>
              ) : (
                <Text fontSize="sm" color="gray.500">
                  Fill in frequency and time per instance to see what this task
                  costs you per month.
                </Text>
              )}
            </Box>

            <HStack mt={6}>
              <Button colorScheme="purple" onClick={goDesign}>
                Now design the solution →
              </Button>
            </HStack>
          </Box>
        )}

        {step === 'design' && (
          <Box>
            <Callout tone="guide" title="Design your AI engineering solution 🧩">
              Go through the 8 building blocks from the course — OpenAI API,
              structured outputs, function calling, RAG & agents, async jobs,
              streaming, LangChain, evaluation. For each one, decide if it's
              needed here or not — "not needed, because…" is a valid and
              important answer. Your plan grows along on the right. Stuck?
              Hover “example”, or click it to insert.
            </Callout>

            <Flex
              mt={6}
              gap={6}
              direction={{ base: 'column', lg: 'row' }}
              align="flex-start"
            >
              <Box flex="1" display="flex" flexDirection="column" gap={5}>
                {AIENG_USE_CASE_BLOCKS.map((b) => (
                  <BlockField
                    key={b.key}
                    label={b.label}
                    topic={b.topic}
                    hint={b.hint}
                    example={examples[b.key]}
                    rows={b.rows}
                    value={blocks[b.key]}
                    onChange={(v) => setBlock(b.key, v)}
                    onInsertExample={() => setBlock(b.key, examples[b.key])}
                    mono={false}
                    placeholder="plain language — hover 'example' if you're stuck (click it to insert)"
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
                  <MicroLabel onDark>Your plan grows along</MicroLabel>
                  <Text fontSize="xs" color="gray.400" fontFamily="body">
                    {filledCount} / {AIENG_USE_CASE_BLOCKS.length} blocks
                  </Text>
                </Flex>
                <Progress
                  value={(filledCount / AIENG_USE_CASE_BLOCKS.length) * 100}
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
                    assembledPlan
                  ) : (
                    <Text color="gray.500">
                      Fill in the building blocks — your solution plan appears
                      here.
                    </Text>
                  )}
                </Box>
                {estimate.savedHours > 0 && (
                  <Text fontSize="sm" color="green.300" mt={4}>
                    ~{estimate.savedHours.toFixed(1)} hrs (≈ €
                    {Math.round(estimate.savedEuro)}) per month of potential
                  </Text>
                )}
                <HStack mt={5}>
                  <Button
                    colorScheme="purple"
                    onClick={runPlan}
                    isDisabled={filledCount === 0}
                  >
                    Make it concrete with AI →
                  </Button>
                </HStack>
              </Box>
            </Flex>

            <HStack mt={8}>
              <Button variant="outline" onClick={() => setStep('problem')}>
                ← Back
              </Button>
            </HStack>
          </Box>
        )}

        {step === 'plan' && (
          <Box>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <StatCard
                label="Time now"
                value={
                  estimate.hoursPerMonth > 0
                    ? `${estimate.hoursPerMonth.toFixed(1)} hrs/mo`
                    : '—'
                }
              />
              <StatCard
                label="Time saved"
                value={
                  estimate.savedHours > 0
                    ? `~${estimate.savedHours.toFixed(1)} hrs/mo`
                    : '—'
                }
                accent="brand.600"
              />
              <StatCard
                label="Savings"
                value={
                  estimate.savedEuro > 0
                    ? `≈ €${Math.round(estimate.savedEuro)}/mo`
                    : '—'
                }
                accent="green.600"
              />
            </SimpleGrid>

            <Grid
              templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
              gap={6}
              mt={6}
              alignItems="start"
            >
              <Box display="flex" flexDirection="column" gap={4}>
                <OutputCard label="The problem" subdued>
                  {problem.trim()}
                  {'\n'}Task: {task.trim()}
                </OutputCard>
                <OutputCard label="Your solution plan" mono subdued>
                  {assembledPlan}
                </OutputCard>
              </Box>
              <Box>
                <Flex align="center" gap={3} mb={3}>
                  <Badge
                    colorScheme="purple"
                    variant="solid"
                    borderRadius="full"
                    px={3}
                  >
                    AI advice
                  </Badge>
                  <Text fontSize="sm" color="gray.500">
                    An honest look at your use case — with starter code, or a
                    simpler tool if an LLM isn't it.
                  </Text>
                </Flex>
                <OutputCard label="The advisor's plan" maxH="60vh">
                  {advice ? (
                    <MarkdownOutput>{advice}</MarkdownOutput>
                  ) : adviceRunning ? (
                    'Thinking…'
                  ) : (
                    ''
                  )}
                </OutputCard>
              </Box>
            </Grid>

            {!adviceRunning && (
              <Box>
                <Divider my={8} />
                <Text fontSize="sm" color="gray.500">
                  Happy with the plan? Build the first version right now, step
                  by step, with a coach at your side. Not satisfied? Go back,
                  sharpen your solution, and ask again — iterating on the plan
                  is exactly how AI engineering work goes in practice.
                </Text>
                <HStack mt={4}>
                  <Button colorScheme="purple" onClick={startBuild}>
                    Build it step by step →
                  </Button>
                  <Button variant="outline" onClick={() => setStep('design')}>
                    ← Back to the blocks
                  </Button>
                  <Button
                    colorScheme="purple"
                    variant="outline"
                    onClick={runPlan}
                  >
                    Rethink it
                  </Button>
                </HStack>
              </Box>
            )}
          </Box>
        )}

        {step === 'build' && (
          <Box>
            <Callout tone="guide" title="Build it, step by step 🛠️">
              Your coach breaks the first version into small steps and gives
              you one at a time — with the exact code or AI prompt to try. Say
              “done” to move on, or paste an error (or a bad output) and
              you’ll fix it together.
            </Callout>

            <Grid
              templateColumns={{ base: '1fr', lg: '300px 1fr' }}
              gap={6}
              mt={6}
              alignItems="start"
            >
              <Box
                display={{ base: 'none', lg: 'flex' }}
                flexDirection="column"
                gap={4}
                position="sticky"
                top={4}
              >
                <OutputCard label="Your solution plan" mono subdued maxH="40vh">
                  {assembledPlan}
                </OutputCard>
                {estimate.savedHours > 0 && (
                  <Text fontSize="sm" color="green.600">
                    Worth ~{estimate.savedHours.toFixed(1)} hrs (≈ €
                    {Math.round(estimate.savedEuro)}) per month once it runs.
                  </Text>
                )}
              </Box>

              <Box
                border="1px solid"
                borderColor="gray.200"
                borderRadius="xl"
                bg="white"
                overflow="hidden"
              >
                <Box
                  ref={chatRef}
                  maxH="60vh"
                  overflowY="auto"
                  p={5}
                  display="flex"
                  flexDirection="column"
                  gap={5}
                >
                  {buildMsgs.map((m, i) =>
                    m.role === 'assistant' ? (
                      <Box key={i}>
                        <Flex align="center" gap={2} mb={1}>
                          <Badge
                            colorScheme="purple"
                            variant="solid"
                            borderRadius="full"
                            px={3}
                          >
                            Build coach
                          </Badge>
                        </Flex>
                        {m.content ? (
                          <MarkdownOutput>{m.content}</MarkdownOutput>
                        ) : (
                          <Text fontSize="sm" color="gray.500">
                            Thinking…
                          </Text>
                        )}
                      </Box>
                    ) : (
                      <Flex key={i} justify="flex-end">
                        <Box
                          bg="brand.50"
                          border="1px solid"
                          borderColor="brand.100"
                          borderRadius="lg"
                          px={4}
                          py={2}
                          maxW="85%"
                        >
                          <Text fontSize="sm" whiteSpace="pre-wrap">
                            {m.content}
                          </Text>
                        </Box>
                      </Flex>
                    )
                  )}
                </Box>
                <Box borderTop="1px solid" borderColor="gray.200" p={4}>
                  <HStack mb={3} flexWrap="wrap">
                    <Button
                      size="xs"
                      variant="outline"
                      isDisabled={buildRunning || buildMsgs.length === 0}
                      onClick={() => sendBuild('Done ✓ — next step, please.')}
                    >
                      ✓ Done — next step
                    </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      isDisabled={buildRunning || buildMsgs.length === 0}
                      onClick={() =>
                        sendBuild('Can you explain that again, a bit simpler?')
                      }
                    >
                      Explain it simpler
                    </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      isDisabled={buildRunning || buildMsgs.length === 0}
                      onClick={() => setBuildInput('I got this error:\n\n')}
                    >
                      I got an error…
                    </Button>
                  </HStack>
                  <HStack align="flex-end">
                    <Textarea
                      rows={2}
                      value={buildInput}
                      onChange={(e) => setBuildInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          sendBuild(buildInput)
                        }
                      }}
                      placeholder="Ask a question, paste your code or an error… (Enter to send, Shift+Enter for a new line)"
                    />
                    <Button
                      colorScheme="purple"
                      onClick={() => sendBuild(buildInput)}
                      isDisabled={buildRunning || !buildInput.trim()}
                    >
                      Send
                    </Button>
                  </HStack>
                </Box>
              </Box>
            </Grid>

            <HStack mt={8}>
              <Button variant="outline" onClick={() => setStep('plan')}>
                ← Back to the plan
              </Button>
              <Button
                variant="ghost"
                colorScheme="purple"
                isDisabled={buildRunning}
                onClick={() => runBuildTurn([])}
              >
                Restart the build
              </Button>
            </HStack>
          </Box>
        )}
      </Box>
    </Box>
  )
}
