// The Machine Learning Lab curriculum: 7 building blocks covering the four
// course topics (regression, classification, clustering, ensemble methods)
// and 4 preset datasets whose hoverable examples are tailored to the data.

export type MLBlockKey =
  | 'setup'
  | 'features'
  | 'regressie'
  | 'classificatie'
  | 'clustering'
  | 'ensemble'
  | 'grafiek'

export interface MLBlockDef {
  key: MLBlockKey
  label: string
  topic: string // the course topic this block practices
  hint: string
  optional?: boolean
  rows: number
}

export const ML_BLOCKS: MLBlockDef[] = [
  {
    key: 'setup',
    label: 'Parameters',
    topic: 'Setup',
    hint: 'Fix your randomness: RANDOM_STATE makes every run reproducible, TEST_SIZE decides how much data the model never sees during training.',
    rows: 3,
  },
  {
    key: 'features',
    label: 'Features & target',
    topic: 'Data prep',
    hint: 'Pick feature columns as X and what you want to predict as y, then split into train and test — the test rows are the exam.',
    rows: 5,
  },
  {
    key: 'regressie',
    label: 'Predict a number',
    topic: 'Regression',
    hint: 'Fit a LinearRegression on the training rows, predict the test rows, and judge it honestly with MAE and R² — on the test set, never the train set.',
    rows: 7,
  },
  {
    key: 'classificatie',
    label: 'Predict a category',
    topic: 'Classification',
    hint: 'Now predict a label instead of a number: fit a DecisionTreeClassifier and score it with accuracy on the test rows.',
    rows: 7,
  },
  {
    key: 'clustering',
    label: 'Find hidden groups',
    topic: 'Clustering',
    hint: 'No labels this time — KMeans finds groups on its own. Scale the features first, then inspect what each cluster actually means.',
    rows: 6,
  },
  {
    key: 'ensemble',
    label: 'Ask the forest',
    topic: 'Ensemble methods',
    hint: 'Many trees beat one: fit a RandomForest and compare its score against your single model. If it wins, that is the ensemble lesson in one print().',
    rows: 6,
  },
  {
    key: 'grafiek',
    label: 'Show the model',
    topic: 'Visualise',
    hint: 'Plot actual vs predicted, or the clusters in a scatter. A model you can see is a model you can trust — give it a title and axis labels.',
    rows: 6,
  },
]

export interface MLPreset {
  key: string
  emoji: string
  label: string
  description: string
  question: string
  csv: string
  examples: Record<MLBlockKey, string>
}

const housesCsv = `size_m2,rooms,age_years,distance_km,energy_label,price
149,4,77,17.6,C,468000
147,4,70,3.6,D,514000
170,6,74,11.4,C,573000
53,1,74,16.0,D,160000
176,5,70,5.3,D,596000
65,3,61,18.7,D,205000
95,1,17,3.7,B,400000
135,4,39,20.9,C,471000
157,4,34,7.6,C,575000
71,3,0,19.8,A,305000
150,4,51,3.9,C,534000
108,3,50,19.2,D,365000
120,4,2,11.2,A,497000
160,4,21,1.9,B,620000
134,3,70,16.8,C,449000
67,2,2,2.7,A,357000
66,3,13,17.6,A,299000
85,2,56,9.4,C,302000
174,5,62,7.0,D,584000
141,5,40,7.2,C,513000
106,4,27,14.7,B,391000
147,3,64,11.1,D,509000
132,4,37,1.5,B,525000
64,1,9,14.9,A,293000
123,3,53,1.1,D,436000
150,4,7,12.4,A,593000
122,3,24,8.6,B,470000
47,1,74,22.5,C,135000
59,1,25,16.7,C,246000
59,2,82,6.1,C,211000
95,1,72,8.3,D,328000
114,4,23,23.4,B,410000
103,4,80,18.8,D,314000
115,4,28,19.4,C,428000
57,2,23,23.5,B,253000
157,5,13,4.9,A,610000
86,3,87,12.8,C,289000
76,3,11,17.1,A,335000
138,5,17,20.2,C,480000
62,1,11,23.2,A,272000
110,3,86,7.5,D,358000
119,3,57,3.1,C,444000
175,4,83,20.2,D,533000
47,1,9,20.8,A,210000
116,4,78,15.3,C,372000
133,4,78,11.6,C,431000
145,5,9,2.1,A,600000
156,5,27,4.0,C,590000`

const customersCsv = `age,months_member,visits_per_month,avg_spend,churned
32,10,2.1,9.2,yes
27,4,8.5,25.49,no
34,30,12.3,32.17,no
27,14,3.9,19.01,yes
21,23,7.6,20.07,no
21,55,1.8,18.81,yes
66,48,11.0,34.46,no
25,32,7.4,28.75,no
37,38,4.1,17.19,no
39,14,5.5,20.24,no
37,41,4.5,23.5,no
42,20,7.7,28.4,no
58,32,9.0,25.61,no
28,41,12.1,35.77,no
23,43,1.6,9.09,yes
65,48,8.5,30.96,no
65,15,8.5,22.09,no
46,34,6.8,24.29,no
58,30,8.6,24.79,no
24,6,9.4,27.18,no
51,20,12.6,34.16,no
36,19,2.6,13.46,yes
40,23,10.4,27.06,no
57,29,5.6,24.1,no
65,7,12.0,29.63,no
47,41,0.7,15.55,no
33,28,6.5,23.17,no
57,7,14.0,34.61,no
60,7,14.0,32.46,no
23,53,0.9,11.73,yes
57,12,12.8,34.24,no
19,4,8.7,18.98,no
60,4,11.3,27.48,no
53,50,1.0,11.29,yes
49,51,2.6,12.67,no
32,42,13.7,34.92,no
49,3,12.4,25.0,no
23,11,13.7,32.46,no
50,34,2.5,18.31,yes
47,42,9.3,33.17,no
43,24,6.9,28.32,no
32,18,6.3,20.93,no
39,25,3.4,8.67,no
20,25,6.9,25.56,no
46,42,9.2,30.18,no
57,33,6.3,22.2,yes
44,44,12.5,38.59,no
44,48,4.7,18.52,no`

const bikesCsv = `temp_c,rain_mm,wind_kmh,is_weekend,rentals,busy
27.3,0.0,16,0,387,yes
11.4,0.6,5,0,126,no
13.2,0.1,29,1,165,no
30.8,0.1,32,0,410,yes
21.2,0.0,13,0,340,yes
7.0,0.0,44,0,40,no
31.7,0.0,22,0,501,yes
24.7,1.8,23,1,368,yes
29.2,0.0,14,1,498,yes
19.6,2.0,8,1,319,yes
21.1,2.3,31,0,245,no
13.0,0.7,18,0,199,no
25.1,1.5,25,0,294,yes
27.5,0.3,24,0,351,yes
14.0,4.9,30,1,204,no
7.7,0.0,42,0,91,no
20.0,0.0,16,0,302,yes
31.5,0.7,24,0,442,yes
23.6,8.9,36,0,145,no
24.0,0.7,27,0,376,yes
31.5,0.9,34,0,395,yes
5.7,0.0,36,0,94,no
15.9,2.6,21,0,218,no
18.7,1.8,41,0,216,no
13.2,0.0,9,0,161,no
25.2,6.4,34,0,209,no
9.0,0.0,39,1,206,no
22.3,0.0,21,0,368,yes
9.1,2.3,18,0,75,no
19.7,0.0,15,0,254,no
4.5,0.0,33,0,125,no
10.9,1.3,10,0,88,no
13.8,0.6,24,1,332,yes
4.0,0.0,5,0,94,no
12.3,0.0,43,0,116,no
10.5,1.8,14,0,143,no
17.9,1.9,28,0,181,no
9.2,0.0,11,0,165,no
18.8,0.0,36,0,271,no
31.8,0.3,37,0,407,yes
7.6,0.6,9,0,104,no
17.4,2.7,6,0,186,no
3.2,2.5,7,0,12,no
11.4,0.0,9,0,222,no
22.9,0.3,17,0,351,yes
2.0,0.0,39,1,92,no
16.7,0.0,22,0,205,no
9.8,0.0,14,0,123,no`

const penguinsCsv = `species,bill_mm,flipper_mm,body_mass_g
Adelie,42.3,191,3870
Chinstrap,46.1,189,3790
Gentoo,47.6,220,5040
Adelie,39.5,190,3870
Chinstrap,50.7,187,3190
Gentoo,49.9,223,4880
Adelie,34.3,190,3900
Chinstrap,53.1,198,3660
Gentoo,45.4,217,5000
Adelie,36.4,201,4150
Chinstrap,51.5,190,3890
Gentoo,49.0,219,5360
Adelie,40.3,194,3860
Chinstrap,49.6,186,3700
Gentoo,46.2,209,5400
Adelie,42.9,197,3790
Chinstrap,52.0,196,3770
Gentoo,44.9,219,5090
Adelie,35.7,189,3680
Chinstrap,53.1,200,3750
Gentoo,48.1,217,5030
Adelie,36.2,189,3530
Chinstrap,45.8,198,3830
Gentoo,43.2,216,5280
Adelie,41.3,195,3730
Chinstrap,46.8,190,3770
Gentoo,48.4,224,5350
Adelie,38.5,183,3590
Chinstrap,49.3,194,3590
Gentoo,48.1,214,4920
Adelie,39.5,187,3740
Chinstrap,49.5,189,3590
Gentoo,51.0,210,4570
Adelie,34.3,190,3710
Chinstrap,48.5,202,3170
Gentoo,48.5,225,4860
Adelie,37.9,185,3480
Chinstrap,48.0,203,4170
Gentoo,46.7,227,5130
Adelie,43.0,189,3720
Chinstrap,49.7,213,4010
Gentoo,45.8,222,5020
Adelie,37.6,194,3730
Chinstrap,49.5,196,3800
Gentoo,48.5,206,5160
Adelie,36.4,182,3650
Chinstrap,49.0,192,3890
Gentoo,44.3,214,4930`

export const ML_PRESETS: MLPreset[] = [
  {
    key: 'houses',
    emoji: '🏠',
    label: 'House prices',
    description: '48 houses: size, age, distance to the city, energy label, price.',
    question:
      'Predict the price of a house from its size, age and location — and can a model guess the energy label too?',
    csv: housesCsv,
    examples: {
      setup: `RANDOM_STATE = 42\nTEST_SIZE = 0.25\nN_CLUSTERS = 3`,
      features: `from sklearn.model_selection import train_test_split\n\nfeatures = ["size_m2", "age_years", "distance_km"]\nX = df[features]\ny = df["price"]\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE)\nprint(len(X_train), "train rows,", len(X_test), "test rows")`,
      regressie: `from sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_absolute_error, r2_score\n\nreg = LinearRegression()\nreg.fit(X_train, y_train)\npred = reg.predict(X_test)\nprint("MAE: €", round(mean_absolute_error(y_test, pred)))\nprint("R²:", round(r2_score(y_test, pred), 2))`,
      classificatie: `from sklearn.tree import DecisionTreeClassifier\nfrom sklearn.metrics import accuracy_score\n\nXc = df[["age_years"]]  # the label mostly follows the age of the house\nlabels = df["energy_label"]\nXc_train, Xc_test, yc_train, yc_test = train_test_split(\n    Xc, labels, test_size=TEST_SIZE, random_state=RANDOM_STATE)\nclf = DecisionTreeClassifier(max_depth=3, random_state=RANDOM_STATE)\nclf.fit(Xc_train, yc_train)\nprint("Label accuracy:", round(accuracy_score(yc_test, clf.predict(Xc_test)), 2))`,
      clustering: `from sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans\n\nscaled = StandardScaler().fit_transform(df[["size_m2", "price"]])\nkm = KMeans(n_clusters=N_CLUSTERS, n_init=10, random_state=RANDOM_STATE)\ndf["cluster"] = km.fit_predict(scaled)\nprint(df.groupby("cluster")[["size_m2", "price"]].mean().round(0))`,
      ensemble: `from sklearn.ensemble import RandomForestRegressor\n\nforest = RandomForestRegressor(n_estimators=100, random_state=RANDOM_STATE)\nforest.fit(X_train, y_train)\nforest_pred = forest.predict(X_test)\nprint("Forest MAE: €", round(mean_absolute_error(y_test, forest_pred)))\nprint("Single model MAE: €", round(mean_absolute_error(y_test, pred)))`,
      grafiek: `plt.scatter(y_test, pred, label="linear regression")\nplt.scatter(y_test, forest_pred, label="random forest")\nlims = [y_test.min(), y_test.max()]\nplt.plot(lims, lims, "k--", label="perfect prediction")\nplt.xlabel("actual price (€)")\nplt.ylabel("predicted price (€)")\nplt.title("Actual vs predicted")\nplt.legend()`,
    },
  },
  {
    key: 'churn',
    emoji: '🏃',
    label: 'Gym member churn',
    description: '48 members: age, tenure, visits, spend — and who cancelled.',
    question:
      'Predict which members are about to cancel — and discover the natural member segments while you are at it.',
    csv: customersCsv,
    examples: {
      setup: `RANDOM_STATE = 42\nTEST_SIZE = 0.25\nN_CLUSTERS = 3`,
      features: `from sklearn.model_selection import train_test_split\n\nfeatures = ["age", "months_member", "visits_per_month"]\nX = df[features]\ny = df["avg_spend"]\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE)\nprint(len(X_train), "train rows,", len(X_test), "test rows")`,
      regressie: `from sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_absolute_error, r2_score\n\nreg = LinearRegression()\nreg.fit(X_train, y_train)\npred = reg.predict(X_test)\nprint("Spend MAE: €", round(mean_absolute_error(y_test, pred), 2))\nprint("R²:", round(r2_score(y_test, pred), 2))`,
      classificatie: `from sklearn.tree import DecisionTreeClassifier\nfrom sklearn.metrics import accuracy_score\n\nchurn = df["churned"]\nXc_train, Xc_test, yc_train, yc_test = train_test_split(\n    X, churn, test_size=TEST_SIZE, random_state=RANDOM_STATE)\nclf = DecisionTreeClassifier(max_depth=3, random_state=RANDOM_STATE)\nclf.fit(Xc_train, yc_train)\nprint("Churn accuracy:", round(accuracy_score(yc_test, clf.predict(Xc_test)), 2))`,
      clustering: `from sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans\n\nscaled = StandardScaler().fit_transform(df[["visits_per_month", "avg_spend"]])\nkm = KMeans(n_clusters=N_CLUSTERS, n_init=10, random_state=RANDOM_STATE)\ndf["segment"] = km.fit_predict(scaled)\nprint(df.groupby("segment")[["visits_per_month", "avg_spend"]].mean().round(1))`,
      ensemble: `from sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import accuracy_score\n\nforest = RandomForestClassifier(n_estimators=100, random_state=RANDOM_STATE)\nforest.fit(Xc_train, yc_train)\nprint("Forest accuracy:", round(accuracy_score(yc_test, forest.predict(Xc_test)), 2))\nprint("Single tree accuracy:", round(accuracy_score(yc_test, clf.predict(Xc_test)), 2))`,
      grafiek: `for segment, group in df.groupby("segment"):\n    plt.scatter(group["visits_per_month"], group["avg_spend"],\n                label=f"segment {segment}")\nplt.xlabel("visits per month")\nplt.ylabel("average spend (€)")\nplt.title("Member segments found by KMeans")\nplt.legend()`,
    },
  },
  {
    key: 'bikes',
    emoji: '🚲',
    label: 'Bike rentals & weather',
    description: '48 days: temperature, rain, wind, weekend — and rentals.',
    question:
      'Predict how many bikes get rented from the weather — and does the random forest beat a single model?',
    csv: bikesCsv,
    examples: {
      setup: `RANDOM_STATE = 42\nTEST_SIZE = 0.25\nN_CLUSTERS = 3`,
      features: `from sklearn.model_selection import train_test_split\n\nfeatures = ["temp_c", "rain_mm", "wind_kmh", "is_weekend"]\nX = df[features]\ny = df["rentals"]\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE)\nprint(len(X_train), "train rows,", len(X_test), "test rows")`,
      regressie: `from sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_absolute_error, r2_score\n\nreg = LinearRegression()\nreg.fit(X_train, y_train)\npred = reg.predict(X_test)\nprint("MAE:", round(mean_absolute_error(y_test, pred)), "bikes")\nprint("R²:", round(r2_score(y_test, pred), 2))`,
      classificatie: `from sklearn.tree import DecisionTreeClassifier\nfrom sklearn.metrics import accuracy_score\n\nbusy = df["busy"]\nXc_train, Xc_test, yc_train, yc_test = train_test_split(\n    X, busy, test_size=TEST_SIZE, random_state=RANDOM_STATE)\nclf = DecisionTreeClassifier(max_depth=3, random_state=RANDOM_STATE)\nclf.fit(Xc_train, yc_train)\nprint("Busy-day accuracy:", round(accuracy_score(yc_test, clf.predict(Xc_test)), 2))`,
      clustering: `from sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans\n\nscaled = StandardScaler().fit_transform(df[["temp_c", "rentals"]])\nkm = KMeans(n_clusters=N_CLUSTERS, n_init=10, random_state=RANDOM_STATE)\ndf["day_type"] = km.fit_predict(scaled)\nprint(df.groupby("day_type")[["temp_c", "rain_mm", "rentals"]].mean().round(1))`,
      ensemble: `from sklearn.ensemble import RandomForestRegressor\n\nforest = RandomForestRegressor(n_estimators=100, random_state=RANDOM_STATE)\nforest.fit(X_train, y_train)\nforest_pred = forest.predict(X_test)\nprint("Forest MAE:", round(mean_absolute_error(y_test, forest_pred)), "bikes")\nprint("Single model MAE:", round(mean_absolute_error(y_test, pred)), "bikes")`,
      grafiek: `plt.scatter(y_test, pred, label="linear regression")\nplt.scatter(y_test, forest_pred, label="random forest")\nlims = [y_test.min(), y_test.max()]\nplt.plot(lims, lims, "k--", label="perfect prediction")\nplt.xlabel("actual rentals")\nplt.ylabel("predicted rentals")\nplt.title("Actual vs predicted rentals")\nplt.legend()`,
    },
  },
  {
    key: 'penguins',
    emoji: '🐧',
    label: 'Penguin species',
    description: '48 penguins: bill, flipper, body mass — three species.',
    question:
      'Can a model recognise the species from two measurements — and does clustering find the species on its own, without ever seeing the labels?',
    csv: penguinsCsv,
    examples: {
      setup: `RANDOM_STATE = 42\nTEST_SIZE = 0.25\nN_CLUSTERS = 3`,
      features: `from sklearn.model_selection import train_test_split\n\nfeatures = ["bill_mm", "flipper_mm"]\nX = df[features]\ny = df["species"]\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE)\nprint(len(X_train), "train rows,", len(X_test), "test rows")`,
      regressie: `from sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_absolute_error, r2_score\n\nXr = df[["flipper_mm"]]\nyr = df["body_mass_g"]\nXr_train, Xr_test, yr_train, yr_test = train_test_split(\n    Xr, yr, test_size=TEST_SIZE, random_state=RANDOM_STATE)\nreg = LinearRegression().fit(Xr_train, yr_train)\nprint("Body mass MAE:", round(mean_absolute_error(yr_test, reg.predict(Xr_test))), "g")\nprint("R²:", round(r2_score(yr_test, reg.predict(Xr_test)), 2))`,
      classificatie: `from sklearn.tree import DecisionTreeClassifier\nfrom sklearn.metrics import accuracy_score\n\nclf = DecisionTreeClassifier(max_depth=3, random_state=RANDOM_STATE)\nclf.fit(X_train, y_train)\nprint("Species accuracy:", round(accuracy_score(y_test, clf.predict(X_test)), 2))`,
      clustering: `from sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans\n\nscaled = StandardScaler().fit_transform(X)\nkm = KMeans(n_clusters=N_CLUSTERS, n_init=10, random_state=RANDOM_STATE)\ndf["cluster"] = km.fit_predict(scaled)\nprint(pd.crosstab(df["species"], df["cluster"]))`,
      ensemble: `from sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import accuracy_score\n\nforest = RandomForestClassifier(n_estimators=100, random_state=RANDOM_STATE)\nforest.fit(X_train, y_train)\nprint("Forest accuracy:", round(accuracy_score(y_test, forest.predict(X_test)), 2))\nprint("Single tree accuracy:", round(accuracy_score(y_test, clf.predict(X_test)), 2))`,
      grafiek: `for cluster, group in df.groupby("cluster"):\n    plt.scatter(group["bill_mm"], group["flipper_mm"],\n                label=f"cluster {cluster}")\nplt.xlabel("bill length (mm)")\nplt.ylabel("flipper length (mm)")\nplt.title("Clusters found without labels — compare with the crosstab")\nplt.legend()`,
    },
  },
]

// Generic examples for "bring your own data" — placeholders instead of real columns.
export const ML_GENERIC_EXAMPLES: Record<MLBlockKey, string> = {
  setup: `RANDOM_STATE = 42\nTEST_SIZE = 0.25\nN_CLUSTERS = 3`,
  features: `from sklearn.model_selection import train_test_split\n\nfeatures = ["numeric_column_a", "numeric_column_b"]\nX = df[features]\ny = df["target_column"]\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE)\nprint(len(X_train), "train rows,", len(X_test), "test rows")`,
  regressie: `from sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_absolute_error, r2_score\n\nreg = LinearRegression()\nreg.fit(X_train, y_train)\npred = reg.predict(X_test)\nprint("MAE:", round(mean_absolute_error(y_test, pred), 2))\nprint("R²:", round(r2_score(y_test, pred), 2))`,
  classificatie: `from sklearn.tree import DecisionTreeClassifier\nfrom sklearn.metrics import accuracy_score\n\nlabels = df["category_column"]\nXc_train, Xc_test, yc_train, yc_test = train_test_split(\n    X, labels, test_size=TEST_SIZE, random_state=RANDOM_STATE)\nclf = DecisionTreeClassifier(max_depth=3, random_state=RANDOM_STATE)\nclf.fit(Xc_train, yc_train)\nprint("Accuracy:", round(accuracy_score(yc_test, clf.predict(Xc_test)), 2))`,
  clustering: `from sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans\n\nscaled = StandardScaler().fit_transform(df[["numeric_column_a", "numeric_column_b"]])\nkm = KMeans(n_clusters=N_CLUSTERS, n_init=10, random_state=RANDOM_STATE)\ndf["cluster"] = km.fit_predict(scaled)\nprint(df.groupby("cluster")[["numeric_column_a", "numeric_column_b"]].mean().round(1))`,
  ensemble: `from sklearn.ensemble import RandomForestRegressor\nfrom sklearn.metrics import mean_absolute_error\n\nforest = RandomForestRegressor(n_estimators=100, random_state=RANDOM_STATE)\nforest.fit(X_train, y_train)\nforest_pred = forest.predict(X_test)\nprint("Forest MAE:", round(mean_absolute_error(y_test, forest_pred), 2))\nprint("Single model MAE:", round(mean_absolute_error(y_test, pred), 2))`,
  grafiek: `plt.scatter(y_test, pred, label="single model")\nplt.scatter(y_test, forest_pred, label="random forest")\nlims = [y_test.min(), y_test.max()]\nplt.plot(lims, lims, "k--", label="perfect prediction")\nplt.xlabel("actual")\nplt.ylabel("predicted")\nplt.title("Actual vs predicted")\nplt.legend()`,
}
