import { Badge, Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react'

interface Topic {
  title: string
  day: string
  snippet: string
}

const TOPICS: Topic[] = [
  {
    title: 'Features, target & split',
    day: 'The basics',
    snippet: `from sklearn.model_selection import train_test_split

X = df[["size_m2", "age_years"]]   # features
y = df["price"]                    # target
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42)
# train = learn, test = the exam it never saw`,
  },
  {
    title: 'Regression — predict a number',
    day: 'Topic 1',
    snippet: `from sklearn.linear_model import LinearRegression

reg = LinearRegression()
reg.fit(X_train, y_train)          # learn
pred = reg.predict(X_test)         # predict
print(reg.coef_, reg.intercept_)   # the line it found`,
  },
  {
    title: 'Judging a regression',
    day: 'Topic 1',
    snippet: `from sklearn.metrics import mean_absolute_error, r2_score

print(mean_absolute_error(y_test, pred))
# MAE: how far off, on average, in real units
print(r2_score(y_test, pred))
# R²: 1.0 = perfect, 0 = no better than the mean`,
  },
  {
    title: 'Classification — predict a category',
    day: 'Topic 2',
    snippet: `from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

clf = DecisionTreeClassifier(max_depth=3, random_state=42)
clf.fit(X_train, y_train)
print(accuracy_score(y_test, clf.predict(X_test)))
# accuracy: the share of test rows it got right`,
  },
  {
    title: 'Reading the mistakes',
    day: 'Topic 2',
    snippet: `from sklearn.metrics import confusion_matrix
import pandas as pd

print(confusion_matrix(y_test, clf.predict(X_test)))
# rows = truth, columns = prediction
pd.crosstab(y_test, clf.predict(X_test))
# same thing, with readable labels`,
  },
  {
    title: 'Clustering — find hidden groups',
    day: 'Topic 3',
    snippet: `from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

scaled = StandardScaler().fit_transform(df[["visits", "spend"]])
km = KMeans(n_clusters=3, n_init=10, random_state=42)
df["cluster"] = km.fit_predict(scaled)
print(df.groupby("cluster").mean())  # what IS each group?
# no labels needed — scale first, always`,
  },
  {
    title: 'Ensemble — ask the forest',
    day: 'Topic 4',
    snippet: `from sklearn.ensemble import RandomForestRegressor
# (RandomForestClassifier for categories)

forest = RandomForestRegressor(n_estimators=100,
                               random_state=42)
forest.fit(X_train, y_train)
# 100 trees vote — usually beats one model
print(forest.feature_importances_)  # what mattered`,
  },
  {
    title: 'Putting it together',
    day: 'The capstone',
    snippet: `# split → fit → predict → score, always the same rhythm
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42)
model.fit(X_train, y_train)
pred = model.predict(X_test)
# score on the TEST set — never on the train set
# random_state=42 makes every run reproducible`,
  },
]

export default function MLCheatsheet() {
  return (
    <Box h="100%" overflowY="auto" px={{ base: 6, lg: 10 }} py={8}>
      <Box maxW="1100px" mx="auto">
        <Heading fontSize="2xl">ML Cheatsheet</Heading>
        <Text color="gray.500" mt={1} mb={8}>
          The whole training on one page — peek whenever a block has you stuck.
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
