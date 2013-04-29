ALTER TABLE `[#DB_PREFIX#]jobs` DROP `jobs_id`;
ALTER TABLE `[#DB_PREFIX#]jobs` CHANGE `jobs_name` `job_name` VARCHAR( 64 ) NULL DEFAULT NULL COMMENT '职位名';
ALTER TABLE `[#DB_PREFIX#]work_experience` CHANGE `jobs_id` `job_id` INT( 11 ) NULL DEFAULT NULL COMMENT '职位ID';
INSERT INTO `[#DB_PREFIX#]system_setting` (`varname`, `value`) VALUES ('url_param_key', 's:1:"1";');

CREATE TABLE `[#DB_PREFIX#]report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0' COMMENT '举报用户id',
  `type` varchar(50) CHARACTER SET utf8 DEFAULT NULL COMMENT '类别',
  `target_id` int(11) DEFAULT '0' COMMENT 'ID',
  `reason` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '举报理由',
  `url` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `add_time` int(11) DEFAULT '0' COMMENT '举报时间',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否处理',
  PRIMARY KEY (`id`)
) ENGINE=[#DB_ENGINE#] DEFAULT CHARSET=utf8;

ALTER TABLE `[#DB_PREFIX#]users_attrib` DROP `popular_email`;
ALTER TABLE `[#DB_PREFIX#]users_attrib` DROP `msn`;
ALTER TABLE `[#DB_PREFIX#]users_attrib` DROP `introduction`;

INSERT INTO `[#DB_PREFIX#]system_setting` (`varname`, `value`) VALUES ('report_reason', 's:63:"广告/SPAM\n恶意灌水\n违规内容\n文不对题\n重复发问";');

ALTER TABLE `[#DB_PREFIX#]work_experience` DROP `country`;
ALTER TABLE `[#DB_PREFIX#]work_experience` DROP `province`;
ALTER TABLE `[#DB_PREFIX#]work_experience` DROP `city`;
ALTER TABLE `[#DB_PREFIX#]work_experience` DROP `experience_description`;
ALTER TABLE `[#DB_PREFIX#]work_experience` DROP `start_month`;
ALTER TABLE `[#DB_PREFIX#]work_experience` DROP `end_month`;

ALTER TABLE `[#DB_PREFIX#]education_experience` DROP `school_type`;
ALTER TABLE `[#DB_PREFIX#]education_experience` DROP `educational`;
ALTER TABLE `[#DB_PREFIX#]education_experience` DROP `school_code`;
ALTER TABLE `[#DB_PREFIX#]education_experience` DROP `departments_code`;

ALTER TABLE `[#DB_PREFIX#]user_action_history_data` ADD `addon_data` TEXT NULL DEFAULT NULL COMMENT '附加数据';
INSERT INTO `[#DB_PREFIX#]system_setting` (`varname`, `value`) VALUES ('allowed_upload_types', 's:41:"jpg,jpeg,png,gif,zip,doc,docx,rar,pdf,psd";');
INSERT INTO `[#DB_PREFIX#]system_setting` (`varname`, `value`) VALUES ('site_announce', 's:0:"";');
INSERT INTO `[#DB_PREFIX#]system_setting` (`varname`, `value`) VALUES ('icp_beian', 's:0:"";');

ALTER TABLE `[#DB_PREFIX#]user_action_history` ADD INDEX (  `associate_id` );
ALTER TABLE `[#DB_PREFIX#]user_action_history` ADD INDEX (  `anonymous` );

DELETE FROM `[#DB_PREFIX#]system_setting` WHERE `varname` = 'hot_user_period';

ALTER TABLE `[#DB_PREFIX#]users` ADD `draft_count` INT(10) NULL DEFAULT NULL;
ALTER TABLE `[#DB_PREFIX#]users` ADD INDEX (  `integral` );
ALTER TABLE `[#DB_PREFIX#]users` DROP `real_name`;
ALTER TABLE `[#DB_PREFIX#]users` DROP `telephone`;

ALTER TABLE `[#DB_PREFIX#]mail_queue` ADD INDEX (  `level` );
ALTER TABLE `[#DB_PREFIX#]mail_queue` ADD INDEX (  `state` );
ALTER TABLE `[#DB_PREFIX#]mail_queue` ADD INDEX (  `receive` );
INSERT INTO `[#DB_PREFIX#]system_setting` (`varname`, `value`) VALUES ('report_message_uid', 's:1:"1";');

CREATE TABLE `[#DB_PREFIX#]bulk_email` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `subject` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `content` text CHARACTER SET utf8,
  `user_type` tinyint(2) DEFAULT '0',
  `user_group` text,
  `test_email` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `last_active` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=[#DB_ENGINE#] DEFAULT CHARSET=utf8;

DROP TABLE `[#DB_PREFIX#]user_uninterested`;
DROP TABLE `[#DB_PREFIX#]topic_uninterested`;