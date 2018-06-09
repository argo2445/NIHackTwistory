import json
import pymysql as mariadb


dbhandle = mariadb.connect(
    user='root', password='geheim', database='twistory', host='127.0.0.1', charset='utf8')




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
                cursor.execute(sql,[ tweet["id"],tweet["user"]["id"],tweet["text"],tweet["lang"],rt, tweet["created_at"], tweet["user"]["screen_name"] ])
                dbhandle.commit()
            sql = "SELECT `user_id` FROM `users` WHERE `user_id` =%s"
            cursor.execute(sql, tweet["user"]["id"])
            res=cursor.fetchall();
            if len(res) == 0:
                #import tweet
                sql="INSERT INTO `users` (`user_id`, `screen_name` , `name`, `profile_image_url`, `location`, `url` , `description`, `created_at`, `followers_count`, `friends_count`, `statuses_count`, `time_zone`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s )"
                cursor.execute(sql, [ tweet["user"]["id"], tweet["user"]["screen_name"], tweet["user"]["name"], tweet["user"]["profile_image_url"], tweet["user"]["location"], tweet["user"]["url"], tweet["user"]["description"], tweet["user"]["created_at"], tweet["user"]["followers_count"], tweet["user"]["friends_count"], tweet["user"]["statuses_count"], tweet["user"]["time_zone"]])
                dbhandle.commit()
            for tag in tweet["entities"]["hashtags"]:
                text=tag["text"]
                sql = "SELECT `tag` FROM `tweet_tags` WHERE `tweet_id` =%s AND `tag`=%s"
                cursor.execute(sql,[tweet["id"], text ])
                res = cursor.fetchall()
                if len(res)==0:
                    sql="INSERT INTO `tweet_tags` (`tweet_id`,`tag`) VALUES (%s,%s)"
                    cursor.execute(sql,[tweet["id"], text])
                    dbhandle.commit()

            
            
    except Exception as e:
        print(e)




try:
    with open('Twitter_Mitschnitt.json', 'r') as inp:
        data_string = inp.read()
    data_string = data_string.replace('}{', '}, {')
    data_string = '[' + data_string + ']'

    tweets = json.loads(data_string)
    #import_tweet(tweets[0])
    for tweet in tweets:        
        import_tweet(tweet)  
except Exception as e:
    print(e)              
finally:
    dbhandle.close()
