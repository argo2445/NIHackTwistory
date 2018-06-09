import json
import pymysql as mariadb


dbhandle = mariadb.connect(
    user='root', password='geheim', database='twistory', host='127.0.0.1')




def import_tweet(tweet):
    print(tweet['text'])
    try:
        with dbhandle.cursor() as cursor:
            #check if tweet is already in DB
            sql="SELECT `tweet_id` FROM `tweets` WHERE `tweet_id`=%s"
            cursor.execute(sql, tweet["id"])
            res=cursor.fetchall();
            if len(res)==0:
                #import tweet
                sql="INSERT INTO `tweets` (`tweet_id`, `user_id`, `tweet_text`, `lang`,`is_rt`,`created_at`,`screen_name`) VALUES (%s, %s, %s, %s, %s, %s, %s)" 
                rt=len(tweet["retweeted_status"])
                if rt>0:
                    rt=1            
                cursor.executemany(sql,[ tweet["id"],tweet["user"]["id"],tweet["text"],tweet["lang"],rt, tweet["created_at"], tweet["user"]["screen_name"] ])
                cursor.fetchall()
    except Exception as e:
        print(e)




try:
    with open('Twitter_API/Twitter_Mitschnitt.json', 'r') as inp:
        data_string = inp.read()
    data_string = data_string.replace('}{', '}, {')
    data_string = '[' + data_string + ']'

    tweets = json.loads(data_string)
    import_tweet(tweets[0])
    # for tweet in tweets:
    #     import_tweet(tweet)    
finally:
    dbhandle.close()
