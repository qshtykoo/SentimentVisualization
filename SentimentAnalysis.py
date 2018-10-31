import numpy as np
import csv
import json
import re
import pandas as pd

import keras
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.models import model_from_json
import pickle

class sentimentAnalysis:

    def __init__(self, model, tweetJson, tokenizer):
        self.model = model
        self.tweetJson = tweetJson
        self.tokenizer = tokenizer

    def CollectBadwords(self):
    #collecting all the negative words
        badwords_file = open('BadWords.txt', 'r')
        badwords_list = []
        for line in badwords_file:
            line = re.sub('\n', '', line)
            badwords_list.append(line)
        badwords_tokenlist = tokenizer.texts_to_sequences(badwords_list)
        badwords_tokens = []
        for i in range(len(badwords_tokenlist)):
            if badwords_tokenlist[i]: #get rid of all the bad words that are not in the tokens
                badwords_tokens.append(badwords_tokenlist[i][0])

        return badwords_tokens
    


    def text_cleaning(self,x):
        x = re.sub('trump', '', x)
        x = re.sub('Trump', '', x)
        x = re.sub('Donald', '', x)
        cleaned_word = " ".join([word for word in x.split()
                            if 'http' not in word
                                and not word.startswith('@') 
                                and not word.startswith('#')
                                and word != 'RT'
                            ])
        return cleaned_word

    def predict(self,texts):
        embedded_len = 122
        token_list = tokenizer.texts_to_sequences(texts)
        padded_token_list = []
        sentiments = []
        for i in range(len(token_list)):
            padded_token_sequence = pad_sequences([token_list[i]], maxlen=embedded_len, padding='pre')
            predicted_sentiment = model.predict(padded_token_sequence)[0][0]
            if predicted_sentiment < 0.6 or not set(token_list[i]).isdisjoint(badwords_tokens):
                predicted_sentiment = 0
            else:
                predicted_sentiment = 1
            sentiments.append(predicted_sentiment)

        return sentiments


if __name__== "__main__":

    with open(r'LSTM_Architecture.json', 'r') as f:
            model = model_from_json(f.read())

    # Load weights into the new model
    model.load_weights(r'LSTM.h5')

    tokenizer = pickle.load(open(r'tokenizer.pickle', 'rb'))

    with open('raw_text.json') as f:
        tweetJson = json.load(f) #tweetJson is a list

    sentiAnalysis = sentimentAnalysis(model, tokenizer, tweetJson)

    badwords_tokens = sentiAnalysis.CollectBadwords()


    texts = pd.DataFrame(index=range(4999), columns = ["Text"])
    for i in range(len(tweetJson)):
        texts["Text"][i] = tweetJson[i]["text"]

    texts["Text"] = texts["Text"].apply(lambda x: sentiAnalysis.text_cleaning(x))
    sentiments = sentiAnalysis.predict(texts['Text'])

    #save the predicted results
    #with open("sentiments.txt", 'wb') as fp:
            #pickle.dump(sentiments, fp)

