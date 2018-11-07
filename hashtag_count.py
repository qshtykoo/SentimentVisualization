import json
import pandas as pd
import csv,re
import pickle
import matplotlib.pyplot as plt


with open('raw_text.json') as f:
    tweetJson = json.load(f) #tweetJson is a list

sentiments = pickle.load(open(r'sentiments.txt', 'rb'))

emoji_pattern = "[\U0001F300-\U0001F64F]"

emoji_count = 0
tweet_text = pd.DataFrame(index=range(4999), columns = ["text"])
for i in range(len(tweetJson)):
    if emoji_pattern in tweetJson[i]["text"]:
        tweet_text["text"][i] = tweetJson[i]["text"]
        emoji_count = emoji_count + 1
    
