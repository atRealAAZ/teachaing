// The AI Engineering Use Case Lab curriculum: participants describe a task
// they'd like an LLM to do for them, then design a solution from 8 technical
// building blocks — the actual toolkit from the course (OpenAI API, structured
// outputs, function calling, async jobs, streaming, evaluation, LangChain,
// agents & RAG). Not every use case needs every block: saying "not needed
// here, because…" is itself part of the lesson. Presets exist to defeat the
// blank-field problem.

export type AIEngUseCaseBlockKey =
  | 'api'
  | 'structuredOutput'
  | 'functionCalling'
  | 'ragAgent'
  | 'asyncJobs'
  | 'streaming'
  | 'langchain'
  | 'evaluation'

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
    key: 'api',
    label: 'OpenAI API — what is the core call?',
    prefix: 'OpenAI API call',
    topic: 'API',
    hint: 'Every solution starts here: what goes into the system/user prompt, and which model fits the job (fast & cheap vs. more capable)?',
    rows: 2,
  },
  {
    key: 'structuredOutput',
    label: 'Structured outputs — does it need a strict shape?',
    prefix: 'Structured outputs',
    topic: 'Structured outputs',
    hint: 'If downstream code reads the result (a field, a list, a category), force JSON with a schema instead of parsing free text. If the output is just prose for a human, say so — you don\'t need this.',
    rows: 2,
  },
  {
    key: 'functionCalling',
    label: 'Function calling — does the model need to trigger an action?',
    prefix: 'Function calling',
    topic: 'Function calling',
    hint: 'Does the model need to look something up or trigger a real action (search, send, update a record)? Name the function(s). If it never needs to act, say "not needed" — a plain prompt is enough.',
    rows: 3,
  },
  {
    key: 'ragAgent',
    label: 'RAG & agents — does it need your own knowledge or multiple steps?',
    prefix: 'RAG & agents',
    topic: 'RAG / Agents',
    hint: 'If it must answer from YOUR documents/data, that\'s retrieval (RAG). If it needs to reason across multiple tool calls to get to an answer, that\'s an agent. Plenty of use cases need neither — say so if that\'s the case.',
    rows: 3,
  },
  {
    key: 'asyncJobs',
    label: 'Async jobs — does it run in the background?',
    prefix: 'Async jobs',
    topic: 'Async jobs',
    hint: 'Slow or bulk work (many items, long documents) should be queued as a background job instead of blocking a request. Fast, single, on-demand tasks don\'t need this — say so.',
    rows: 2,
  },
  {
    key: 'streaming',
    label: 'Streaming — does a person watch it appear live?',
    prefix: 'Streaming',
    topic: 'Streaming',
    hint: 'If a person is staring at the screen waiting, stream tokens so it feels instant. If it runs unattended in the background, streaming adds nothing — say so.',
    rows: 2,
  },
  {
    key: 'langchain',
    label: 'LangChain — does it earn the extra structure?',
    prefix: 'LangChain',
    topic: 'LangChain',
    hint: 'LangChain (or a similar framework) pays off once you chain multiple steps, swap models, or need built-in retrievers/agents. For one simple call, a raw API call is simpler — say "not needed" if that\'s true here.',
    rows: 2,
  },
  {
    key: 'evaluation',
    label: 'Evaluation — how do you know it actually works?',
    prefix: 'Evaluation',
    topic: 'Evaluation',
    hint: 'Before trusting it in production: what does "good" look like, and how do you check it — a small labeled test set, an LLM-as-judge, or a human spot-check on a sample?',
    rows: 3,
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
      api: 'One chat completion call: system prompt with our tone-of-voice and policy, user message is the incoming email text. Model: a fast, cheap one — this is a draft a human always edits.',
      structuredOutput:
        'Not strictly needed for the email body itself (it\'s prose), but useful for a side field: return { "reply": string, "category": "billing"|"technical"|"returns" } so the category can auto-tag the ticket.',
      functionCalling:
        'One function: get_order_status(order_id) — only called when the email mentions an order number, so the draft can reference real status instead of guessing.',
      ragAgent:
        'Not full RAG: the return/refund policy is short enough to paste directly into the system prompt instead of building a retriever for it.',
      asyncJobs:
        'Not needed — one ticket in, one draft out, fast enough to run synchronously when the agent opens the ticket.',
      streaming:
        'Not needed — the agent reviews the finished draft, not the model thinking out loud; a 2-3 second wait is fine unstreamed.',
      langchain:
        'Not needed — it\'s one call with one optional tool. A LangChain chain would add ceremony without adding capability here.',
      evaluation:
        'Weekly: an agent lead reads 20 random drafts against the actual sent (edited) reply and scores tone/accuracy 1-5. If policy facts are ever wrong, that\'s a hard fail, not a score.',
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
      api: 'One call: system prompt explains the desired format, user message is the full transcript pasted in. A cheap model is plenty — this is pure summarization, no reasoning over external facts.',
      structuredOutput:
        'Yes: return { "summary": string, "decisions": string[], "action_items": [{"owner": string, "task": string, "due": string|null}] } so action items can be rendered as a checklist, not re-parsed from prose.',
      functionCalling:
        'Not needed — everything the model needs is already in the transcript text; there is nothing to look up or trigger.',
      ragAgent:
        'Not needed — no external knowledge base, just the one transcript given directly in the prompt.',
      asyncJobs:
        'Yes: transcripts can be long (an hour call = a lot of tokens), so queue it as a background job right after the call ends instead of making someone wait on a request.',
      streaming:
        'Not needed — nobody watches it generate live; the result just needs to be ready a minute or two after the call.',
      langchain:
        'Not needed — a single well-structured prompt does the whole job in one call.',
      evaluation:
        'Spot-check: 10 transcripts a week reviewed by the call owner — did it catch every actual commitment made on the call? Missed action items are tracked as the key failure mode.',
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
      api: 'Chat completion with the retrieved article chunks injected into the system prompt as context, plus the customer question as the user message.',
      structuredOutput:
        'Yes for the routing decision: { "answer": string|null, "source_article_id": string|null, "confidence": "high"|"low" } — "low" or null answer triggers escalation.',
      functionCalling:
        'One function: search_help_docs(query) that the model calls before answering, so it only answers from what it actually found.',
      ragAgent:
        'This IS RAG: the help center is indexed (embeddings + vector search), the model retrieves the top matching articles, then answers grounded in them and cites the article. Escalates to a human when nothing relevant is found — that\'s the agent part: it decides whether to answer or hand off.',
      asyncJobs:
        'Not for answering (that\'s live chat), but the doc index itself is rebuilt as a nightly background job whenever articles change.',
      streaming:
        'Yes — it\'s a live chat widget, customers are watching, so stream the answer token by token once retrieval is done.',
      langchain:
        'Worth it here: LangChain\'s retriever + agent abstractions save real code versus hand-rolling embedding search, prompt assembly and the escalate-or-answer branching.',
      evaluation:
        'A labeled test set of 50 real past questions with the "correct" article — track retrieval hit-rate weekly, plus a human review of any answer given at "low" confidence that should have escalated instead.',
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
      api: 'One call: system prompt defines the report structure, user message includes this week\'s and last week\'s numbers as a table.',
      structuredOutput:
        'Yes: { "narrative": string, "highlights": string[], "flags": string[] } so highlights and flags can be dropped straight into slide bullets instead of copy-pasted from prose.',
      functionCalling:
        'One function: fetch_metrics_export(week) so the report can pull the numbers itself from the shared drive instead of someone pasting them in by hand.',
      ragAgent:
        'Not needed — this reasons over one week\'s numbers, not a knowledge base; no retrieval step required.',
      asyncJobs:
        'Yes: scheduled to run automatically every Monday morning as a background job, so the draft is waiting instead of triggered by hand.',
      streaming:
        'Not needed — nobody is watching it generate; the manager reviews the finished draft later that morning.',
      langchain:
        'Not needed for the generation itself — a single prompt does the writing. Might reconsider if more data sources get added later.',
      evaluation:
        'Every report is checked against the source numbers before it ships (100% review, not sampling) — a wrong number to leadership is too costly to sample-check.',
    },
  },
]

// Generic examples for "describe your own" — shapes instead of specifics.
export const AIENG_USE_CASE_GENERIC_EXAMPLES: Record<AIEngUseCaseBlockKey, string> = {
  api: 'The core call: what goes in the system prompt, what goes in the user message, and roughly which model tier fits (fast/cheap vs. more capable).',
  structuredOutput:
    'Does downstream code need to read a field from the result? If yes, sketch the JSON shape. If the output is just prose for a human, say "not needed".',
  functionCalling:
    'Does the model need to look something up or trigger a real action? Name the function(s) — or say "not needed" if it never has to act.',
  ragAgent:
    'Does it need to answer from YOUR own documents/data (RAG), or reason across multiple tool calls (agent)? Or neither — say so if a plain prompt is enough.',
  asyncJobs:
    'Is this slow or bulk work that should run in the background instead of blocking a request? Or fast enough to run synchronously — say which.',
  streaming:
    'Is a person watching this generate live? If yes, stream it. If it runs unattended, say "not needed".',
  langchain:
    'Does chaining multiple steps or swapping models justify the extra structure — or is a raw API call simpler here?',
  evaluation:
    'How would you know if this is actually working — a labeled test set, an LLM-as-judge, or a human spot-check on a sample?',
}
