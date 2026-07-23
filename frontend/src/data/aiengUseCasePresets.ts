// The AI Engineering Use Case Lab curriculum: participants describe a task
// they'd like an LLM to do for them, then design an AI-engineered solution
// from 6 building blocks. Presets exist to defeat the blank-field problem.

export type AIEngUseCaseBlockKey =
  | 'behavior'
  | 'context'
  | 'shape'
  | 'volume'
  | 'mistakes'
  | 'human'

export interface AIEngUseCaseBlockDef {
  key: AIEngUseCaseBlockKey
  label: string
  prefix: string // label used when assembling the plan text
  topic: string
  hint: string
  rows: number
}

export const AIENG_USE_CASE_BLOCKS: AIEngUseCaseBlockDef[] = [
  {
    key: 'behavior',
    label: 'What should the AI actually do?',
    prefix: 'Desired behavior',
    topic: 'task',
    hint: 'One concrete job, not a vague ambition. "Draft a reply" beats "help with support". Say what goes in and what should come out.',
    rows: 2,
  },
  {
    key: 'context',
    label: 'What context or data does it need?',
    prefix: 'Context & data (RAG)',
    topic: 'grounding',
    hint: 'What does the model need to see to answer well — a document, a database row, past tickets? If it needs your own knowledge, that is retrieval (RAG), not just a clever prompt.',
    rows: 3,
  },
  {
    key: 'shape',
    label: 'A single prompt, or an agent with tools?',
    prefix: 'Shape of the solution',
    topic: 'architecture',
    hint: 'Can one well-written prompt do it in one shot? Or does it need to look things up, call an API, or take multiple steps — which means an agent with tools.',
    rows: 2,
  },
  {
    key: 'volume',
    label: 'How often, and how fast does it need to be?',
    prefix: 'Volume & latency',
    topic: 'scale',
    hint: 'Roughly how many times will this run per day, and does a person wait for the answer? A live chat needs speed; a nightly batch job does not.',
    rows: 2,
  },
  {
    key: 'mistakes',
    label: 'What does a wrong answer cost?',
    prefix: 'Cost of mistakes',
    topic: 'risk',
    hint: 'LLMs are confidently wrong sometimes. What happens if it hallucinates or misses — mild annoyance, or something that reaches a customer unchecked?',
    rows: 2,
  },
  {
    key: 'human',
    label: 'Where does the human stay?',
    prefix: 'Role of the human',
    topic: 'control',
    hint: 'The model drafts, a person decides. What gets reviewed before it goes out — every output, a sample, or only the low-confidence ones?',
    rows: 2,
  },
]

export interface AIEngUseCasePreset {
  key: string
  emoji: string
  label: string
  description: string
  problem: string
  task: string
  frequency: string
  timePer: string
  examples: Record<AIEngUseCaseBlockKey, string>
}

export const AIENG_USE_CASE_PRESETS: AIEngUseCasePreset[] = [
  {
    key: 'support-drafts',
    emoji: '✉️',
    label: 'Drafting support replies',
    description: 'Every incoming email gets a reply typed from scratch.',
    problem:
      'Support agents retype the same kind of answer all day — the facts differ (order number, product, dates) but the shape of the reply barely changes. Typing it out every time eats the whole shift.',
    task: 'Draft a first-response email for each incoming support ticket',
    frequency: '150 times per week',
    timePer: '10 min each',
    examples: {
      behavior:
        'Given a customer email, draft a reply in our tone that answers their question or explains the next step. The agent edits and sends — the AI never sends directly.',
      context:
        'The incoming email text, our order/return policy, and (when relevant) the customer\'s order status looked up from the order system.',
      shape:
        'Mostly a single well-crafted prompt with the policy pasted in. If it needs the live order status, that is one tool call to the orders API — a small agent, not just a prompt.',
      volume:
        'About 150 tickets a week, roughly 20-30 a day. Agents read the draft before sending, so a few seconds of latency is fine.',
      mistakes:
        'A wrong policy detail in a sent email damages trust and can cost a refund. That is why a human reviews every draft before sending — no auto-send.',
      human:
        'The agent always reads and edits the draft before it goes out; the AI never has send access.',
    },
  },
  {
    key: 'meeting-notes',
    emoji: '📝',
    label: 'Turning calls into action items',
    description: 'Someone writes up every meeting by hand from memory.',
    problem:
      'After every client call, someone spends time writing a summary and chasing who owes what. Details get missed or written differently depending on who takes notes.',
    task: 'Turn a call transcript into a summary and a list of action items',
    frequency: '20 times per week',
    timePer: '25 min each',
    examples: {
      behavior:
        'Given a raw call transcript, produce a short summary, decisions made, and a list of action items with an owner and rough deadline where mentioned.',
      context:
        'Just the transcript text itself — no external lookup needed, this is pure summarization, not retrieval.',
      shape:
        'A single prompt. No tools needed: everything the model needs is already in the transcript that gets pasted in.',
      volume:
        '20 calls a week. Nobody is waiting live — running it right after the call, within a minute or two, is plenty fast.',
      mistakes:
        'A missed action item means a dropped commitment to a client. Not dangerous, but embarrassing enough that someone should skim the output before it is shared.',
      human:
        'The call owner skims the summary and action items before sending them to the client or the team.',
    },
  },
  {
    key: 'ticket-router',
    emoji: '🤖',
    label: 'An agent that answers from the docs',
    description: 'Customers wait for a human to look up something already documented.',
    problem:
      'Half of support questions are already answered in the help center, but customers still wait in the queue because nobody points them there fast enough.',
    task: 'Answer common questions automatically by searching our help docs first',
    frequency: '400 times per week',
    timePer: '6 min each',
    examples: {
      behavior:
        'Given a customer question, find the relevant help article(s) and answer directly, citing the article. If nothing relevant is found, hand off to a human instead of guessing.',
      context:
        'Our full help center, indexed so the model can retrieve the most relevant articles for a given question — classic RAG, since the answers must come from our real docs, not the model\'s general knowledge.',
      shape:
        'An agent: it has one tool (search the help docs), decides whether to use it, and only answers if it found something relevant enough. Otherwise it escalates.',
      volume:
        '400 questions a week, live in a chat widget — customers are waiting, so a few seconds of latency is the budget, not a few minutes.',
      mistakes:
        'Confidently answering from the wrong article, or making something up, is worse than saying "let me get a person" — a miss just costs a short wait.',
      human:
        'Anything below a confidence threshold, or anything the customer pushes back on, is routed to a human agent with the chat history attached.',
    },
  },
  {
    key: 'report-generator',
    emoji: '📊',
    label: 'Weekly reports from raw numbers',
    description: 'A manager rebuilds the same slide from a spreadsheet every Monday.',
    problem:
      'Every Monday, a manager pulls last week\'s numbers from a spreadsheet export and writes the same kind of summary paragraph and highlights slide for the team. The numbers change, the format never does.',
    task: 'Generate the weekly performance summary from the exported numbers',
    frequency: '1 time per week',
    timePer: '3 hours each',
    examples: {
      behavior:
        'Given this week\'s exported metrics (as a CSV or table), write a short narrative summary, call out the 2-3 biggest changes versus last week, and flag anything that looks off.',
      context:
        'This week\'s and last week\'s metrics export — pasted in or read from a file. No external knowledge base needed, just the numbers themselves.',
      shape:
        'A single prompt is enough if the numbers are pasted in directly. If it should pull the export itself from a shared drive, that becomes one tool call — a very small agent.',
      volume:
        'Once a week, not time-critical — running it Monday morning with a minute of latency is completely fine.',
      mistakes:
        'A wrong number in a report that goes to leadership is a real credibility problem, so nothing goes out unread.',
      human:
        'The manager always reviews the draft against the source numbers before it goes into the deck — this saves the writing, not the judgment.',
    },
  },
]

// Generic examples for "describe your own" — shapes instead of specifics.
export const AIENG_USE_CASE_GENERIC_EXAMPLES: Record<AIEngUseCaseBlockKey, string> = {
  behavior:
    'The one concrete job the AI should do, with a clear input and a clear output — not a vague ambition.',
  context:
    'What the model needs to see to do it well — a document, a database lookup, past examples. If it is your own knowledge, that is retrieval (RAG).',
  shape:
    'Single prompt, or an agent that can call tools / look things up across multiple steps — and why.',
  volume: 'Roughly how many times a day or week this runs, and whether a person is waiting live for the answer.',
  mistakes:
    'What a wrong or hallucinated answer costs, and whether that is mild annoyance or real damage if it goes out unchecked.',
  human: 'What a person still reviews or approves before the output is used or sent.',
}
