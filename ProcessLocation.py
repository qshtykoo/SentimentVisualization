import json
import pandas as pd
import csv,re
import pickle
import numpy as np
#from wordcloud import WordCloud,STOPWORDS



with open('raw_text_3.json') as f:
        tweetJson = json.load(f) #tweetJson is a list

sentiments = pickle.load(open(r'sentiments_3.txt', 'rb'))

texts = pd.DataFrame(index=range(4999), columns = ["Sentiments", "Location", "Country_code", "Country_name", "Text", "Coordinates"])
for i in range(len(tweetJson)):
        texts["Location"][i] = tweetJson[i]["place"]["full_name"]
        texts["Country_code"][i] = tweetJson[i]["place"]["country_code"]
        texts["Country_name"][i] = tweetJson[i]["place"]["country"]
        texts["Text"][i] = tweetJson[i]["text"]
        texts["Coordinates"][i] = tweetJson[i]["place"]["bounding_box"]["coordinates"]
        texts["Sentiments"][i] = sentiments[i]

world_data = pd.read_csv(r"Data Visualization/DATA/world_population.tsv", sep="\t")

world_sentiment = pd.DataFrame(0, index=range(len(world_data)), columns = ["id", "name", "positiveRatio"])

world_sentiment["id"] = world_data["id"]
world_sentiment["name"] = world_data["name"]

for i in range(len(texts["Country_name"])):
        if texts["Country_name"][i] == "المملكة العربية السعودية":
                texts["Country_name"][i] = "Saudi Arabia"
        if texts["Country_name"][i] == "Россия":
                texts["Country_name"][i] = "Russia"
        if texts["Country_name"][i] == "Türkiye" or texts["Country_name"][i] == "Türkei":
                texts["Country_name"][i] = "Turkey"
        if texts["Country_name"][i] == "Brasil":
                texts["Country_name"][i] = "Brazil"
        if texts["Country_name"][i] == "日本":
                texts["Country_name"][i] = "Japan"
        if texts["Country_name"][i] == "España":
                texts["Country_name"][i] = "Spain"

available_country_list = texts["Country_name"].sum()
texts_pos  = texts[ texts["Sentiments"] == 1 ]

for i in range(len(world_sentiment)):
        targeted_country = world_sentiment["name"][i]
        if targeted_country in available_country_list:
                total_num = len( texts [ texts["Country_name"] == targeted_country ] )
                try:
                        pos_ratio = len(texts_pos[ texts_pos["Country_name"] == targeted_country ]) / total_num
                        world_sentiment["positiveRatio"][i] = repr(pos_ratio * 100)
                except:
                        print(targeted_country)
        else:
                world_sentiment["positiveRatio"][i] = 0

#world_sentiment.to_csv(r"Data Visualization/DATA/world_sentiments_2.tsv", sep='\t', index=False)
coordinates = texts['Coordinates']
coordinates.to_csv(r"Data Visualization/DATA/coordinates.tsv", sep='\t', index=False)
