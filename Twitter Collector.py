from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import time
import json
import os

consumer_key="RjmOPA5m85uhCevc8YKqdE4iP"
consumer_secret="lTCy9NAKFKMenzX6NFKBDvXtqX8FyT3MFj3K89KX3hIzlHFnpD"


access_token="930472322405994497-84MNFGQkyufKINtmDIVrXDJFnVddqxq"
access_token_secret="HpKUlCeGPech5Wmaz4HJVigpaqWfhtGDTjugRbxOUJDLm"

class StdOutListener(StreamListener):
    """ A listener handles tweets that are received from the stream.
    This is a basic listener that just prints received tweets to stdout.
    """
    def __init__(self):
        super().__init__()
        self.tweet_data = []
        self.tweet_count = 0
        self.stop = False
        self.num_needed = 5000

    def on_data(self, data):
        tweetJson = json.loads(data)
        #self.tweet_data.append(tweetJson)

        #eliminate the deleted tweets
        if "delete" in tweetJson:
            return True

        text = tweetJson["text"]
        #filter - text contains trump
        targeted_str = "trump"
        #if True:
        if targeted_str in tweetJson["text"].lower():
            self.tweet_count += 1
            with open('raw_text_2.json', 'r+') as f: #‘r+’ : This mode indicate that file will be open for both reading and writing
                if len(f.read()) == 0:
                    f.write('[\n' + json.dumps(tweetJson))
                elif self.tweet_count<self.num_needed:
                    f.write(',\n' + json.dumps(tweetJson))
                else:
                    f.write('\n]')
        #stop condition
        if self.tweet_count >= self.num_needed:
            self.stop = True
            return False
        return True
    
    def on_error(self, status):
        print(status)
        print("error")

if __name__ == '__main__':
    
    l = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)

    stream = Stream(auth, l)
    while l.stop == False:
        try:
            stream.sample()
        except Exception as ex:
            print(ex)
            print('error')
