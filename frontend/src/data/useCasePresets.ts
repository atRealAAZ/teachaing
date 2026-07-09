// The Use Case Lab curriculum: participants describe a time-wasting task from
// their own work, then design a Python(+AI) solution from 6 building blocks.
// Presets exist to defeat the blank-field problem — concrete and relatable.

export type UseCaseBlockKey =
  | 'taskType'
  | 'input'
  | 'steps'
  | 'output'
  | 'data'
  | 'human'

export interface UseCaseBlockDef {
  key: UseCaseBlockKey
  label: string
  prefix: string // label used when assembling the plan text
  topic: string
  hint: string
  rows: number
}

export const USE_CASE_BLOCKS: UseCaseBlockDef[] = [
  {
    key: 'taskType',
    label: 'What kind of task is it?',
    prefix: 'Task type',
    topic: 'fit',
    hint: 'Repetitive, with clear rules? That’s what scripts are good at. Say what kind of task this is and why a computer could do it.',
    rows: 2,
  },
  {
    key: 'input',
    label: 'What goes in?',
    prefix: 'Input',
    topic: 'input',
    hint: 'What does the task start from — which files, exports or data? Is it the same shape every time?',
    rows: 2,
  },
  {
    key: 'steps',
    label: 'What are the steps?',
    prefix: 'Steps',
    topic: 'recipe',
    hint: 'Write the recipe a colleague could follow: step 1, step 2… If you can list the steps, you can script them.',
    rows: 5,
  },
  {
    key: 'output',
    label: 'What comes out?',
    prefix: 'Desired output',
    topic: 'result',
    hint: 'The concrete end result — a file, a list, a chart, a report? Be specific about the format.',
    rows: 2,
  },
  {
    key: 'data',
    label: 'What data & privacy?',
    prefix: 'Data & privacy',
    topic: 'privacy',
    hint: 'Which data does the task touch, and is any of it sensitive or personal?',
    rows: 2,
  },
  {
    key: 'human',
    label: 'Where does the human stay?',
    prefix: 'Role of the human',
    topic: 'control',
    hint: 'The script does the boring part — what do YOU still check or decide before anything goes out the door?',
    rows: 2,
  },
]

export interface UseCasePreset {
  key: string
  emoji: string
  label: string
  description: string
  problem: string
  task: string
  frequency: string
  timePer: string
  examples: Record<UseCaseBlockKey, string>
}

export const USE_CASE_PRESETS: UseCasePreset[] = [
  {
    key: 'merge',
    emoji: '📊',
    label: 'Merging spreadsheet exports',
    description: 'Exports from three systems, combined into one overview by hand.',
    problem:
      'Every week, exports from three different systems are combined into one overview by hand — copy, paste, fix the columns, repeat.',
    task: 'Merge the weekly exports into one clean overview with totals',
    frequency: '4 times per month',
    timePer: '3 hours each',
    examples: {
      taskType:
        'A repetitive data chore: the exact same merge steps every week — precisely what a script does well.',
      input:
        'Three CSV exports (sales, hours, costs) with the same columns every week.',
      steps:
        '1. Read the three exports\n2. Merge them on project code\n3. Add totals per department\n4. Save one clean overview file',
      output:
        'One CSV/Excel file with a row per project and totals per department, ready to email.',
      data: 'Only internal project numbers and amounts — no customer or personal data.',
      human:
        'I check the totals against last week and send the email myself.',
    },
  },
  {
    key: 'check',
    emoji: '🧾',
    label: 'Checking rows by eye',
    description: 'Invoices compared against a price list, row by row.',
    problem:
      'Incoming invoices are compared against the current price list row by row, by eye, to spot billing mistakes.',
    task: 'Check invoice rows against the price list and flag every difference',
    frequency: '8 times per month',
    timePer: '90 min each',
    examples: {
      taskType:
        'A checking task with clear rules: compare each row against a reference — perfect for a script, tireless and exact.',
      input: 'The invoice export and the current price list, both as CSV.',
      steps:
        '1. Read both files\n2. Match rows on article number\n3. Compare the price columns\n4. Collect every row that differs',
      output:
        'A short list of rows where the price differs, with both values side by side.',
      data: 'Supplier names and prices — internal, but no personal data.',
      human:
        'I decide what happens with each flagged difference; the script only flags.',
    },
  },
  {
    key: 'files',
    emoji: '📁',
    label: 'Sorting files by hand',
    description: 'Hundreds of documents renamed and filed into folders manually.',
    problem:
      'Hundreds of scanned documents are renamed and sorted into the right folders by hand, one at a time.',
    task: 'Rename the files and move them into the right folders',
    frequency: '2 times per week',
    timePer: '2 hours each',
    examples: {
      taskType:
        'A sorting task with fixed rules: the filename already tells you the year and the department.',
      input:
        'A folder of scanned PDFs with the date and department code in the filename.',
      steps:
        '1. Loop over the files\n2. Read the year and department from the name\n3. Create the target folder if needed\n4. Move and rename the file',
      output:
        'All files neatly in year/department folders with consistent names.',
      data: 'The documents may contain personal data — everything stays on our own drive, nothing goes to the cloud.',
      human:
        'I spot-check a sample and handle the files the script could not place.',
    },
  },
  {
    key: 'charts',
    emoji: '📈',
    label: 'Rebuilding the same charts',
    description: 'The same management charts, rebuilt with fresh data every time.',
    problem:
      'Management asks for the same three charts with fresh data every sprint, and someone rebuilds them in Excel from scratch each time.',
    task: 'Rebuild the standard charts from the fresh export',
    frequency: '2 times per week',
    timePer: '45 min each',
    examples: {
      taskType:
        'Repeat production: same charts, new data — a script with pandas and matplotlib redraws them in seconds.',
      input:
        'The fresh export from the dashboard tool, same columns every sprint.',
      steps:
        '1. Read the export\n2. Compute the sprint totals\n3. Draw the three standard charts\n4. Save them as PNGs for the deck',
      output:
        'Three PNG charts with titles and axis labels, ready for the slide deck.',
      data: 'Aggregated team numbers only — no individual performance data.',
      human:
        'I read the charts and write the story; the script only draws them.',
    },
  },
]

// Generic examples for "describe your own" — shapes instead of specifics.
export const USE_CASE_GENERIC_EXAMPLES: Record<UseCaseBlockKey, string> = {
  taskType:
    'A repetitive task with clear rules — the same steps every time, so a script can take it over.',
  input: 'The file or export the task starts from, in the same format every time.',
  steps: '1. Read the input\n2. Do the boring transformation\n3. Save or report the result',
  output: 'One concrete deliverable: a file, a list, a chart or a short report.',
  data: 'Which data it touches — and whether any of it is sensitive or personal.',
  human: 'What I still check or decide myself before the result goes anywhere.',
}
