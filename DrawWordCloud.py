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
        
    def draw(self, complete=False):
        tweet_text = pd.DataFrame(index=range(4999), columns = ["Sentiment", "Text"])

        for i in range(len(self.tweetJson)):
            tweet_text["Text"][i] = tweetJson[i]["text"]
            tweet_text["Sentiment"][i] = sentiments[i]

        stopword_set = set(stopwords.words('english'))
        tweet_pos = tweet_text[ tweet_text['Sentiment'] == 1]
        tweet_neg = tweet_text[ tweet_text['Sentiment'] == 0]

        if complete == False:
            tweet_pos['Text'] = tweet_pos['Text'].apply(lambda x: ' '.join([word for word in x.split() if not word in stopword_set]))
            tweet_pos['Text'] = tweet_pos['Text'].apply(lambda x: self.text_cleaning(x))
            

            tweet_neg['Text'] = tweet_neg['Text'].apply(lambda x: ' '.join([word for word in x.split() if not word in stopword_set]))
            tweet_neg['Text'] = tweet_neg['Text'].apply(lambda x: self.text_cleaning(x))
        

        tweet_pos = tweet_pos['Text']
        tweet_neg = tweet_neg['Text']

        print("Positive words")
        plt.figure()
        self.wordcloud_draw(data=tweet_pos,color='white')
        plt.show()
        print("Negative words")
        plt.figure()
        self.wordcloud_draw(data=tweet_neg)
        plt.show()

class split_words:

    def __init__(self):
        self.start_time = 0;
        self.end_time = 0;
        self.total_time_interval = self.end_time - self.start_time

    def split_text(self, tweetJson, time_step, word_counter, portions=12):
        tweetJson["Timestamp"] = pd.to_numeric(tweetJson["Timestamp"])
        total_data = []
        for i in range(portions):
            tweet = tweetJson[ tweetJson["Timestamp"] <= self.start_time + (i+1) * time_step ]
            tweet = self.clean_words(tweet)
            goodwords = word_counter.CountWords(tweet["Text"], "bad")
            goodwords_list = []
            word_size_pair = {}
            for key, value in goodwords.items():
                word_size_pair["text"] = key
                word_size_pair["size"] = value
                goodwords_list.append(word_size_pair.copy()) # .copy() is to prevent pointer behavior
            total_data.append(goodwords_list)
            #filename = "{}_goodwords.json".format(i)
            #with open(filename, 'w') as fp:
                #json.dump(goodwords_list, fp, indent = 2)
        filename = "badwords.js";
        with open(filename, 'w') as fp:
            json.dump(total_data, fp, indent = 2)
    
    def senti_split_text(self, tweetJson, sentiments):
        tweet_text = pd.DataFrame(index=range(4999), columns = ["Sentiment", "Text", "Timestamp"])

        for i in range(len(tweetJson)):
            tweet_text["Text"][i] = tweetJson[i]["text"]
            tweet_text["Sentiment"][i] = sentiments[i]
            tweet_text["Timestamp"][i] = tweetJson[i]["timestamp_ms"]

        tweet_pos = tweet_text[ tweet_text['Sentiment'] == 1]
        tweet_neg = tweet_text[ tweet_text['Sentiment'] == 0]

        return tweet_pos, tweet_neg, tweet_text

    def text_cleaning(self, words):
        
        cleaned_word = " ".join([word for word in words.split()
                                if "http" not in word
                                    and not word.startswith("@") 
                                    and not word.startswith("#")
                                    and word != "RT"
                                ])
        
        cleaned_word = re.sub("trump", "", cleaned_word)
        cleaned_word = re.sub("Trump", "", cleaned_word)
        cleaned_word = re.sub("Donald", "", cleaned_word)

        return cleaned_word

    def clean_words(self, tweet_pd):
        
        stopword_set = set(stopwords.words('english'))
        tweet_pd['Text'] = tweet_pd['Text'].apply(lambda x: " ".join([word for word in x.split() if not word in stopword_set])) #不要用单引号！ --- 用 " ".
        tweet_pd['Text'] = tweet_pd['Text'].apply(lambda x: self.text_cleaning(x))

        return tweet_pd.reset_index()
    

class count_words:


    def CollectWords(self, p="good"):
        if p == "good":
            wordsfile = open("GoodWords.txt", 'r')
            wordslist = []

            for line in wordsfile:
                line = re.sub("\n", "", line)
                wordslist.append(line)
        elif p == "bad":
            wordsfile = open("BadWords.txt", 'r')
            wordslist = []

            for line in wordsfile:
                line = re.sub("\n", "", line)
                wordslist.append(line)
        else:
            print("there is no such option, it's either good or bad")
            
            
        return wordslist
    
    def CountWords(self, texts_pd, p="good"):
        sumed_words = texts_pd.sum()
        if p == "good":
            words_list = {}
            goodwords_list = self.CollectWords("good")
            for i in range(len(goodwords_list)):
                targeted_words = re.findall(goodwords_list[i], sumed_words)
                freq = len(targeted_words)
                if len(targeted_words) != 0:
                    words_list[targeted_words[0]] = freq
        elif p == "bad":
            words_list = {}
            badwords_list = self.CollectWords("bad")
            for i in range(len(badwords_list)):
                try:
                    targeted_words = re.findall(badwords_list[i], sumed_words)
                except:
                    print(error,i)
                freq = len(targeted_words)
                if len(targeted_words) != 0:
                    words_list[targeted_words[0]] = freq
        else:
            print("that is not an option, it's either good or bad")

        return words_list
        
        


if __name__== '__main__':

    with open('raw_text.json') as f:
        tweetJson = json.load(f) #tweetJson is a list

    sentiments = pickle.load(open(r'sentiments.txt', 'rb'))

    #wordcloud = DrawWordCloud()
    #wordcloud.tweetJson = tweetJson
    #wordcloud.sentiments = sentiments

    #wordcloud.draw()
    start_time = int(tweetJson[0]["timestamp_ms"])
    end_time = int(tweetJson[len(tweetJson)-1]["timestamp_ms"])
    total_time_interval = end_time - start_time
    time_step = total_time_interval / 12

    spliter = split_words()
    spliter.start_time = start_time
    spliter.end_time = end_time


    tweet_pos, tweet_neg, tweet_text = spliter.senti_split_text(tweetJson, sentiments)

    word_counter = count_words()
    
    spliter.split_text(tweet_text, time_step, word_counter)

    
    #with open('goodwords.json', 'w') as fp:
    #json.dump(goodwords, fp, indent = 2)
    
