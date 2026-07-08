// The Python Lab curriculum: 7 building blocks (one per course topic) and
// 4 preset datasets whose hoverable examples are tailored to the chosen data.

export type BlockKey =
  | 'variabelen'
  | 'kolommen'
  | 'mapping'
  | 'functie'
  | 'numpy'
  | 'pandas'
  | 'grafiek'

export interface BlockDef {
  key: BlockKey
  label: string
  topic: string // the course topic this block practices
  hint: string
  optional?: boolean
  rows: number
}

export const BLOCKS: BlockDef[] = [
  {
    key: 'variabelen',
    label: 'Parameters',
    topic: 'Variables & datatypes',
    hint: 'Name a few values you’ll reuse below — an int, a float, a string. Change one later and watch the whole script follow.',
    rows: 3,
  },
  {
    key: 'kolommen',
    label: 'Pick your columns',
    topic: 'Lists',
    hint: 'Put the column names you need in a list, then peek at the data with df[columns].head().',
    rows: 2,
  },
  {
    key: 'mapping',
    label: 'Translate values',
    topic: 'Dicts',
    hint: 'A dict maps raw values to friendlier labels. Use .map(...) to apply it as a new column.',
    optional: true,
    rows: 3,
  },
  {
    key: 'functie',
    label: 'Write a function',
    topic: 'Logic & functions',
    hint: 'def + if/else: classify each row with your own rule, then apply it with .apply(...).',
    rows: 6,
  },
  {
    key: 'numpy',
    label: 'Crunch the numbers',
    topic: 'NumPy',
    hint: 'Print a couple of summary statistics — mean, median, max, a percentile.',
    optional: true,
    rows: 2,
  },
  {
    key: 'pandas',
    label: 'The analysis',
    topic: 'Pandas',
    hint: 'groupby + an aggregation answers the mission. Store it in a variable called result — the chart block uses it.',
    rows: 3,
  },
  {
    key: 'grafiek',
    label: 'Draw the chart',
    topic: 'Matplotlib',
    hint: 'Plot your result. Give it a title and axis labels — a chart without labels is a riddle.',
    rows: 3,
  },
]

export interface Preset {
  key: string
  emoji: string
  label: string
  description: string
  question: string
  csv: string
  examples: Record<BlockKey, string>
}

const coffeeCsv = `date,product,category,price,quantity
2026-07-01,espresso,drink,2.50,2
2026-07-01,latte,drink,3.80,1
2026-07-01,croissant,food,2.20,2
2026-07-01,cappuccino,drink,3.40,3
2026-07-01,muffin,food,2.90,1
2026-07-02,espresso,drink,2.50,4
2026-07-02,flat white,drink,3.90,2
2026-07-02,brownie,food,3.10,2
2026-07-02,latte,drink,3.80,3
2026-07-02,tea,drink,2.30,1
2026-07-03,cappuccino,drink,3.40,2
2026-07-03,croissant,food,2.20,4
2026-07-03,espresso,drink,2.50,1
2026-07-03,muffin,food,2.90,3
2026-07-03,latte,drink,3.80,2
2026-07-04,flat white,drink,3.90,4
2026-07-04,brownie,food,3.10,1
2026-07-04,tea,drink,2.30,2
2026-07-04,espresso,drink,2.50,3
2026-07-04,cappuccino,drink,3.40,1
2026-07-05,latte,drink,3.80,4
2026-07-05,croissant,food,2.20,1
2026-07-05,muffin,food,2.90,2
2026-07-05,espresso,drink,2.50,2
2026-07-05,flat white,drink,3.90,1
2026-07-06,brownie,food,3.10,3
2026-07-06,latte,drink,3.80,1
2026-07-06,tea,drink,2.30,3
2026-07-06,cappuccino,drink,3.40,4
2026-07-06,espresso,drink,2.50,2
2026-07-07,croissant,food,2.20,3
2026-07-07,latte,drink,3.80,2
2026-07-07,muffin,food,2.90,1
2026-07-07,flat white,drink,3.90,3
2026-07-07,espresso,drink,2.50,1`

const weatherCsv = `date,station,temp_max,temp_min,rainfall_mm
2026-06-28,De Bilt,24.1,13.2,0.0
2026-06-28,Eelde,21.8,11.9,1.2
2026-06-28,Maastricht,26.3,14.8,0.0
2026-06-29,De Bilt,26.7,14.5,0.0
2026-06-29,Eelde,23.9,12.8,0.0
2026-06-29,Maastricht,28.4,16.1,0.0
2026-06-30,De Bilt,28.2,16.3,0.0
2026-06-30,Eelde,25.6,14.2,0.4
2026-06-30,Maastricht,30.1,17.9,0.0
2026-07-01,De Bilt,29.5,17.8,2.1
2026-07-01,Eelde,26.3,15.6,5.8
2026-07-01,Maastricht,31.2,18.4,0.6
2026-07-02,De Bilt,23.4,15.1,8.4
2026-07-02,Eelde,21.2,13.7,12.3
2026-07-02,Maastricht,25.8,16.2,4.1
2026-07-03,De Bilt,21.9,13.6,3.2
2026-07-03,Eelde,20.4,12.1,6.7
2026-07-03,Maastricht,23.6,14.5,1.8
2026-07-04,De Bilt,23.8,12.9,0.0
2026-07-04,Eelde,22.1,11.4,0.0
2026-07-04,Maastricht,25.4,13.8,0.0
2026-07-05,De Bilt,25.6,13.8,0.0
2026-07-05,Eelde,23.4,12.6,0.2
2026-07-05,Maastricht,27.7,15.2,0.0
2026-07-06,De Bilt,27.3,15.4,0.0
2026-07-06,Eelde,24.8,13.9,0.0
2026-07-06,Maastricht,29.5,16.8,0.0
2026-07-07,De Bilt,28.9,16.7,1.4
2026-07-07,Eelde,25.9,14.8,3.6
2026-07-07,Maastricht,30.8,17.6,0.0`

const fitnessCsv = `date,member_type,activity,duration_min
2026-07-01,student,spinning,45
2026-07-01,regular,weights,65
2026-07-01,premium,yoga,60
2026-07-01,student,weights,40
2026-07-01,premium,swimming,50
2026-07-02,regular,spinning,45
2026-07-02,student,yoga,55
2026-07-02,premium,weights,80
2026-07-02,regular,swimming,35
2026-07-02,student,spinning,45
2026-07-03,premium,spinning,50
2026-07-03,regular,yoga,60
2026-07-03,student,weights,35
2026-07-03,premium,weights,90
2026-07-03,regular,weights,55
2026-07-04,student,swimming,30
2026-07-04,premium,yoga,65
2026-07-04,regular,spinning,45
2026-07-04,student,yoga,50
2026-07-04,premium,swimming,55
2026-07-05,regular,weights,70
2026-07-05,student,spinning,40
2026-07-05,premium,weights,85
2026-07-05,regular,yoga,55
2026-07-05,student,weights,45
2026-07-06,premium,spinning,55
2026-07-06,regular,swimming,40
2026-07-06,student,yoga,60
2026-07-06,premium,yoga,70
2026-07-06,regular,weights,60
2026-07-07,student,swimming,25
2026-07-07,premium,weights,75
2026-07-07,regular,spinning,50
2026-07-07,student,weights,40`

const webshopCsv = `order_id,country,category,amount,items
1001,NL,electronics,129.99,1
1002,DE,clothing,54.50,3
1003,BE,home,89.95,2
1004,NL,clothing,34.99,2
1005,FR,electronics,249.00,1
1006,DE,home,45.25,1
1007,NL,sports,79.90,2
1008,BE,electronics,189.99,1
1009,FR,clothing,67.80,4
1010,DE,electronics,315.00,2
1011,NL,home,23.45,1
1012,BE,sports,54.99,1
1013,FR,home,112.30,3
1014,NL,electronics,89.99,1
1015,DE,sports,98.75,2
1016,BE,clothing,42.60,3
1017,NL,clothing,156.80,5
1018,FR,sports,73.20,1
1019,DE,clothing,29.99,1
1020,NL,home,67.50,2
1021,BE,home,134.90,4
1022,FR,electronics,499.00,1
1023,DE,home,58.40,2
1024,NL,sports,112.00,3
1025,BE,electronics,79.99,1
1026,FR,clothing,88.45,2
1027,DE,electronics,145.50,1
1028,NL,clothing,49.95,2
1029,BE,sports,167.30,3
1030,FR,home,39.99,1`

export const PRESETS: Preset[] = [
  {
    key: 'coffee',
    emoji: '☕',
    label: 'Coffee bar sales',
    description: 'A week of orders: products, prices, quantities.',
    question:
      'Which product brings in the most revenue — and does drink or food earn more?',
    csv: coffeeCsv,
    examples: {
      variabelen: `TOP_N = 3\nCHART_TITLE = "Revenue per product"\nPRICE_LIMIT = 3.0`,
      kolommen: `columns = ["product", "price", "quantity"]\nprint(df[columns].head())`,
      mapping: `groups = {"espresso": "coffee", "latte": "coffee", "cappuccino": "coffee",\n          "flat white": "coffee", "tea": "other drink"}\ndf["group"] = df["product"].map(groups).fillna("food")\nprint(df["group"].value_counts())`,
      functie: `def order_size(quantity):\n    if quantity >= 3:\n        return "large"\n    return "small"\n\ndf["size"] = df["quantity"].apply(order_size)\nprint(df["size"].value_counts())`,
      numpy: `print("Average price:", np.mean(df["price"]))\nprint("90th percentile:", np.percentile(df["price"], 90))`,
      pandas: `df["revenue"] = df["price"] * df["quantity"]\nresult = df.groupby("product")["revenue"].sum().sort_values(ascending=False)\nprint(result)`,
      grafiek: `result.head(TOP_N).plot(kind="bar", title=CHART_TITLE)\nplt.ylabel("Revenue (€)")\nplt.xlabel("")`,
    },
  },
  {
    key: 'weather',
    emoji: '🌦️',
    label: 'Weather stations',
    description: 'Ten days of temperature and rainfall at three Dutch stations.',
    question:
      'Which station was warmest on average — and on which day did it rain the most?',
    csv: weatherCsv,
    examples: {
      variabelen: `HOT_DAY = 25.0\nCHART_TITLE = "Average max temperature per station"`,
      kolommen: `columns = ["date", "station", "temp_max", "rainfall_mm"]\nprint(df[columns].head())`,
      mapping: `regions = {"De Bilt": "middle", "Eelde": "north", "Maastricht": "south"}\ndf["region"] = df["station"].map(regions)\nprint(df["region"].value_counts())`,
      functie: `def day_type(temp_max):\n    if temp_max >= HOT_DAY:\n        return "hot"\n    elif temp_max >= 20:\n        return "warm"\n    return "mild"\n\ndf["day_type"] = df["temp_max"].apply(day_type)\nprint(df["day_type"].value_counts())`,
      numpy: `print("Average max temp:", np.mean(df["temp_max"]))\nprint("Most rain in a day (mm):", np.max(df["rainfall_mm"]))`,
      pandas: `result = df.groupby("station")["temp_max"].mean().sort_values(ascending=False)\nprint(result)\nprint(df.groupby("date")["rainfall_mm"].sum().sort_values(ascending=False).head(3))`,
      grafiek: `result.plot(kind="bar", title=CHART_TITLE)\nplt.ylabel("°C")\nplt.xlabel("")`,
    },
  },
  {
    key: 'fitness',
    emoji: '🏋️',
    label: 'Fitness club check-ins',
    description: 'A week of sessions: member types, activities, duration.',
    question:
      'Which activity is most popular — and do premium members train longer than students?',
    csv: fitnessCsv,
    examples: {
      variabelen: `LONG_SESSION = 60\nCHART_TITLE = "Average session length per activity"`,
      kolommen: `columns = ["member_type", "activity", "duration_min"]\nprint(df[columns].head())`,
      mapping: `intensity = {"spinning": "cardio", "swimming": "cardio",\n             "weights": "strength", "yoga": "flexibility"}\ndf["kind"] = df["activity"].map(intensity)\nprint(df["kind"].value_counts())`,
      functie: `def session_label(duration_min):\n    if duration_min >= LONG_SESSION:\n        return "long"\n    return "short"\n\ndf["length"] = df["duration_min"].apply(session_label)\nprint(df["length"].value_counts())`,
      numpy: `print("Average duration:", np.mean(df["duration_min"]))\nprint("Median duration:", np.median(df["duration_min"]))`,
      pandas: `result = df.groupby("activity")["duration_min"].mean().sort_values(ascending=False)\nprint(result)\nprint(df.groupby("member_type")["duration_min"].mean())`,
      grafiek: `result.plot(kind="bar", title=CHART_TITLE)\nplt.ylabel("minutes")\nplt.xlabel("")`,
    },
  },
  {
    key: 'webshop',
    emoji: '🛒',
    label: 'Webshop orders',
    description: 'Thirty orders across four countries and four categories.',
    question:
      'Which country spends the most per order — and which category sells best?',
    csv: webshopCsv,
    examples: {
      variabelen: `BIG_ORDER = 100.0\nCHART_TITLE = "Average order value per country"`,
      kolommen: `columns = ["country", "category", "amount"]\nprint(df[columns].head())`,
      mapping: `names = {"NL": "Netherlands", "DE": "Germany", "BE": "Belgium", "FR": "France"}\ndf["country_name"] = df["country"].map(names)\nprint(df["country_name"].value_counts())`,
      functie: `def order_label(amount):\n    if amount >= BIG_ORDER:\n        return "big"\n    return "regular"\n\ndf["order_type"] = df["amount"].apply(order_label)\nprint(df["order_type"].value_counts())`,
      numpy: `print("Average order:", np.mean(df["amount"]))\nprint("Biggest order:", np.max(df["amount"]))`,
      pandas: `result = df.groupby("country")["amount"].mean().sort_values(ascending=False)\nprint(result)\nprint(df.groupby("category")["amount"].sum().sort_values(ascending=False))`,
      grafiek: `result.plot(kind="bar", title=CHART_TITLE)\nplt.ylabel("€ per order")\nplt.xlabel("")`,
    },
  },
]

// Generic examples for "bring your own data" — placeholders instead of real columns.
export const GENERIC_EXAMPLES: Record<BlockKey, string> = {
  variabelen: `TOP_N = 3\nCHART_TITLE = "My analysis"`,
  kolommen: `columns = ["column_a", "column_b"]\nprint(df[columns].head())`,
  mapping: `labels = {"raw_value": "nice label", "other_value": "other label"}\ndf["label"] = df["column_a"].map(labels).fillna("other")`,
  functie: `def classify(value):\n    if value >= 10:\n        return "high"\n    return "low"\n\ndf["class"] = df["column_b"].apply(classify)\nprint(df["class"].value_counts())`,
  numpy: `print("Mean:", np.mean(df["column_b"]))\nprint("Max:", np.max(df["column_b"]))`,
  pandas: `result = df.groupby("column_a")["column_b"].mean().sort_values(ascending=False)\nprint(result)`,
  grafiek: `result.plot(kind="bar", title=CHART_TITLE)\nplt.ylabel("value")\nplt.xlabel("")`,
}
