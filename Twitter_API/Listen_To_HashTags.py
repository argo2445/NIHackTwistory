# Import all necessary libraries
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener

import json
import csv

# Path to the tweepy authentication tokens
path_auth = '/home/jm/Desktop/API/Twitter_API_Auth.csv'

# Name of the tweets-json
name_json = 'Twitter_Mitschnitt.json'
name_json_2 = 'Twitter_Mitschnitt_2.json'

# Hashtags to listen to
hashtags = ['#g7', '#g7summit', '#G7Charlevoix', '#g8', '#g72018']

# Load tweepy authentication
with open(path_auth) as f:
    file = list(csv.reader(f))
    ckey = file[0][0]
    csecret = file[1][0]
    atoken = file[2][0]
    asecret = file[3][0]

# Create a class to stream recent Tweets to the json-file
class listener(StreamListener):
    def on_data(self, data):
        try:
            # Load the json-data
            loaded = json.loads(data)

            # Open the json-file and store the Tweet
            with open(name_json, 'a') as f:
                json.dump(loaded, f)
                
            # Open the json-file and store the Tweet
            with open(name_json_2, 'a') as f:
                json.dump(loaded, f)
                
        except BaseException as e:
            # Print the exception, wait and proceed
            print('Failed ondata, ', str(e))
            time.sleep(5)
        return True
    
    # If an error occurs, print it
    def on_error(self, status):
        print('Error, ', status)

# Authenticate this App
auth = OAuthHandler(ckey, csecret)
auth.set_access_token(atoken, asecret)

while True:
    # Create a listener-instance and save new Tweets to the json-file
    try:
        twitterStream = Stream(auth, listener())
        twitterStream.filter(track=hashtags)
    except:
        pass