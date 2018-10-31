import json
import pandas as pd
import csv,re
import pickle
import matplotlib.pyplot as plt
from wordcloud import WordCloud,STOPWORDS
from nltk.corpus import stopwords 


class DrawWordCloud:

    def __init__(self):
        self.tweetJson = []
        self.sentiments = []

    def text_cleaning(self, x):
        x = re.sub('trump', '', x)
        x = re.sub('Trump', '', x)
        x = re.sub('Donald', '', x)

        return x

    def wordcloud_draw(self, data, color = 'black'):
        words = ' '.join(data)
        cleaned_word = " ".join([word for word in words.split()
                                if 'http' not in word
                                    and not word.startswith('@') 
                                    and not word.startswith('#')
                                    and word != 'RT'
                                ])
        wordcloud = WordCloud(stopwords=STOPWORDS,
                          background_color=color,
                          width=2500,
                          height=2000
                         ).generate(cleaned_word)
        plt.figure(1,figsize=(13, 13))
        plt.imshow(wordcloud)
        plt.axis('off')
        
    def draw(self):
        tweet_text = pd.DataFrame(index=range(4999), columns = ["Sentiment", "Text"])

        for i in range(len(self.tweetJson)):
            tweet_text["Text"][i] = tweetJson[i]["text"]
            tweet_text["Sentiment"][i] = sentiments[i]

        stopword_set = set(stopwords.words('english'))
        tweet_pos = tweet_text[ tweet_text['Sentiment'] == 1]
        tweet_neg = tweet_text[ tweet_text['Sentiment'] == 0]

        tweet_pos['Text'] = tweet_pos['Text'].apply(lambda x: ' '.join([word for word in x.split() if not word in stopword_set]))
        tweet_pos['Text'] = tweet_pos['Text'].apply(lambda x: self.text_cleaning(x))
        tweet_pos = tweet_pos['Text']

        tweet_neg['Text'] = tweet_neg['Text'].apply(lambda x: ' '.join([word for word in x.split() if not word in stopword_set]))
        tweet_neg['Text'] = tweet_neg['Text'].apply(lambda x: self.text_cleaning(x))
        tweet_neg = tweet_neg['Text']

        print("Positive words")
        plt.figure()
        self.wordcloud_draw(data=tweet_pos,color='white')
        plt.show()
        print("Negative words")
        plt.figure()
        self.wordcloud_draw(data=tweet_neg)
        plt.show()


if __name__== '__main__':

    with open('raw_text.json') as f:
        tweetJson = json.load(f) #tweetJson is a list

    sentiments = pickle.load(open(r'sentiments.txt', 'rb'))

    wordcloud = DrawWordCloud()
    wordcloud.tweetJson = tweetJson
    wordcloud.sentiments = sentiments

    wordcloud.draw()
    

