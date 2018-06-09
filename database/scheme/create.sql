
CREATE TABLE IF NOT EXISTS `json_cache` (
  `tweet_id` bigint(20) unsigned NOT NULL,
  `cache_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cache_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `raw_tweet` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`cache_id`),
  KEY `tweet_id` (`tweet_id`),
  KEY `cache_date` (`cache_date`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `tweets` (
  `tweet_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `tweet_text` varchar(400) NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `geo_lat` decimal(10,5) DEFAULT NULL,
  `geo_long` decimal(10,5) DEFAULT NULL,
  `screen_name` char(20) NOT NULL,
  `lang` varchar(50) NOT NULL,
  `is_rt` tinyint(1) NOT NULL,
  `sentiment` float DEFAULT NULL,
  `sadness` float DEFAULT NULL,
  `joy` float DEFAULT NULL,
  `fear` float DEFAULT NULL,
  `disgust` float DEFAULT NULL,
  `anger` float DEFAULT NULL,  
  PRIMARY KEY (`tweet_id`),
  KEY `created_at` (`created_at`),
  KEY `user_id` (`user_id`),
  KEY `screen_name` (`screen_name`),
  KEY `name` (`name`),
  FULLTEXT KEY `tweet_text` (`tweet_text`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `tweet_mentions` (
  `tweet_id` bigint(20) unsigned NOT NULL,
  `source_user_id` bigint(20) unsigned NOT NULL,
  `target_user_id` bigint(20) unsigned NOT NULL,
  KEY `tweet_id` (`tweet_id`),
  KEY `source` (`source_user_id`),
  KEY `target` (`target_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `tweet_tags` (
  `tweet_id` bigint(20) unsigned NOT NULL,
  `tag` varchar(100) NOT NULL,
  KEY `tweet_id` (`tweet_id`),
  KEY `tag` (`tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `tweet_urls` (
  `tweet_id` bigint(20) unsigned NOT NULL,
  `url` varchar(140) NOT NULL,
  KEY `tweet_id` (`tweet_id`),
  KEY `url` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` bigint(20) unsigned NOT NULL,
  `screen_name` varchar(20) NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `profile_image_url` varchar(200) DEFAULT NULL,
  `location` varchar(30) DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `followers_count` int(10) unsigned DEFAULT NULL,
  `friends_count` int(10) unsigned DEFAULT NULL,
  `statuses_count` int(10) unsigned DEFAULT NULL,
  `time_zone` varchar(40) DEFAULT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
     ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  KEY `user_name` (`name`),
  KEY `last_update` (`last_update`),
  KEY `screen_name` (`screen_name`),
  FULLTEXT KEY `description` (`description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `entities` (
    `entity_id` bigint(20) unsigned NOT NULL,
    `text` varchar(100) DEFAULT NULL,
    `entity_type_id` bigint(20) unsigned NOT NULL,
    PRIMARY KEY (`entity_id`)

)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `e_types` (
`e_type_id` bigint(20) unsigned NOT NULL,
`text` varchar(100) NOT NULL, 
 PRIMARY KEY (`e_type_id`)  
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `e_subtypes` (
`e_subtype_id` bigint(20) unsigned NOT NULL,
`text` varchar(100) NOT NULL,  
  PRIMARY KEY (`e_subtype_id`)  
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `entity_subtypes` (
  `entity_id` bigint(20) unsigned NOT NULL,
  `e_subtype_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`entity_id`,`e_subtype_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `tweet_entities` (
`tweet_id` bigint(20) unsigned NOT NULL,
`entity_id` bigint(20) unsigned NOT NULL,
`relevance` double DEFAULT NULL,
`count` bigint(20) unsigned NOT NULL,
PRIMARY KEY (`tweet_id`,`entity_id`),
KEY `entity_id` (`entity_id`),
KEY `tweet_id` (`tweet_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;