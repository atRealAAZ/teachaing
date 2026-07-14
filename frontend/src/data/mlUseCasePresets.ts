// The ML Use Case Lab curriculum: participants describe a prediction or
// decision from their own work, then design an ML solution from 6 building
// blocks. Presets exist to defeat the blank-field problem.

export type MLUseCaseBlockKey =
  | 'predict'
  | 'data'
  | 'problemType'
  | 'volume'
  | 'mistakes'
  | 'human'

export interface MLUseCaseBlockDef {
  key: MLUseCaseBlockKey
  label: string
  prefix: string // label used when assembling the plan text
  topic: string
  hint: string
  rows: number
}

export const ML_USE_CASE_BLOCKS: MLUseCaseBlockDef[] = [
  {
    key: 'predict',
    label: 'What do you want to predict?',
    prefix: 'Prediction target',
    topic: 'target',
    hint: 'One concrete thing per row: a number (regression), a category (classification), or “I want to discover groups” (clustering).',
    rows: 2,
  },
  {
    key: 'data',
    label: 'What data do you have?',
    prefix: 'Available data',
    topic: 'features',
    hint: 'Which columns could the model learn from — and crucially: does your history already contain the right answer for past cases?',
    rows: 3,
  },
  {
    key: 'problemType',
    label: 'Which type of ML problem?',
    prefix: 'Problem type',
    topic: 'fit',
    hint: 'Name it like in the training: regression, classification or clustering — and say why. If simple if/else rules would do the job, say that too.',
    rows: 2,
  },
  {
    key: 'volume',
    label: 'How many examples?',
    prefix: 'Data volume',
    topic: 'volume',
    hint: 'Roughly how many historical rows do you have, and how fast do new ones arrive? Models learn from examples — dozens is thin, hundreds is workable.',
    rows: 2,
  },
  {
    key: 'mistakes',
    label: 'What does a mistake cost?',
    prefix: 'Cost of mistakes',
    topic: 'risk',
    hint: 'No model is 100% right. What happens on a wrong prediction — mild annoyance or real damage? And which mistake is worse: a false alarm or a miss?',
    rows: 2,
  },
  {
    key: 'human',
    label: 'Where does the human stay?',
    prefix: 'Role of the human',
    topic: 'control',
    hint: 'The model predicts, a person decides. What do YOU still check before the prediction leads to action?',
    rows: 2,
  },
]

export interface MLUseCasePreset {
  key: string
  emoji: string
  label: string
  description: string
  problem: string
  task: string
  frequency: string
  timePer: string
  examples: Record<MLUseCaseBlockKey, string>
}

export const ML_USE_CASE_PRESETS: MLUseCasePreset[] = [
  {
    key: 'churn',
    emoji: '📉',
    label: 'Spotting customers about to leave',
    description: 'Churn is only noticed after the cancellation email arrives.',
    problem:
      'We only find out a customer is unhappy when the cancellation comes in. By then it is too late — while the signals (fewer logins, fewer orders, more support tickets) were in our systems all along.',
    task: 'Flag every month which customers are likely to cancel soon',
    frequency: '1 time per month',
    timePer: '8 hours each',
    examples: {
      predict:
        'Per customer: will they cancel within the next 3 months — yes or no?',
      data: 'Customer history: logins per week, orders per month, support tickets, contract age. And for past customers we know who actually cancelled — that is the label.',
      problemType:
        'Classification: two classes (stays / leaves). Later maybe clustering to find types of at-risk customers.',
      volume:
        'About 2,000 customers, 5 years of history, roughly 300 known cancellations to learn from.',
      mistakes:
        'A false alarm costs a needless phone call; a miss costs a customer. A miss is worse — we would rather call too often.',
      human:
        'The model produces a monthly risk list; account managers decide who to actually call and how.',
    },
  },
  {
    key: 'quote',
    emoji: '💶',
    label: 'Estimating quotes from experience',
    description: 'Every quote starts with a senior guessing the hours.',
    problem:
      'Every quote depends on one senior colleague estimating the hours from experience. Estimates vary per person, and when she is on holiday, quotes stall.',
    task: 'Predict the hours for a new job from the past jobs we invoiced',
    frequency: '12 times per month',
    timePer: '90 min each',
    examples: {
      predict: 'The number of hours a new job will take (a number → regression).',
      data: 'Five years of invoiced jobs: job type, size, customer segment, materials — and the hours actually spent. The answer is already in the history.',
      problemType:
        'Regression: predict a number. A random forest is a good fit — job types interact in ways a straight line misses.',
      volume: 'Around 800 completed jobs, about 15 new ones per month.',
      mistakes:
        'Too low means we eat the loss, too high means we lose the deal. Show a range, not one magic number.',
      human:
        'The model gives a first estimate plus similar past jobs; the estimator adjusts and signs off every quote.',
    },
  },
  {
    key: 'triage',
    emoji: '🎫',
    label: 'Sorting the support inbox',
    description: 'Every ticket is read and routed to the right team by hand.',
    problem:
      'All support tickets land in one inbox. Someone reads each one and forwards it to the right team — billing, technical, returns. Urgent ones sometimes wait hours just to be routed.',
    task: 'Automatically sort incoming tickets by team and urgency',
    frequency: '20 times per week',
    timePer: '30 min each',
    examples: {
      predict:
        'Per ticket: which team it belongs to, and urgent yes/no — two classifications.',
      data: 'Thousands of old tickets, each with its text and the team that eventually handled it — history that is already labeled.',
      problemType:
        'Classification on text. Start simple with keywords as features; an AI assistant can also classify text directly without training.',
      volume: 'About 4,000 handled tickets per year, 80 new ones per week.',
      mistakes:
        'A misrouted ticket loses an hour. Annoying, not fatal — except urgent ones: missing “urgent” is the expensive mistake.',
      human:
        'The model sorts, but every team can bounce a ticket back — and those corrections become new training data.',
    },
  },
  {
    key: 'segments',
    emoji: '👥',
    label: 'Finding customer segments',
    description: 'One newsletter for everyone, because “our customers” is a blur.',
    problem:
      'Marketing treats all customers the same because nobody knows which groups exist. Gut feeling says “students, families, businesses” — but the data has never been asked.',
    task: 'Group customers into segments based on their actual behaviour',
    frequency: '1 time per month',
    timePer: '4 hours each',
    examples: {
      predict:
        'No target — I want to discover which natural groups exist in the customer base (clustering).',
      data: 'Per customer: order frequency, average amount, product categories, time of day, customer age. No labels needed — that is the point.',
      problemType:
        'Clustering with KMeans: no right answers to learn from, the structure comes out of the data itself.',
      volume: 'About 5,000 customers with a year of order history.',
      mistakes:
        'Low risk: a segmentation cannot really be “wrong”, only useless. The test is whether marketing recognises the groups and can act on them.',
      human:
        'The model proposes the groups; marketing names them, judges whether they make sense, and designs a campaign per segment.',
    },
  },
]

// Generic examples for "describe your own" — shapes instead of specifics.
export const ML_USE_CASE_GENERIC_EXAMPLES: Record<MLUseCaseBlockKey, string> = {
  predict:
    'The one thing to predict per row: a number (regression), a category (classification), or groups to discover (clustering).',
  data: 'The columns the model could learn from — and whether your history already contains the right answer for past cases.',
  problemType:
    'Regression, classification or clustering — and why. Or: honest doubt whether simple rules would already do the job.',
  volume: 'How many historical examples you have, and how fast new ones arrive.',
  mistakes:
    'What one wrong prediction costs, and which mistake hurts more: a false alarm or a miss.',
  human: 'What a person still checks or decides before the prediction leads to action.',
}
