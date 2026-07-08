import { Badge, Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react'

interface Topic {
  title: string
  day: string
  snippet: string
}

const TOPICS: Topic[] = [
  {
    title: 'Variables & datatypes',
    day: 'Day 1',
    snippet: `name = "Ada"          # str
count = 3             # int
price = 2.50          # float
is_open = True        # bool
print(type(price))    # <class 'float'>`,
  },
  {
    title: 'Lists',
    day: 'Day 1',
    snippet: `drinks = ["espresso", "latte", "tea"]
drinks.append("mocha")
print(drinks[0])       # first item
print(drinks[-1])      # last item
print(len(drinks))     # how many
for d in drinks:
    print(d)`,
  },
  {
    title: 'Dicts',
    day: 'Day 1',
    snippet: `prices = {"espresso": 2.50, "latte": 3.80}
prices["tea"] = 2.30           # add a key
print(prices["latte"])         # look up
print(prices.get("mocha", 0))  # safe lookup
for product, price in prices.items():
    print(product, price)`,
  },
  {
    title: 'Logic, methods & functions',
    day: 'Day 1',
    snippet: `def order_size(quantity):
    if quantity >= 3:
        return "large"
    elif quantity == 2:
        return "medium"
    return "small"

print(order_size(4))       # large
print("LaTTe".lower())     # string method`,
  },
  {
    title: 'NumPy',
    day: 'Day 2',
    snippet: `import numpy as np

values = np.array([2.5, 3.8, 2.3, 3.4])
print(np.mean(values))
print(np.median(values))
print(np.max(values))
print(np.percentile(values, 90))`,
  },
  {
    title: 'Pandas',
    day: 'Day 2',
    snippet: `import pandas as pd

df = pd.read_csv("data.csv")
print(df.head())
print(df["price"].mean())
df["revenue"] = df["price"] * df["quantity"]
result = df.groupby("product")["revenue"].sum()
print(result.sort_values(ascending=False))`,
  },
  {
    title: 'Matplotlib',
    day: 'Day 2',
    snippet: `import matplotlib.pyplot as plt

result.plot(kind="bar", title="Revenue")
plt.ylabel("Revenue (€)")
plt.xlabel("")
plt.tight_layout()
plt.show()`,
  },
  {
    title: 'Putting it together',
    day: 'The capstone',
    snippet: `# read → enrich → group → plot
df = pd.read_csv("data.csv")
df["label"] = df["quantity"].apply(order_size)
result = df.groupby("label")["price"].mean()
result.plot(kind="bar")`,
  },
]

export default function Cheatsheet() {
  return (
    <Box h="100%" overflowY="auto" px={{ base: 6, lg: 10 }} py={8}>
      <Box maxW="1100px" mx="auto">
        <Heading fontSize="2xl">Cheatsheet</Heading>
        <Text color="gray.500" mt={1} mb={8}>
          The whole course on one page — peek whenever a block has you stuck.
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {TOPICS.map((t) => (
            <Box
              key={t.title}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              overflow="hidden"
            >
              <Flex
                bg="gray.50"
                px={4}
                py={2}
                borderBottom="1px solid"
                borderColor="gray.100"
                justify="space-between"
                align="center"
              >
                <Text fontSize="sm" fontWeight={600} fontFamily="body">
                  {t.title}
                </Text>
                <Badge colorScheme="purple" variant="subtle">
                  {t.day}
                </Badge>
              </Flex>
              <Box
                as="pre"
                p={4}
                m={0}
                fontFamily="mono"
                fontSize="xs"
                whiteSpace="pre-wrap"
                color="gray.700"
              >
                {t.snippet}
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  )
}
