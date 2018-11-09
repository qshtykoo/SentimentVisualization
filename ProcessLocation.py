import json
import pandas as pd
import csv,re
import pickle
import matplotlib.pyplot as plt
#from wordcloud import WordCloud,STOPWORDS
from nltk.corpus import stopwords



with open('raw_text_2.json') as f:
        tweetJson = json.load(f) #tweetJson is a list

sentiments = pickle.load(open(r'sentiments_2.txt', 'rb'))

texts = pd.DataFrame(index=range(4999), columns = ["Sentiments","Location", "Text", "Coordinates"])
for i in range(len(tweetJson)):
        texts["Location"][i] = tweetJson[i]["place"]["full_name"]
        texts["Text"][i] = tweetJson[i]["text"]
        texts["Coordinates"][i] = tweetJson[i]["place"]["bounding_box"]["coordinates"]
        texts["Sentiments"][i] = sentiments[i]
