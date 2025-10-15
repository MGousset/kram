import pandas as pd

filledOrgas = pd.read_excel('filledShotgunVenues.xlsx')
filledOrgas = filledOrgas.drop(axis=1, columns=filledOrgas.columns[0])
filledOrgas.to_sql("filledShotgunVenues.sql")