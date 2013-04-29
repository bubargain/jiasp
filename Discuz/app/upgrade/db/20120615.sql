ALTER TABLE `[#DB_PREFIX#]notification` CHANGE `read_flag` `read_flag` INT( 11 ) NULL DEFAULT '0' COMMENT '阅读状态';
ALTER TABLE `[#DB_PREFIX#]category` ADD `sort` SMALLINT( 6 ) NULL DEFAULT '0' COMMENT '排序' AFTER `parent_id`;
INSERT INTO `[#DB_PREFIX#]system_setting` (`id`, `varname`, `value`) VALUES (NULL, 'register_seccode', 's:1:"Y";');
INSERT INTO `[#DB_PREFIX#]system_setting` (`id`, `varname`, `value`) VALUES (NULL, 'admin_login_seccode', 's:1:"Y";');
CREATE TABLE `[#DB_PREFIX#]question_keyword` (
  `auto_id` INT(10) NOT NULL AUTO_INCREMENT,
  `question_id` INT(10) DEFAULT NULL,
  `keyword` VARCHAR(20) DEFAULT NULL,
  `add_time` INT(10) DEFAULT NULL,
  UNIQUE KEY `auto_id` (`auto_id`),
  UNIQUE KEY `keyword` (`question_id`,`keyword`)
) ENGINE=[#DB_ENGINE#] DEFAULT CHARSET=utf8;

ALTER TABLE `[#DB_PREFIX#]topic` CHANGE `topic_count`  `topic_count` INT( 11 ) NULL DEFAULT '0' COMMENT '讨论计数';

UPDATE `[#DB_PREFIX#]topic` SET `topic_count` = 0 WHERE `topic_count` IS NULL;