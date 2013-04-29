-- MySQL dump 10.13  Distrib 5.6.5-m8, for Win32 (x86)
--
-- Host: 192.168.1.104    Database: jiasp
-- ------------------------------------------------------
-- Server version	5.5.24-0ubuntu0.12.04.1-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `aws_active_tbl`
--

DROP TABLE IF EXISTS `aws_active_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_active_tbl` (
  `active_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `expire_time` int(10) DEFAULT NULL,
  `active_code` varchar(32) DEFAULT NULL,
  `active_type` tinyint(4) DEFAULT NULL COMMENT '1 邮件激活, 11 找回密码 1121 邮箱验证 22 手机验证',
  `active_type_code` varchar(16) DEFAULT NULL,
  `active_values` text,
  `add_time` int(10) DEFAULT NULL,
  `add_ip` bigint(12) DEFAULT NULL,
  `active_expire` tinyint(1) DEFAULT NULL,
  `active_time` int(10) DEFAULT NULL,
  `active_ip` bigint(12) DEFAULT NULL,
  PRIMARY KEY (`active_id`),
  KEY `active_code` (`active_code`),
  KEY `active_type` (`active_type`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_active_tbl`
--

LOCK TABLES `aws_active_tbl` WRITE;
/*!40000 ALTER TABLE `aws_active_tbl` DISABLE KEYS */;
INSERT INTO `aws_active_tbl` VALUES (1,2,1366962811,'130c671e7580b187b03e',21,'VALID_EMAIL','',1366876411,-1062731411,NULL,NULL,NULL);
/*!40000 ALTER TABLE `aws_active_tbl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_admin_group`
--

DROP TABLE IF EXISTS `aws_admin_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_admin_group` (
  `group_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `group_name` varchar(32) NOT NULL DEFAULT '' COMMENT '组名',
  `menu` text NOT NULL COMMENT '可见栏目',
  `no_menu` text,
  `permission` text NOT NULL COMMENT '权限',
  `no_permission` text,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_admin_group`
--

LOCK TABLES `aws_admin_group` WRITE;
/*!40000 ALTER TABLE `aws_admin_group` DISABLE KEYS */;
INSERT INTO `aws_admin_group` VALUES (1,'超级管理员','all',NULL,'all',NULL),(2,'管理员','all',NULL,'all',NULL),(3,'版主','1,2,3,4,5,6',NULL,'',NULL);
/*!40000 ALTER TABLE `aws_admin_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_answer`
--

DROP TABLE IF EXISTS `aws_answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_answer` (
  `answer_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '回答id',
  `question_id` int(11) NOT NULL COMMENT '问题id',
  `answer_content` text COMMENT '回答内容',
  `add_time` int(10) DEFAULT '0' COMMENT '添加时间',
  `against_count` int(11) NOT NULL DEFAULT '0' COMMENT '反对人数',
  `agree_count` int(11) NOT NULL DEFAULT '0' COMMENT '支持人数',
  `uid` int(11) DEFAULT '0' COMMENT '发布问题用户ID',
  `comment_count` int(11) DEFAULT '0' COMMENT '评论总数',
  `uninterested_count` int(11) DEFAULT '0' COMMENT '不感兴趣',
  `thanks_count` int(11) DEFAULT '0' COMMENT '感谢数量',
  `category_id` int(11) DEFAULT '0' COMMENT '分类id',
  `has_attach` tinyint(1) DEFAULT '0' COMMENT '是否存在附件',
  `ip` bigint(11) DEFAULT NULL,
  `force_fold` tinyint(1) DEFAULT '0' COMMENT '强制折叠',
  `anonymous` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`answer_id`),
  KEY `question_id` (`question_id`),
  KEY `agree_count` (`agree_count`),
  KEY `against_count` (`against_count`),
  KEY `add_time` (`add_time`),
  KEY `uid` (`uid`),
  KEY `uninterested_count` (`uninterested_count`),
  KEY `force_fold` (`force_fold`),
  KEY `anonymous` (`anonymous`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='回答';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_answer`
--

LOCK TABLES `aws_answer` WRITE;
/*!40000 ALTER TABLE `aws_answer` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_answer_comments`
--

DROP TABLE IF EXISTS `aws_answer_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_answer_comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `answer_id` int(11) DEFAULT '0',
  `uid` int(11) DEFAULT '0',
  `message` text,
  `time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `answer_id` (`answer_id`),
  KEY `time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_answer_comments`
--

LOCK TABLES `aws_answer_comments` WRITE;
/*!40000 ALTER TABLE `aws_answer_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_answer_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_answer_thanks`
--

DROP TABLE IF EXISTS `aws_answer_thanks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_answer_thanks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `answer_id` int(11) DEFAULT '0',
  `user_name` varchar(255) DEFAULT NULL,
  `time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `answer_id` (`answer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_answer_thanks`
--

LOCK TABLES `aws_answer_thanks` WRITE;
/*!40000 ALTER TABLE `aws_answer_thanks` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_answer_thanks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_answer_uninterested`
--

DROP TABLE IF EXISTS `aws_answer_uninterested`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_answer_uninterested` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `answer_id` int(11) DEFAULT '0',
  `user_name` varchar(255) DEFAULT NULL,
  `time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `answer_id` (`answer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_answer_uninterested`
--

LOCK TABLES `aws_answer_uninterested` WRITE;
/*!40000 ALTER TABLE `aws_answer_uninterested` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_answer_uninterested` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_answer_vote`
--

DROP TABLE IF EXISTS `aws_answer_vote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_answer_vote` (
  `voter_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自动ID',
  `answer_id` int(11) DEFAULT NULL COMMENT '回复id',
  `answer_uid` int(11) DEFAULT NULL COMMENT '回复作者id',
  `vote_uid` int(11) DEFAULT NULL COMMENT '用户ID',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  `vote_value` tinyint(4) NOT NULL COMMENT '-1反对 1 支持',
  `reputation_factor` int(10) DEFAULT '0',
  PRIMARY KEY (`voter_id`),
  KEY `answer_id` (`answer_id`),
  KEY `vote_value` (`vote_value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_answer_vote`
--

LOCK TABLES `aws_answer_vote` WRITE;
/*!40000 ALTER TABLE `aws_answer_vote` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_answer_vote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_approval`
--

DROP TABLE IF EXISTS `aws_approval`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_approval` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `type` varchar(16) DEFAULT NULL,
  `data` mediumtext NOT NULL,
  `uid` int(11) NOT NULL DEFAULT '0',
  `time` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `type` (`type`),
  KEY `uid` (`uid`),
  KEY `time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_approval`
--

LOCK TABLES `aws_approval` WRITE;
/*!40000 ALTER TABLE `aws_approval` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_approval` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_attach`
--

DROP TABLE IF EXISTS `aws_attach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_attach` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) DEFAULT NULL COMMENT '附件名称',
  `access_key` varchar(32) DEFAULT NULL COMMENT '批次 Key',
  `add_time` int(10) DEFAULT '0' COMMENT '上传时间',
  `file_location` varchar(255) DEFAULT NULL COMMENT '文件位置',
  `is_image` int(1) DEFAULT '0',
  `item_type` varchar(32) DEFAULT '0' COMMENT '关联类型',
  `item_id` int(11) DEFAULT '0' COMMENT '关联 ID',
  `wait_approval` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `access_key` (`access_key`),
  KEY `is_image` (`is_image`),
  KEY `fetch` (`item_id`,`item_type`),
  KEY `wait_approval` (`wait_approval`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_attach`
--

LOCK TABLES `aws_attach` WRITE;
/*!40000 ALTER TABLE `aws_attach` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_attach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_category`
--

DROP TABLE IF EXISTS `aws_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_category` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(128) DEFAULT NULL,
  `type` varchar(16) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT '0',
  `sort` smallint(6) DEFAULT '0',
  `url_token` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  KEY `url_token` (`url_token`),
  KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_category`
--

LOCK TABLES `aws_category` WRITE;
/*!40000 ALTER TABLE `aws_category` DISABLE KEYS */;
INSERT INTO `aws_category` VALUES (1,'默认分类','question',NULL,0,0,NULL);
/*!40000 ALTER TABLE `aws_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_draft`
--

DROP TABLE IF EXISTS `aws_draft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_draft` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `type` varchar(16) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `data` text,
  `time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `item_id` (`item_id`),
  KEY `time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_draft`
--

LOCK TABLES `aws_draft` WRITE;
/*!40000 ALTER TABLE `aws_draft` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_draft` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_edm_task`
--

DROP TABLE IF EXISTS `aws_edm_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_edm_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `message` mediumtext NOT NULL,
  `subject` varchar(255) NOT NULL,
  `from_name` varchar(255) NOT NULL,
  `time` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_edm_task`
--

LOCK TABLES `aws_edm_task` WRITE;
/*!40000 ALTER TABLE `aws_edm_task` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_edm_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_edm_taskdata`
--

DROP TABLE IF EXISTS `aws_edm_taskdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_edm_taskdata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taskid` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `sent_time` int(10) NOT NULL,
  `view_time` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `taskid` (`taskid`),
  KEY `sent_time` (`sent_time`),
  KEY `view_time` (`view_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_edm_taskdata`
--

LOCK TABLES `aws_edm_taskdata` WRITE;
/*!40000 ALTER TABLE `aws_edm_taskdata` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_edm_taskdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_edm_unsubscription`
--

DROP TABLE IF EXISTS `aws_edm_unsubscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_edm_unsubscription` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `time` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_edm_unsubscription`
--

LOCK TABLES `aws_edm_unsubscription` WRITE;
/*!40000 ALTER TABLE `aws_edm_unsubscription` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_edm_unsubscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_edm_userdata`
--

DROP TABLE IF EXISTS `aws_edm_userdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_edm_userdata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usergroup` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usergroup` (`usergroup`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_edm_userdata`
--

LOCK TABLES `aws_edm_userdata` WRITE;
/*!40000 ALTER TABLE `aws_edm_userdata` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_edm_userdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_edm_usergroup`
--

DROP TABLE IF EXISTS `aws_edm_usergroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_edm_usergroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `time` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_edm_usergroup`
--

LOCK TABLES `aws_edm_usergroup` WRITE;
/*!40000 ALTER TABLE `aws_edm_usergroup` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_edm_usergroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_education_experience`
--

DROP TABLE IF EXISTS `aws_education_experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_education_experience` (
  `education_id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL COMMENT '用户UID',
  `education_years` int(11) DEFAULT NULL COMMENT '入学年份',
  `school_name` varchar(64) DEFAULT NULL COMMENT '学校名',
  `school_type` tinyint(4) DEFAULT NULL COMMENT '学校类别',
  `departments` varchar(64) DEFAULT NULL COMMENT '院系',
  `add_time` int(10) DEFAULT NULL COMMENT '记录添加时间',
  PRIMARY KEY (`education_id`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='教育经历';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_education_experience`
--

LOCK TABLES `aws_education_experience` WRITE;
/*!40000 ALTER TABLE `aws_education_experience` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_education_experience` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_favorite`
--

DROP TABLE IF EXISTS `aws_favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_favorite` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `answer_id` int(11) DEFAULT '0',
  `time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `answer_id` (`answer_id`),
  KEY `time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_favorite`
--

LOCK TABLES `aws_favorite` WRITE;
/*!40000 ALTER TABLE `aws_favorite` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_favorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_favorite_tag`
--

DROP TABLE IF EXISTS `aws_favorite_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_favorite_tag` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `title` varchar(128) DEFAULT NULL,
  `answer_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_favorite_tag`
--

LOCK TABLES `aws_favorite_tag` WRITE;
/*!40000 ALTER TABLE `aws_favorite_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_favorite_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_feature`
--

DROP TABLE IF EXISTS `aws_feature`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_feature` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL COMMENT '专题标题',
  `description` varchar(255) DEFAULT NULL COMMENT '专题描述',
  `icon` varchar(255) DEFAULT NULL COMMENT '专题图标',
  `topic_count` int(11) DEFAULT '0' COMMENT '话题计数',
  `css` text COMMENT '自定义CSS',
  `url_token` varchar(32) DEFAULT NULL,
  `is_scope` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `url_token` (`url_token`),
  KEY `title` (`title`),
  KEY `is_scope` (`is_scope`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_feature`
--

LOCK TABLES `aws_feature` WRITE;
/*!40000 ALTER TABLE `aws_feature` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_feature` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_feature_topic`
--

DROP TABLE IF EXISTS `aws_feature_topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_feature_topic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `feature_id` int(11) DEFAULT '0' COMMENT '专题ID',
  `topic_id` int(11) DEFAULT '0' COMMENT '话题ID',
  PRIMARY KEY (`id`),
  KEY `feature_id` (`feature_id`),
  KEY `topic_id` (`topic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_feature_topic`
--

LOCK TABLES `aws_feature_topic` WRITE;
/*!40000 ALTER TABLE `aws_feature_topic` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_feature_topic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_integral_log`
--

DROP TABLE IF EXISTS `aws_integral_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_integral_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `action` varchar(16) DEFAULT NULL,
  `integral` int(11) DEFAULT NULL,
  `note` varchar(128) DEFAULT NULL,
  `balance` int(11) DEFAULT '0',
  `item_id` int(11) DEFAULT '0',
  `time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `action` (`action`),
  KEY `time` (`time`),
  KEY `integral` (`integral`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_integral_log`
--

LOCK TABLES `aws_integral_log` WRITE;
/*!40000 ALTER TABLE `aws_integral_log` DISABLE KEYS */;
INSERT INTO `aws_integral_log` VALUES (1,1,'REGISTER',2000,'初始资本',2000,0,1366876004),(2,2,'REGISTER',2000,'初始资本',2000,0,1366876410);
/*!40000 ALTER TABLE `aws_integral_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_invitation`
--

DROP TABLE IF EXISTS `aws_invitation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_invitation` (
  `invitation_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '激活ID',
  `uid` int(11) DEFAULT '0' COMMENT '用户ID',
  `invitation_code` varchar(32) DEFAULT NULL COMMENT '激活码',
  `invitation_email` varchar(255) DEFAULT NULL COMMENT '激活email',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  `add_ip` bigint(12) DEFAULT NULL COMMENT '添加IP',
  `active_expire` tinyint(1) DEFAULT '0' COMMENT '激活过期',
  `active_time` int(10) DEFAULT NULL COMMENT '激活时间',
  `active_ip` bigint(12) DEFAULT NULL COMMENT '激活IP',
  `active_status` tinyint(4) DEFAULT '0' COMMENT '1已使用0未使用-1已删除',
  `active_uid` int(11) DEFAULT NULL,
  PRIMARY KEY (`invitation_id`),
  KEY `uid` (`uid`),
  KEY `invitation_code` (`invitation_code`),
  KEY `invitation_email` (`invitation_email`),
  KEY `active_time` (`active_time`),
  KEY `active_ip` (`active_ip`),
  KEY `active_status` (`active_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_invitation`
--

LOCK TABLES `aws_invitation` WRITE;
/*!40000 ALTER TABLE `aws_invitation` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_invitation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_jobs`
--

DROP TABLE IF EXISTS `aws_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_name` varchar(64) DEFAULT NULL COMMENT '职位名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_jobs`
--

LOCK TABLES `aws_jobs` WRITE;
/*!40000 ALTER TABLE `aws_jobs` DISABLE KEYS */;
INSERT INTO `aws_jobs` VALUES (1,'销售'),(2,'市场/市场拓展/公关'),(3,'商务/采购/贸易'),(4,'计算机软、硬件/互联网/IT'),(5,'电子/半导体/仪表仪器'),(6,'通信技术'),(7,'客户服务/技术支持'),(8,'行政/后勤'),(9,'人力资源'),(10,'高级管理'),(11,'生产/加工/制造'),(12,'质控/安检'),(13,'工程机械'),(14,'技工'),(15,'财会/审计/统计'),(16,'金融/银行/保险/证券/投资'),(17,'建筑/房地产/装修/物业'),(18,'交通/仓储/物流'),(19,'普通劳动力/家政服务'),(20,'零售业'),(21,'教育/培训'),(22,'咨询/顾问'),(23,'学术/科研'),(24,'法律'),(25,'美术/设计/创意'),(26,'编辑/文案/传媒/影视/新闻'),(27,'酒店/餐饮/旅游/娱乐'),(28,'化工'),(29,'能源/矿产/地质勘查'),(30,'医疗/护理/保健/美容'),(31,'生物/制药/医疗器械'),(32,'翻译（口译与笔译）'),(33,'公务员'),(34,'环境科学/环保'),(35,'农/林/牧/渔业'),(36,'兼职/临时/培训生/储备干部'),(37,'在校学生'),(38,'其他');
/*!40000 ALTER TABLE `aws_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_mail_queue`
--

DROP TABLE IF EXISTS `aws_mail_queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_mail_queue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `send_to` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_error` tinyint(1) NOT NULL DEFAULT '0',
  `error_message` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `is_error` (`is_error`),
  KEY `send_to` (`send_to`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_mail_queue`
--

LOCK TABLES `aws_mail_queue` WRITE;
/*!40000 ALTER TABLE `aws_mail_queue` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_mail_queue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_nav_menu`
--

DROP TABLE IF EXISTS `aws_nav_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_nav_menu` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(128) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` varchar(16) DEFAULT NULL,
  `type_id` int(11) DEFAULT '0',
  `link` varchar(255) DEFAULT NULL COMMENT '链接',
  `icon` varchar(255) DEFAULT NULL COMMENT '图标',
  `sort` smallint(6) DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`),
  KEY `parent_id` (`link`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_nav_menu`
--

LOCK TABLES `aws_nav_menu` WRITE;
/*!40000 ALTER TABLE `aws_nav_menu` DISABLE KEYS */;
INSERT INTO `aws_nav_menu` VALUES (1,'默认分类','默认分类描述','category',1,NULL,NULL,0);
/*!40000 ALTER TABLE `aws_nav_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_notice`
--

DROP TABLE IF EXISTS `aws_notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_notice` (
  `notice_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `sender_uid` int(11) DEFAULT NULL COMMENT '发送者ID',
  `dialog_id` int(11) DEFAULT NULL COMMENT '对话id',
  `notice_title` varchar(64) DEFAULT NULL COMMENT '标题',
  `notice_content` text COMMENT '内容',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  `notice_type` tinyint(4) DEFAULT NULL COMMENT '0-普通消息10-系统发的消息，不能回复11-系统通知',
  PRIMARY KEY (`notice_id`),
  KEY `dialog_id` (`dialog_id`),
  KEY `sender_uid` (`sender_uid`),
  KEY `add_time` (`add_time`),
  KEY `notice_type` (`notice_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_notice`
--

LOCK TABLES `aws_notice` WRITE;
/*!40000 ALTER TABLE `aws_notice` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_notice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_notice_dialog`
--

DROP TABLE IF EXISTS `aws_notice_dialog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_notice_dialog` (
  `dialog_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '对话ID',
  `sender_uid` int(11) DEFAULT NULL COMMENT '发送者UID',
  `sender_unread` int(11) DEFAULT NULL COMMENT '发送者未读',
  `recipient_uid` int(11) DEFAULT NULL COMMENT '接收者UID',
  `recipient_unread` int(11) DEFAULT NULL COMMENT '接收者未读',
  `add_time` int(11) DEFAULT NULL COMMENT '添加时间',
  `last_time` int(11) DEFAULT NULL COMMENT '最后更新时间',
  `last_notice_id` int(11) DEFAULT NULL COMMENT '最后短消息ID',
  `sender_count` int(11) DEFAULT NULL COMMENT '发送者显示对话条数',
  `recipient_count` int(11) DEFAULT NULL COMMENT '接收者显示对话条数',
  `all_count` int(11) DEFAULT NULL COMMENT '总对话条数',
  PRIMARY KEY (`dialog_id`),
  KEY `recipient_uid` (`recipient_uid`),
  KEY `sender_uid` (`sender_uid`),
  KEY `last_time` (`last_time`),
  KEY `add_time` (`add_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_notice_dialog`
--

LOCK TABLES `aws_notice_dialog` WRITE;
/*!40000 ALTER TABLE `aws_notice_dialog` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_notice_dialog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_notice_recipient`
--

DROP TABLE IF EXISTS `aws_notice_recipient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_notice_recipient` (
  `recipient_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `notice_id` int(11) DEFAULT NULL COMMENT '短信息ID',
  `dialog_id` int(11) DEFAULT NULL COMMENT '对话ID，由时间戳生成',
  `sender_uid` int(11) DEFAULT NULL COMMENT '发送者UID',
  `sender_time` int(11) DEFAULT NULL COMMENT '发送时间',
  `sender_del` tinyint(4) DEFAULT NULL COMMENT '发送者删除',
  `recipient_uid` int(11) DEFAULT NULL COMMENT '接收者UID',
  `recipient_time` int(11) DEFAULT NULL COMMENT '接收时间',
  `recipient_del` tinyint(4) DEFAULT NULL COMMENT '接收者删除',
  PRIMARY KEY (`recipient_id`),
  KEY `recipient_uid` (`recipient_uid`),
  KEY `sender_uid` (`sender_uid`),
  KEY `notice_id` (`notice_id`),
  KEY `dialog_id` (`dialog_id`),
  KEY `sender_del` (`sender_del`),
  KEY `recipient_del` (`recipient_del`),
  KEY `sender_time` (`sender_time`),
  KEY `recipient_time` (`recipient_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_notice_recipient`
--

LOCK TABLES `aws_notice_recipient` WRITE;
/*!40000 ALTER TABLE `aws_notice_recipient` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_notice_recipient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_notification`
--

DROP TABLE IF EXISTS `aws_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_notification` (
  `notification_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `sender_uid` int(11) DEFAULT NULL COMMENT '发送者ID',
  `recipient_uid` int(11) DEFAULT '0' COMMENT '接收者ID',
  `action_type` int(4) DEFAULT NULL COMMENT '操作类型',
  `model_type` smallint(11) NOT NULL DEFAULT '0',
  `source_id` int(11) NOT NULL DEFAULT '0' COMMENT '问题或比赛ID',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  `read_flag` tinyint(1) DEFAULT '0' COMMENT '阅读状态',
  PRIMARY KEY (`notification_id`),
  KEY `recipient_read_flag` (`recipient_uid`,`read_flag`),
  KEY `sender_uid` (`sender_uid`),
  KEY `model_type` (`model_type`),
  KEY `source_id` (`source_id`),
  KEY `action_type` (`action_type`),
  KEY `add_time` (`add_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='系统通知';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_notification`
--

LOCK TABLES `aws_notification` WRITE;
/*!40000 ALTER TABLE `aws_notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_notification_data`
--

DROP TABLE IF EXISTS `aws_notification_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_notification_data` (
  `notification_id` int(11) unsigned NOT NULL,
  `data` text,
  PRIMARY KEY (`notification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='系统通知数据表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_notification_data`
--

LOCK TABLES `aws_notification_data` WRITE;
/*!40000 ALTER TABLE `aws_notification_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_notification_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_question`
--

DROP TABLE IF EXISTS `aws_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_question` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `question_content` varchar(255) NOT NULL DEFAULT '' COMMENT '问题内容',
  `question_detail` text COMMENT '问题说明',
  `add_time` int(11) NOT NULL COMMENT '添加时间',
  `update_time` int(11) DEFAULT NULL,
  `published_uid` int(11) DEFAULT NULL COMMENT '发布用户UID',
  `answer_count` int(11) DEFAULT '0' COMMENT '回答计数',
  `answer_users` int(11) DEFAULT '0' COMMENT '回答人数',
  `view_count` int(11) DEFAULT '0' COMMENT '浏览次数',
  `focus_count` int(11) DEFAULT '0' COMMENT '关注数',
  `comment_count` int(11) DEFAULT '0' COMMENT '评论数',
  `action_history_id` int(11) DEFAULT '0' COMMENT '动作的记录表的关连id',
  `category_id` int(11) DEFAULT '0' COMMENT '分类 ID',
  `agree_count` int(11) DEFAULT '0' COMMENT '回复赞同数总和',
  `against_count` int(11) DEFAULT '0' COMMENT '回复反对数总和',
  `best_answer` int(11) DEFAULT '0' COMMENT '最佳回复 ID',
  `has_attach` tinyint(1) DEFAULT '0' COMMENT '是否存在附件',
  `unverified_modify` text,
  `ip` bigint(11) DEFAULT NULL,
  `last_answer` int(11) DEFAULT '0' COMMENT '最后回答 ID',
  `popular_value` double DEFAULT '0',
  `popular_value_update` int(10) DEFAULT '0',
  `lock` tinyint(1) DEFAULT '0' COMMENT '是否锁定',
  `anonymous` tinyint(1) DEFAULT '0',
  `thanks_count` int(10) DEFAULT '0',
  `question_content_fulltext` varchar(128) DEFAULT '',
  PRIMARY KEY (`question_id`),
  KEY `category_id` (`category_id`),
  KEY `update_time` (`update_time`),
  KEY `add_time` (`add_time`),
  KEY `published_uid` (`published_uid`),
  KEY `answer_count` (`answer_count`),
  KEY `agree_count` (`agree_count`),
  KEY `question_content` (`question_content`),
  KEY `lock` (`lock`),
  KEY `thanks_count` (`thanks_count`),
  KEY `anonymous` (`anonymous`),
  KEY `popular_value` (`popular_value`),
  KEY `best_answer` (`best_answer`),
  KEY `popular_value_update` (`popular_value_update`),
  KEY `against_count` (`against_count`),
  FULLTEXT KEY `question_content_fulltext` (`question_content_fulltext`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='问题列表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_question`
--

LOCK TABLES `aws_question` WRITE;
/*!40000 ALTER TABLE `aws_question` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_question_comments`
--

DROP TABLE IF EXISTS `aws_question_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_question_comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `question_id` int(11) DEFAULT '0',
  `uid` int(11) DEFAULT '0',
  `message` text,
  `time` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`),
  KEY `time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_question_comments`
--

LOCK TABLES `aws_question_comments` WRITE;
/*!40000 ALTER TABLE `aws_question_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_question_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_question_focus`
--

DROP TABLE IF EXISTS `aws_question_focus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_question_focus` (
  `focus_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `question_id` int(11) DEFAULT NULL COMMENT '话题ID',
  `uid` int(11) DEFAULT NULL COMMENT '用户UID',
  `add_time` int(10) DEFAULT NULL,
  PRIMARY KEY (`focus_id`),
  KEY `question_id` (`question_id`),
  KEY `question_uid` (`question_id`,`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='问题关注表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_question_focus`
--

LOCK TABLES `aws_question_focus` WRITE;
/*!40000 ALTER TABLE `aws_question_focus` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_question_focus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_question_invite`
--

DROP TABLE IF EXISTS `aws_question_invite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_question_invite` (
  `question_invite_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `question_id` int(11) NOT NULL COMMENT '问题ID',
  `sender_uid` int(11) NOT NULL,
  `recipients_uid` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL COMMENT '受邀Email',
  `add_time` int(10) DEFAULT '0' COMMENT '添加时间',
  `available_time` int(10) DEFAULT '0' COMMENT '生效时间',
  PRIMARY KEY (`question_invite_id`),
  KEY `question_id` (`question_id`),
  KEY `sender_uid` (`sender_uid`),
  KEY `recipients_uid` (`recipients_uid`),
  KEY `add_time` (`add_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='邀请问答';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_question_invite`
--

LOCK TABLES `aws_question_invite` WRITE;
/*!40000 ALTER TABLE `aws_question_invite` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_question_invite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_question_thanks`
--

DROP TABLE IF EXISTS `aws_question_thanks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_question_thanks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `question_id` int(11) DEFAULT '0',
  `user_name` varchar(255) DEFAULT NULL,
  `time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_question_thanks`
--

LOCK TABLES `aws_question_thanks` WRITE;
/*!40000 ALTER TABLE `aws_question_thanks` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_question_thanks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_question_uninterested`
--

DROP TABLE IF EXISTS `aws_question_uninterested`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_question_uninterested` (
  `interested_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `question_id` int(11) DEFAULT NULL COMMENT '话题ID',
  `uid` int(11) DEFAULT NULL COMMENT '用户UID',
  `add_time` int(10) DEFAULT NULL,
  PRIMARY KEY (`interested_id`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='问题不感兴趣表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_question_uninterested`
--

LOCK TABLES `aws_question_uninterested` WRITE;
/*!40000 ALTER TABLE `aws_question_uninterested` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_question_uninterested` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_redirect`
--

DROP TABLE IF EXISTS `aws_redirect`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_redirect` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT '0',
  `target_id` int(11) DEFAULT '0',
  `time` int(10) DEFAULT NULL,
  `uid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `item_id` (`item_id`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_redirect`
--

LOCK TABLES `aws_redirect` WRITE;
/*!40000 ALTER TABLE `aws_redirect` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_redirect` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_related_topic`
--

DROP TABLE IF EXISTS `aws_related_topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_related_topic` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `topic_id` int(11) DEFAULT '0' COMMENT '话题 ID',
  `related_id` int(11) DEFAULT '0' COMMENT '相关话题 ID',
  PRIMARY KEY (`id`),
  KEY `topic_id` (`topic_id`),
  KEY `related_id` (`related_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_related_topic`
--

LOCK TABLES `aws_related_topic` WRITE;
/*!40000 ALTER TABLE `aws_related_topic` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_related_topic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_report`
--

DROP TABLE IF EXISTS `aws_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0' COMMENT '举报用户id',
  `type` varchar(50) DEFAULT NULL COMMENT '类别',
  `target_id` int(11) DEFAULT '0' COMMENT 'ID',
  `reason` varchar(255) DEFAULT NULL COMMENT '举报理由',
  `url` varchar(255) DEFAULT NULL,
  `add_time` int(11) DEFAULT '0' COMMENT '举报时间',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否处理',
  PRIMARY KEY (`id`),
  KEY `add_time` (`add_time`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_report`
--

LOCK TABLES `aws_report` WRITE;
/*!40000 ALTER TABLE `aws_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_reputation_category`
--

DROP TABLE IF EXISTS `aws_reputation_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_reputation_category` (
  `auto_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(10) DEFAULT '0',
  `category_id` smallint(4) DEFAULT '0',
  `update_time` int(10) DEFAULT '0',
  `reputation` int(10) DEFAULT '0',
  `thanks_count` int(10) DEFAULT '0',
  `agree_count` int(10) DEFAULT '0',
  `question_count` int(10) DEFAULT '0',
  PRIMARY KEY (`auto_id`),
  UNIQUE KEY `uid_category_id` (`uid`,`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_reputation_category`
--

LOCK TABLES `aws_reputation_category` WRITE;
/*!40000 ALTER TABLE `aws_reputation_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_reputation_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_reputation_topic`
--

DROP TABLE IF EXISTS `aws_reputation_topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_reputation_topic` (
  `auto_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `topic_id` int(11) DEFAULT '0' COMMENT '话题ID',
  `topic_count` int(10) DEFAULT '0' COMMENT '威望问题话题计数',
  `update_time` int(10) DEFAULT NULL COMMENT '更新时间',
  `agree_count` int(10) DEFAULT '0' COMMENT '赞成',
  `thanks_count` int(10) DEFAULT '0' COMMENT '感谢',
  `best_answer_count` int(10) DEFAULT '0' COMMENT '最佳回复',
  `reputation` int(10) DEFAULT '0',
  PRIMARY KEY (`auto_id`),
  KEY `topic_count` (`topic_count`),
  KEY `uid` (`uid`),
  KEY `topic_id` (`topic_id`),
  KEY `reputation` (`reputation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_reputation_topic`
--

LOCK TABLES `aws_reputation_topic` WRITE;
/*!40000 ALTER TABLE `aws_reputation_topic` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_reputation_topic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_school`
--

DROP TABLE IF EXISTS `aws_school`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_school` (
  `school_id` int(11) NOT NULL COMMENT '自增ID',
  `school_type` tinyint(4) DEFAULT NULL COMMENT '学校类型ID',
  `school_code` int(11) DEFAULT NULL COMMENT '学校编码',
  `school_name` varchar(64) DEFAULT NULL COMMENT '学校名称',
  `area_code` int(11) DEFAULT NULL COMMENT '地区代码',
  PRIMARY KEY (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='学校';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_school`
--

LOCK TABLES `aws_school` WRITE;
/*!40000 ALTER TABLE `aws_school` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_school` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_sessions`
--

DROP TABLE IF EXISTS `aws_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_sessions` (
  `id` varchar(32) NOT NULL,
  `modified` int(10) NOT NULL,
  `data` text NOT NULL,
  `lifetime` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `modified` (`modified`),
  KEY `lifetime` (`lifetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_sessions`
--

LOCK TABLES `aws_sessions` WRITE;
/*!40000 ALTER TABLE `aws_sessions` DISABLE KEYS */;
INSERT INTO `aws_sessions` VALUES ('0ble8rdqjbl4t8gul49us9uj53',1366878580,'pbn__Anwsion|a:3:{s:10:\"permission\";a:8:{s:10:\"visit_site\";s:1:\"1\";s:13:\"visit_explore\";s:1:\"1\";s:12:\"search_avail\";s:1:\"1\";s:14:\"visit_question\";s:1:\"1\";s:11:\"visit_topic\";s:1:\"1\";s:13:\"visit_feature\";s:1:\"1\";s:12:\"visit_people\";s:1:\"1\";s:11:\"answer_show\";s:1:\"1\";}s:11:\"client_info\";N;s:11:\"human_valid\";N;}',1440),('duvs5f8ga6tgnt75cuhp098fd2',1366878354,'pbn__Anwsion|a:2:{s:10:\"permission\";a:9:{s:16:\"is_administortar\";s:1:\"1\";s:16:\"publish_question\";s:1:\"1\";s:13:\"edit_question\";s:1:\"1\";s:10:\"edit_topic\";s:1:\"1\";s:17:\"redirect_question\";s:1:\"1\";s:13:\"upload_attach\";s:1:\"1\";s:11:\"publish_url\";s:1:\"1\";s:12:\"manage_topic\";s:1:\"1\";s:12:\"create_topic\";s:1:\"1\";}s:11:\"client_info\";a:3:{s:12:\"__CLIENT_UID\";s:1:\"1\";s:18:\"__CLIENT_USER_NAME\";s:5:\"admin\";s:17:\"__CLIENT_PASSWORD\";s:32:\"a22b8f99c1b5d1966e6b0f3bcc05dbd5\";}}pbn__Captcha|a:1:{s:4:\"word\";s:4:\"p8t4\";}',1440),('ii52h6ahaqs25idbilmtn33dn6',1366876209,'pbn__Anwsion|a:3:{s:10:\"permission\";a:8:{s:10:\"visit_site\";s:1:\"1\";s:13:\"visit_explore\";s:1:\"1\";s:12:\"search_avail\";s:1:\"1\";s:14:\"visit_question\";s:1:\"1\";s:11:\"visit_topic\";s:1:\"1\";s:13:\"visit_feature\";s:1:\"1\";s:12:\"visit_people\";s:1:\"1\";s:11:\"answer_show\";s:1:\"1\";}s:11:\"client_info\";N;s:11:\"human_valid\";N;}',1440),('rt9a8foncmevmk0ap78d82t8j3',1366994903,'pbn__Anwsion|a:3:{s:10:\"permission\";a:8:{s:10:\"visit_site\";s:1:\"1\";s:13:\"visit_explore\";s:1:\"1\";s:12:\"search_avail\";s:1:\"1\";s:14:\"visit_question\";s:1:\"1\";s:11:\"visit_topic\";s:1:\"1\";s:13:\"visit_feature\";s:1:\"1\";s:12:\"visit_people\";s:1:\"1\";s:11:\"answer_show\";s:1:\"1\";}s:11:\"client_info\";N;s:11:\"human_valid\";N;}',1440);
/*!40000 ALTER TABLE `aws_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_system_setting`
--

DROP TABLE IF EXISTS `aws_system_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_system_setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `varname` varchar(255) NOT NULL COMMENT '字段名',
  `value` text COMMENT '变量值',
  PRIMARY KEY (`id`),
  UNIQUE KEY `varname` (`varname`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8 COMMENT='系统设置';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_system_setting`
--

LOCK TABLES `aws_system_setting` WRITE;
/*!40000 ALTER TABLE `aws_system_setting` DISABLE KEYS */;
INSERT INTO `aws_system_setting` VALUES (1,'db_engine','s:6:\"InnoDB\";'),(2,'site_name','s:7:\"佳空间\";'),(3,'description','s:29:\"佳空间-空间设计问答社区\";'),(4,'keywords','s:46:\"佳空间,知识社区,社交社区,问答社区\";'),(5,'sensitive_words','s:0:\"\";'),(6,'def_focus_uids','s:1:\"1\";'),(7,'answer_edit_time','s:2:\"30\";'),(8,'cache_level_high','s:2:\"60\";'),(9,'cache_level_normal','s:3:\"600\";'),(10,'cache_level_low','s:4:\"1800\";'),(11,'unread_flush_interval','s:3:\"100\";'),(12,'newer_invitation_num','s:1:\"5\";'),(13,'index_per_page','s:2:\"20\";'),(14,'online_interval','s:2:\"15\";'),(15,'from_email','s:17:\"contact@jiasp.com\";'),(16,'base_url','s:34:\"http://192.168.1.109/jiasp2/Discuz\";'),(17,'img_url','s:0:\"\";'),(18,'upload_url','s:38:\"http://localhost/jiasp2/Discuz/uploads\";'),(19,'upload_dir','s:38:\"G:/apache/htdocs/jiasp2/Discuz/uploads\";'),(20,'ui_style','s:7:\"default\";'),(21,'uninterested_fold','s:1:\"5\";'),(22,'sina_akey',NULL),(23,'sina_skey',NULL),(24,'qq_app_key',NULL),(25,'qq_app_secret',NULL),(26,'sina_weibo_enabled','s:1:\"N\";'),(27,'qq_t_enabled','s:1:\"N\";'),(28,'answer_unique','s:1:\"N\";'),(29,'notifications_per_page','s:2:\"10\";'),(30,'contents_per_page','s:2:\"10\";'),(31,'hot_question_period','s:1:\"7\";'),(32,'category_display_mode','s:4:\"icon\";'),(33,'recommend_users_number','s:1:\"6\";'),(34,'ucenter_enabled','s:1:\"N\";'),(35,'register_email_reqire','s:1:\"Y\";'),(36,'best_answer_day','s:2:\"30\";'),(37,'answer_self_question','s:1:\"Y\";'),(38,'censoruser','s:5:\"admin\";'),(39,'best_answer_min_count','s:1:\"3\";'),(40,'reputation_function','s:78:\"[最佳答案]*3+[赞同]*1-[反对]*1+[发起者赞同]*2-[发起者反对]*1\";'),(41,'db_version','s:8:\"20130420\";'),(42,'statistic_code','s:0:\"\";'),(43,'upload_enable','s:1:\"Y\";'),(44,'answer_length_lower','s:1:\"2\";'),(45,'quick_publish','s:1:\"Y\";'),(46,'invite_reg_only','s:1:\"N\";'),(47,'question_title_limit','s:3:\"100\";'),(48,'register_seccode','s:1:\"Y\";'),(49,'admin_login_seccode','s:1:\"Y\";'),(50,'comment_limit','s:1:\"0\";'),(51,'backup_dir',''),(52,'best_answer_reput','s:2:\"20\";'),(53,'publisher_reputation_factor','s:2:\"10\";'),(54,'request_route','s:1:\"1\";'),(55,'request_route_sys_1','s:226:\"/home/explore/===/explore/\n/home/explore/guest===/guest\n/home/explore/category-(:num)===/category/(:num)\n/people/list/===/users/\n/account/login/===/login/\n/account/logout/===/logout/\n/account/setting/(:any)/===/setting/(:any)/\";'),(56,'request_route_sys_2','s:315:\"/question/(:any)===/q_(:any)\n/topic/(:any)===/t_(:any).html\n/people/(:any)===/p_(:any).html\n/home/explore/category-(:num)===/c_(:num).html\n/home/explore/===/explore/\n/home/explore/guest===/guest\n/people/list/===/users/\n/account/login/===/login/\n/account/logout/===/logout/\n/account/setting/(:any)/===/setting/(:any)/\";'),(57,'request_route_custom','s:0:\"\";'),(58,'upload_size_limit','s:3:\"512\";'),(59,'upload_avatar_size_limit','s:3:\"512\";'),(60,'topic_title_limit','s:2:\"12\";'),(61,'url_rewrite_enable','s:1:\"N\";'),(62,'best_agree_min_count','s:1:\"3\";'),(63,'site_close','s:1:\"N\";'),(64,'close_notice','s:39:\"站点已关闭，管理员请登录。\";'),(65,'qq_login_enabled','s:1:\"N\";'),(66,'qq_login_app_id',''),(67,'qq_login_app_key',''),(68,'integral_system_enabled','s:1:\"N\",'),(69,'integral_system_config_register','s:4:\"2000\",'),(70,'integral_system_config_profile','s:3:\"100\",'),(71,'integral_system_config_invite','s:3:\"200\",'),(72,'integral_system_config_best_answer','s:3:\"200\",'),(73,'integral_system_config_answer_fold','s:3:\"-50\",'),(74,'integral_system_config_new_question','s:3:\"-20\",'),(75,'integral_system_config_new_answer','s:2:\"-5\",'),(76,'integral_system_config_thanks','s:3:\"-10\",'),(77,'integral_system_config_invite_answer','s:3:\"-10\",'),(78,'username_rule','s:1:\"1\";'),(79,'username_length_min','s:1:\"2\";'),(80,'username_length_max','s:2:\"14\";'),(81,'category_enable','s:1:\"Y\";'),(82,'integral_unit','s:6:\"金币\";'),(83,'nav_menu_show_child','s:1:\"1\";'),(84,'anonymous_enable','s:1:\"Y\";'),(85,'report_reason','s:63:\"广告/SPAM\n恶意灌水\n违规内容\n文不对题\n重复发问\";'),(86,'allowed_upload_types','s:41:\"jpg,jpeg,png,gif,zip,doc,docx,rar,pdf,psd\";'),(87,'site_announce','s:0:\"\";'),(88,'icp_beian','s:0:\"\";'),(89,'report_message_uid','s:1:\"1\";'),(90,'today_topics','s:0:\"\";'),(91,'welcome_recommend_users','s:0:\"\";'),(92,'welcome_message_pm','s:180:\"尊敬的{username}，您已经注册成为{sitename}的会员，请您在发表言论时，遵守当地法律法规。\n如果您有什么疑问可以联系管理员。\n\n{sitename}\";'),(93,'welcome_message_email','s:187:\"尊敬的{username}，您已经注册成为{sitename}的会员，请您在发表言论时，遵守当地法律法规。\n如果您有什么疑问可以联系管理员。\n\n{sitename}\n{time}\";'),(94,'time_style','s:1:\"Y\";'),(95,'reputation_log_factor','s:1:\"3\";'),(96,'recommend_topics_number','s:1:\"5\";'),(97,'focus_topics_list_per_page','s:1:\"5\";'),(98,'advanced_editor_enable','s:1:\"Y\";'),(99,'auto_question_lock_day','s:1:\"0\";'),(100,'default_timezone','s:9:\"Etc/GMT-8\";'),(101,'reader_questions_last_days','s:2:\"30\";'),(102,'reader_questions_agree_count','s:2:\"10\"'),(103,'weixin_mp_token','s:0:\"\";'),(104,'new_user_email_setting','a:2:{s:9:\"FOLLOW_ME\";s:1:\"N\";s:10:\"NEW_ANSWER\";s:1:\"N\";}'),(105,'new_user_notification_setting','a:0:{}'),(106,'user_action_history_fresh_upgrade','s:1:\"Y\";'),(107,'cache_dir','s:0:\"\";'),(108,'ucenter_charset','s:5:\"UTF-8\";'),(109,'question_topics_limit','s:2:\"10\";'),(110,'mail_config','a:7:{s:9:\"transport\";s:4:\"smtp\";s:7:\"charset\";s:5:\"UTF-8\";s:6:\"server\";s:18:\"smtp.exmail.qq.com\";s:3:\"ssl\";s:1:\"1\";s:4:\"port\";s:3:\"465\";s:8:\"username\";s:17:\"contact@jiasp.com\";s:8:\"password\";s:10:\"shonbi1985\";}'),(111,'register_agreement','s:1626:\"当您申请用户时，表示您已经同意遵守本规章。\r\n欢迎您加入本站点参与交流和讨论，本站点为社区，为维护网上公共秩序和社会稳定，请您自觉遵守以下条款：\r\n\r\n一、不得利用本站危害国家安全、泄露国家秘密，不得侵犯国家社会集体的和公民的合法权益，不得利用本站制作、复制和传播下列信息：\r\n　（一）煽动抗拒、破坏宪法和法律、行政法规实施的；\r\n　（二）煽动颠覆国家政权，推翻社会主义制度的；\r\n　（三）煽动分裂国家、破坏国家统一的；\r\n　（四）煽动民族仇恨、民族歧视，破坏民族团结的；\r\n　（五）捏造或者歪曲事实，散布谣言，扰乱社会秩序的；\r\n　（六）宣扬封建迷信、淫秽、色情、赌博、暴力、凶杀、恐怖、教唆犯罪的；\r\n　（七）公然侮辱他人或者捏造事实诽谤他人的，或者进行其他恶意攻击的；\r\n　（八）损害国家机关信誉的；\r\n　（九）其他违反宪法和法律行政法规的；\r\n　（十）进行商业广告行为的。\r\n\r\n二、互相尊重，对自己的言论和行为负责。\r\n三、禁止在申请用户时使用相关本站的词汇，或是带有侮辱、毁谤、造谣类的或是有其含义的各种语言进行注册用户，否则我们会将其删除。\r\n四、禁止以任何方式对本站进行各种破坏行为。\r\n五、如果您有违反国家相关法律法规的行为，本站概不负责，您的登录信息均被记录无疑，必要时，我们会向相关的国家管理部门提供此类信息。\";');
/*!40000 ALTER TABLE `aws_system_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_topic`
--

DROP TABLE IF EXISTS `aws_topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_topic` (
  `topic_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '话题id',
  `topic_title` varchar(64) DEFAULT NULL COMMENT '话题标题',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  `discuss_count` int(11) DEFAULT '0' COMMENT '讨论计数',
  `topic_description` text COMMENT '话题描述',
  `topic_pic` varchar(255) DEFAULT NULL COMMENT '话题图片',
  `topic_lock` tinyint(2) NOT NULL DEFAULT '0' COMMENT '话题是否锁定 1 锁定 0 未锁定',
  `focus_count` int(11) DEFAULT '0' COMMENT '关注计数',
  `user_related` tinyint(1) DEFAULT '0' COMMENT '是否被用户关联',
  `url_token` varchar(32) DEFAULT NULL,
  `merged_id` int(11) DEFAULT '0',
  `seo_title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`topic_id`),
  UNIQUE KEY `topic_title` (`topic_title`),
  KEY `url_token` (`url_token`),
  KEY `merged_id` (`merged_id`),
  KEY `discuss_count` (`discuss_count`),
  KEY `add_time` (`add_time`),
  KEY `user_related` (`user_related`),
  KEY `focus_count` (`focus_count`),
  KEY `topic_lock` (`topic_lock`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='话题';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_topic`
--

LOCK TABLES `aws_topic` WRITE;
/*!40000 ALTER TABLE `aws_topic` DISABLE KEYS */;
INSERT INTO `aws_topic` VALUES (1,'默认话题',NULL,0,'默认话题',NULL,0,0,0,NULL,0,NULL);
/*!40000 ALTER TABLE `aws_topic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_topic_focus`
--

DROP TABLE IF EXISTS `aws_topic_focus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_topic_focus` (
  `focus_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `topic_id` int(11) DEFAULT NULL COMMENT '话题ID',
  `uid` int(11) DEFAULT NULL COMMENT '用户UID',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  PRIMARY KEY (`focus_id`),
  KEY `uid` (`uid`),
  KEY `topic_id` (`topic_id`),
  KEY `topic_uid` (`topic_id`,`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='话题关注表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_topic_focus`
--

LOCK TABLES `aws_topic_focus` WRITE;
/*!40000 ALTER TABLE `aws_topic_focus` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_topic_focus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_topic_merge`
--

DROP TABLE IF EXISTS `aws_topic_merge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_topic_merge` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `source_id` int(11) NOT NULL DEFAULT '0',
  `target_id` int(11) NOT NULL DEFAULT '0',
  `uid` int(11) DEFAULT '0',
  `time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `source_id` (`source_id`),
  KEY `target_id` (`target_id`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_topic_merge`
--

LOCK TABLES `aws_topic_merge` WRITE;
/*!40000 ALTER TABLE `aws_topic_merge` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_topic_merge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_topic_question`
--

DROP TABLE IF EXISTS `aws_topic_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_topic_question` (
  `topic_question_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `topic_id` int(11) DEFAULT '0' COMMENT '话题id',
  `question_id` int(11) DEFAULT '0' COMMENT '问题ID',
  `add_time` int(10) DEFAULT '0' COMMENT '添加时间',
  `uid` int(11) DEFAULT '0' COMMENT '用户ID',
  PRIMARY KEY (`topic_question_id`),
  KEY `topic_id` (`topic_id`),
  KEY `question_id` (`question_id`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_topic_question`
--

LOCK TABLES `aws_topic_question` WRITE;
/*!40000 ALTER TABLE `aws_topic_question` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_topic_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_user_action_history`
--

DROP TABLE IF EXISTS `aws_user_action_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_user_action_history` (
  `history_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `uid` int(11) NOT NULL COMMENT '用户id',
  `associate_type` tinyint(1) DEFAULT NULL COMMENT '关联类型: 1 问题 2 回答 3 评论 4 话题',
  `associate_action` smallint(3) DEFAULT NULL COMMENT '操作类型',
  `associate_id` int(11) DEFAULT NULL COMMENT '关联ID',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  `associate_attached` int(11) DEFAULT NULL,
  `anonymous` tinyint(1) DEFAULT '0' COMMENT '是否匿名',
  `fold_status` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`history_id`),
  KEY `add_time` (`add_time`),
  KEY `uid` (`uid`),
  KEY `associate_id` (`associate_id`),
  KEY `anonymous` (`anonymous`),
  KEY `fold_status` (`fold_status`),
  KEY `associate` (`associate_type`,`associate_action`),
  KEY `associate_attached` (`associate_attached`),
  KEY `associate_with_id` (`associate_id`,`associate_type`,`associate_action`),
  KEY `associate_with_uid` (`uid`,`associate_type`,`associate_action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户操作记录';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_user_action_history`
--

LOCK TABLES `aws_user_action_history` WRITE;
/*!40000 ALTER TABLE `aws_user_action_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_user_action_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_user_action_history_data`
--

DROP TABLE IF EXISTS `aws_user_action_history_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_user_action_history_data` (
  `history_id` int(11) unsigned NOT NULL,
  `associate_content` text,
  `associate_attached` text,
  `addon_data` text COMMENT '附加数据',
  PRIMARY KEY (`history_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_user_action_history_data`
--

LOCK TABLES `aws_user_action_history_data` WRITE;
/*!40000 ALTER TABLE `aws_user_action_history_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_user_action_history_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_user_action_history_fresh`
--

DROP TABLE IF EXISTS `aws_user_action_history_fresh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_user_action_history_fresh` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `history_id` int(11) NOT NULL,
  `associate_id` int(11) NOT NULL,
  `associate_type` tinyint(1) NOT NULL,
  `associate_action` smallint(3) NOT NULL,
  `add_time` int(10) NOT NULL DEFAULT '0',
  `uid` int(10) NOT NULL DEFAULT '0',
  `anonymous` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `associate` (`associate_type`,`associate_action`),
  KEY `add_time` (`add_time`),
  KEY `uid` (`uid`),
  KEY `history_id` (`history_id`),
  KEY `associate_with_id` (`id`,`associate_type`,`associate_action`),
  KEY `associate_with_uid` (`uid`,`associate_type`,`associate_action`),
  KEY `anonymous` (`anonymous`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_user_action_history_fresh`
--

LOCK TABLES `aws_user_action_history_fresh` WRITE;
/*!40000 ALTER TABLE `aws_user_action_history_fresh` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_user_action_history_fresh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_user_follow`
--

DROP TABLE IF EXISTS `aws_user_follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_user_follow` (
  `follow_id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `fans_uid` int(11) DEFAULT NULL COMMENT '关注人的UID',
  `friend_uid` int(11) DEFAULT NULL COMMENT '被关注人的uid',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  PRIMARY KEY (`follow_id`),
  KEY `fans_uid` (`fans_uid`),
  KEY `friend_uid` (`friend_uid`),
  KEY `user_follow` (`fans_uid`,`friend_uid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='用户关注表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_user_follow`
--

LOCK TABLES `aws_user_follow` WRITE;
/*!40000 ALTER TABLE `aws_user_follow` DISABLE KEYS */;
INSERT INTO `aws_user_follow` VALUES (1,2,1,1366876410);
/*!40000 ALTER TABLE `aws_user_follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_users`
--

DROP TABLE IF EXISTS `aws_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_users` (
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户的 UID',
  `user_name` varchar(50) DEFAULT NULL COMMENT '用户名',
  `email` varchar(255) DEFAULT NULL COMMENT 'EMAIL',
  `mobile` varchar(50) DEFAULT NULL COMMENT '用户手机',
  `password` varchar(50) DEFAULT NULL COMMENT '用户密码',
  `salt` varchar(50) DEFAULT NULL COMMENT '用户附加混淆码',
  `avatar_file` varchar(50) DEFAULT NULL COMMENT '头像文件',
  `sex` tinyint(4) DEFAULT NULL COMMENT '性别',
  `birthday` int(11) DEFAULT NULL COMMENT '用户生日',
  `country` int(11) DEFAULT NULL COMMENT '国家ID',
  `province` varchar(40) DEFAULT NULL COMMENT '省ID',
  `city` varchar(40) DEFAULT NULL COMMENT '市ID',
  `job_id` int(11) DEFAULT '0' COMMENT '职业ID',
  `reg_time` int(11) DEFAULT NULL COMMENT '注册时间',
  `reg_ip` bigint(12) DEFAULT NULL COMMENT '注册IP',
  `last_login` int(10) DEFAULT '0' COMMENT '最后登录时间',
  `last_ip` bigint(12) DEFAULT NULL COMMENT '最后登录 IP',
  `online_time` int(11) DEFAULT '0' COMMENT '在线时间 (分钟)',
  `last_active` int(11) DEFAULT NULL COMMENT '最后活跃时间',
  `notification_unread` int(11) NOT NULL DEFAULT '0' COMMENT '未读系统通知',
  `notice_unread` int(11) NOT NULL DEFAULT '0' COMMENT '未读短信息',
  `inbox_recv` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0-所有人可以发给我,1-我关注的人',
  `fans_count` int(10) NOT NULL DEFAULT '0' COMMENT '粉丝数',
  `friend_count` int(10) NOT NULL DEFAULT '0' COMMENT '观众数',
  `invite_count` int(11) NOT NULL DEFAULT '0' COMMENT '问我数量',
  `question_count` int(11) NOT NULL DEFAULT '0' COMMENT '问题总数',
  `answer_count` int(11) NOT NULL DEFAULT '0' COMMENT '回答问题数量',
  `topic_focus_count` int(11) NOT NULL DEFAULT '0' COMMENT '话题关注数量',
  `invitation_available` int(11) NOT NULL DEFAULT '0' COMMENT '邀请名额',
  `group_id` smallint(5) DEFAULT '0' COMMENT '用户组',
  `reputation_group` tinyint(3) DEFAULT '0' COMMENT '威望对应组',
  `forbidden` tinyint(3) DEFAULT '0' COMMENT '是否禁止用户',
  `valid_email` tinyint(2) DEFAULT '0' COMMENT '邮箱验证',
  `is_first_login` tinyint(1) DEFAULT '1' COMMENT '首次登录标记',
  `agree_count` int(11) DEFAULT '0' COMMENT '赞同数量',
  `thanks_count` int(11) DEFAULT '0' COMMENT '感谢数量',
  `views_count` int(11) DEFAULT '0' COMMENT '个人主页查看数量',
  `reputation` int(11) DEFAULT '0' COMMENT '个人威望值',
  `reputation_update_time` int(11) DEFAULT NULL COMMENT '个人威望值更新时间',
  `weibo_visit` tinyint(1) DEFAULT '1' COMMENT '微博允许访问',
  `integral` int(11) DEFAULT '0',
  `draft_count` int(11) DEFAULT '0',
  `url_token` varchar(32) DEFAULT NULL,
  `url_token_update` int(10) DEFAULT '0',
  `common_email` varchar(255) DEFAULT NULL COMMENT '常用邮箱',
  `verified` tinyint(1) DEFAULT '0',
  `default_timezone` varchar(32) DEFAULT NULL,
  `email_settings` varchar(255) DEFAULT '',
  `weixin_id` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`uid`),
  KEY `user_name` (`user_name`),
  KEY `email` (`email`),
  KEY `reputation` (`reputation`),
  KEY `reputation_update_time` (`reputation_update_time`),
  KEY `group_id` (`group_id`),
  KEY `agree_count` (`agree_count`),
  KEY `thanks_count` (`thanks_count`),
  KEY `forbidden` (`forbidden`),
  KEY `valid_email` (`valid_email`),
  KEY `last_active` (`last_active`),
  KEY `integral` (`integral`),
  KEY `url_token` (`url_token`),
  KEY `verified` (`verified`),
  KEY `weixin_id` (`weixin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_users`
--

LOCK TABLES `aws_users` WRITE;
/*!40000 ALTER TABLE `aws_users` DISABLE KEYS */;
INSERT INTO `aws_users` VALUES (1,'admin','shonbi@live.com',NULL,'a22b8f99c1b5d1966e6b0f3bcc05dbd5','dizt',NULL,NULL,NULL,NULL,NULL,NULL,0,1366876004,2130706433,1366876443,-1062731411,60,1366878251,0,0,0,1,0,0,0,0,0,10,1,5,0,1,1,0,0,0,0,1366878251,1,2000,0,NULL,0,NULL,0,NULL,'',NULL),(2,'daniel','marinemyx@gmail.com','','76e96e3da15916cb54e47c3209b559e7','dslx',NULL,0,NULL,NULL,NULL,NULL,0,1366876410,-1062731411,0,NULL,0,NULL,0,0,0,0,1,0,0,0,0,5,3,5,0,0,1,0,0,0,0,NULL,1,2000,0,NULL,0,NULL,0,NULL,'a:2:{s:9:\"FOLLOW_ME\";s:1:\"N\";s:10:\"NEW_ANSWER\";s:1:\"N\";}',NULL);
/*!40000 ALTER TABLE `aws_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_users_attrib`
--

DROP TABLE IF EXISTS `aws_users_attrib`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_users_attrib` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `uid` int(11) DEFAULT NULL COMMENT '用户UID',
  `introduction` varchar(255) DEFAULT NULL COMMENT '个人简介',
  `signature` varchar(255) DEFAULT NULL COMMENT '个人签名',
  `qq` int(10) DEFAULT NULL,
  `homepage` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='用户附加属性表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_users_attrib`
--

LOCK TABLES `aws_users_attrib` WRITE;
/*!40000 ALTER TABLE `aws_users_attrib` DISABLE KEYS */;
INSERT INTO `aws_users_attrib` VALUES (1,1,NULL,'',NULL,NULL),(2,2,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `aws_users_attrib` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_users_forbidden`
--

DROP TABLE IF EXISTS `aws_users_forbidden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_users_forbidden` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `admin_uid` int(11) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `add_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_users_forbidden`
--

LOCK TABLES `aws_users_forbidden` WRITE;
/*!40000 ALTER TABLE `aws_users_forbidden` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_users_forbidden` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_users_group`
--

DROP TABLE IF EXISTS `aws_users_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_users_group` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` tinyint(3) DEFAULT '0' COMMENT '0-会员组 1-系统组',
  `custom` tinyint(1) DEFAULT '0' COMMENT '是否自定义',
  `group_name` varchar(50) NOT NULL,
  `reputation_lower` int(11) DEFAULT '0',
  `reputation_higer` int(11) DEFAULT '0',
  `reputation_factor` float DEFAULT '0' COMMENT '威望系数',
  `permission` text COMMENT '权限设置',
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8 COMMENT='用户组';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_users_group`
--

LOCK TABLES `aws_users_group` WRITE;
/*!40000 ALTER TABLE `aws_users_group` DISABLE KEYS */;
INSERT INTO `aws_users_group` VALUES (1,0,0,'超级管理员',0,0,5,'a:9:{s:16:\"is_administortar\";s:1:\"1\";s:16:\"publish_question\";s:1:\"1\";s:13:\"edit_question\";s:1:\"1\";s:10:\"edit_topic\";s:1:\"1\";s:17:\"redirect_question\";s:1:\"1\";s:13:\"upload_attach\";s:1:\"1\";s:11:\"publish_url\";s:1:\"1\";s:12:\"manage_topic\";s:1:\"1\";s:12:\"create_topic\";s:1:\"1\";}'),(2,0,0,'前台管理员',0,0,4,'a:9:{s:12:\"is_moderator\";s:1:\"1\";s:16:\"publish_question\";s:1:\"1\";s:13:\"edit_question\";s:1:\"1\";s:10:\"edit_topic\";s:1:\"1\";s:17:\"redirect_question\";s:1:\"1\";s:13:\"upload_attach\";s:1:\"1\";s:11:\"publish_url\";s:1:\"1\";s:12:\"manage_topic\";s:1:\"1\";s:12:\"create_topic\";s:1:\"1\";}'),(3,0,0,'未验证会员',0,0,0,'a:4:{s:16:\"publish_question\";s:1:\"1\";s:11:\"human_valid\";s:1:\"1\";s:19:\"question_valid_hour\";s:1:\"2\";s:17:\"answer_valid_hour\";s:1:\"2\";}'),(4,0,0,'普通会员',0,0,0,'a:5:{s:16:\"publish_question\";s:1:\"1\";s:13:\"upload_attach\";s:1:\"1\";s:11:\"human_valid\";s:1:\"1\";s:19:\"question_valid_hour\";s:2:\"10\";s:17:\"answer_valid_hour\";s:2:\"10\";}'),(5,1,0,'注册会员',0,100,1,'a:4:{s:16:\"publish_question\";s:1:\"1\";s:11:\"human_valid\";s:1:\"1\";s:19:\"question_valid_hour\";s:1:\"5\";s:17:\"answer_valid_hour\";s:1:\"5\";}'),(6,1,0,'初级会员',100,200,1,'a:6:{s:16:\"publish_question\";s:1:\"1\";s:13:\"upload_attach\";s:1:\"1\";s:11:\"publish_url\";s:1:\"1\";s:11:\"human_valid\";s:1:\"1\";s:19:\"question_valid_hour\";s:1:\"5\";s:17:\"answer_valid_hour\";s:1:\"5\";}'),(7,1,0,'中级会员',200,500,1,'a:5:{s:16:\"publish_question\";s:1:\"1\";s:10:\"edit_topic\";s:1:\"1\";s:17:\"redirect_question\";s:1:\"1\";s:13:\"upload_attach\";s:1:\"1\";s:11:\"publish_url\";s:1:\"1\";}'),(8,1,0,'高级会员',500,1000,1,'a:6:{s:16:\"publish_question\";s:1:\"1\";s:13:\"edit_question\";s:1:\"1\";s:10:\"edit_topic\";s:1:\"1\";s:17:\"redirect_question\";s:1:\"1\";s:13:\"upload_attach\";s:1:\"1\";s:11:\"publish_url\";s:1:\"1\";}'),(9,1,0,'核心会员',1000,999999,1,'a:6:{s:16:\"publish_question\";s:1:\"1\";s:13:\"edit_question\";s:1:\"1\";s:10:\"edit_topic\";s:1:\"1\";s:17:\"redirect_question\";s:1:\"1\";s:13:\"upload_attach\";s:1:\"1\";s:11:\"publish_url\";s:1:\"1\";}'),(99,0,0,'游客',0,0,0,'a:8:{s:10:\"visit_site\";s:1:\"1\";s:13:\"visit_explore\";s:1:\"1\";s:12:\"search_avail\";s:1:\"1\";s:14:\"visit_question\";s:1:\"1\";s:11:\"visit_topic\";s:1:\"1\";s:13:\"visit_feature\";s:1:\"1\";s:12:\"visit_people\";s:1:\"1\";s:11:\"answer_show\";s:1:\"1\";}');
/*!40000 ALTER TABLE `aws_users_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_users_notification_setting`
--

DROP TABLE IF EXISTS `aws_users_notification_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_users_notification_setting` (
  `notice_setting_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `uid` int(11) NOT NULL,
  `data` text COMMENT '设置数据',
  PRIMARY KEY (`notice_setting_id`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='通知设定';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_users_notification_setting`
--

LOCK TABLES `aws_users_notification_setting` WRITE;
/*!40000 ALTER TABLE `aws_users_notification_setting` DISABLE KEYS */;
INSERT INTO `aws_users_notification_setting` VALUES (1,2,'a:0:{}');
/*!40000 ALTER TABLE `aws_users_notification_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_users_online`
--

DROP TABLE IF EXISTS `aws_users_online`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_users_online` (
  `uid` int(11) NOT NULL COMMENT '用户 ID',
  `last_active` int(11) DEFAULT '0' COMMENT '上次活动时间',
  `ip` bigint(12) DEFAULT '0' COMMENT '客户端ip',
  `active_url` varchar(255) DEFAULT NULL COMMENT '停留页面',
  `user_agent` varchar(255) DEFAULT NULL COMMENT '用户客户端信息',
  KEY `uid` (`uid`),
  KEY `last_active` (`last_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='在线用户列表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_users_online`
--

LOCK TABLES `aws_users_online` WRITE;
/*!40000 ALTER TABLE `aws_users_online` DISABLE KEYS */;
INSERT INTO `aws_users_online` VALUES (1,1366878250,-1062731411,'http://localhost/jiasp2/Discuz/','Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31');
/*!40000 ALTER TABLE `aws_users_online` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_users_qq`
--

DROP TABLE IF EXISTS `aws_users_qq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_users_qq` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '用户在本地的UID',
  `type` varchar(20) DEFAULT NULL COMMENT '类别',
  `name` varchar(64) DEFAULT NULL COMMENT '微博昵称',
  `location` varchar(255) DEFAULT NULL COMMENT '地址',
  `gender` varchar(8) DEFAULT NULL,
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  `access_token` varchar(64) DEFAULT NULL,
  `oauth_token_secret` varchar(64) DEFAULT NULL,
  `nick` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_users_qq`
--

LOCK TABLES `aws_users_qq` WRITE;
/*!40000 ALTER TABLE `aws_users_qq` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_users_qq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_users_sina`
--

DROP TABLE IF EXISTS `aws_users_sina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_users_sina` (
  `id` bigint(11) NOT NULL COMMENT '新浪用户 ID',
  `uid` int(11) NOT NULL COMMENT '用户在本地的UID',
  `name` varchar(64) DEFAULT NULL COMMENT '微博昵称',
  `location` varchar(255) DEFAULT NULL COMMENT '地址',
  `description` text COMMENT '个人描述',
  `url` varchar(255) DEFAULT NULL COMMENT '用户博客地址',
  `profile_image_url` varchar(255) DEFAULT NULL COMMENT 'Sina 自定义头像地址',
  `gender` varchar(8) DEFAULT NULL,
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  `access_token` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_users_sina`
--

LOCK TABLES `aws_users_sina` WRITE;
/*!40000 ALTER TABLE `aws_users_sina` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_users_sina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_users_ucenter`
--

DROP TABLE IF EXISTS `aws_users_ucenter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_users_ucenter` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `uc_uid` int(11) DEFAULT '0',
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `uc_uid` (`uc_uid`),
  KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_users_ucenter`
--

LOCK TABLES `aws_users_ucenter` WRITE;
/*!40000 ALTER TABLE `aws_users_ucenter` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_users_ucenter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_verify_apply`
--

DROP TABLE IF EXISTS `aws_verify_apply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_verify_apply` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `attach` varchar(255) DEFAULT NULL,
  `time` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_verify_apply`
--

LOCK TABLES `aws_verify_apply` WRITE;
/*!40000 ALTER TABLE `aws_verify_apply` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_verify_apply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_weixin_message`
--

DROP TABLE IF EXISTS `aws_weixin_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_weixin_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `weixin_id` varchar(32) NOT NULL,
  `content` varchar(255) NOT NULL,
  `action` varchar(32) DEFAULT NULL,
  `time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `weixin_id` (`weixin_id`),
  KEY `time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_weixin_message`
--

LOCK TABLES `aws_weixin_message` WRITE;
/*!40000 ALTER TABLE `aws_weixin_message` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_weixin_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_weixin_valid`
--

DROP TABLE IF EXISTS `aws_weixin_valid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_weixin_valid` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `code` varchar(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_weixin_valid`
--

LOCK TABLES `aws_weixin_valid` WRITE;
/*!40000 ALTER TABLE `aws_weixin_valid` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_weixin_valid` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aws_work_experience`
--

DROP TABLE IF EXISTS `aws_work_experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aws_work_experience` (
  `work_id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `uid` int(11) DEFAULT NULL COMMENT '用户ID',
  `start_year` int(11) DEFAULT NULL COMMENT '开始年份',
  `end_year` int(11) DEFAULT NULL COMMENT '结束年月',
  `company_name` varchar(64) DEFAULT NULL COMMENT '公司名',
  `job_id` int(11) DEFAULT NULL COMMENT '职位ID',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  PRIMARY KEY (`work_id`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工作经历';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aws_work_experience`
--

LOCK TABLES `aws_work_experience` WRITE;
/*!40000 ALTER TABLE `aws_work_experience` DISABLE KEYS */;
/*!40000 ALTER TABLE `aws_work_experience` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jiasp_login_record`
--

DROP TABLE IF EXISTS `jiasp_login_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jiasp_login_record` (
  `id` int(11) NOT NULL,
  `loggingat` timestamp NULL DEFAULT NULL,
  `logging_ip` varchar(45) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `jiasp_user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jiasp_login_record`
--

LOCK TABLES `jiasp_login_record` WRITE;
/*!40000 ALTER TABLE `jiasp_login_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `jiasp_login_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jiasp_pics`
--

DROP TABLE IF EXISTS `jiasp_pics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jiasp_pics` (
  `pic_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `uploader_id` int(11) DEFAULT NULL,
  `designer` varchar(45) DEFAULT NULL,
  `desc` varchar(45) DEFAULT NULL,
  `hard_design_cost` varchar(45) DEFAULT NULL,
  `createat` datetime DEFAULT NULL,
  `style` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT '-1' COMMENT '-1 : not belong to any project',
  `link` varchar(100) DEFAULT NULL,
  `room` int(11) DEFAULT NULL COMMENT '\\''1\\'' >厨房创意 \\''2\\''>卧室创意 \\''3\\''>客厅创意\\''4\\''>卫生间创意\\''5\\''>餐厅创意\\''6\\''>儿童房创意\\''7\\''>阳台创意\\''8\\''>书房创意\\''9\\''>储物间创意\\''10\\''>其他局部创意\\''11\\''>整体创意',
  `likes` int(11) DEFAULT '0',
  `head_link` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`pic_id`),
  UNIQUE KEY `pic_id_UNIQUE` (`pic_id`),
  KEY `uploader_id_idx` (`uploader_id`),
  KEY `project_id_idx` (`project_id`),
  CONSTRAINT `uploader_id` FOREIGN KEY (`uploader_id`) REFERENCES `jiasp_user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8 COMMENT='		';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jiasp_pics`
--

LOCK TABLES `jiasp_pics` WRITE;
/*!40000 ALTER TABLE `jiasp_pics` DISABLE KEYS */;
INSERT INTO `jiasp_pics` VALUES (47,'5176bb1bab2e5.jpg',1,'Daniel Ma','灰常棒','2','2013-04-24 00:47:00',1,NULL,1,-1,'./Public/Uploads/u1/3/',3,0,NULL),(48,'5177ff4e394f4.jpg',1,'Daniel Ma','简约型卫生间','2','2013-04-24 23:50:00',5,NULL,1,-1,'./Public/Uploads/u1/4/',4,0,NULL);
/*!40000 ALTER TABLE `jiasp_pics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jiasp_product`
--

DROP TABLE IF EXISTS `jiasp_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jiasp_product` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `price` varchar(45) DEFAULT NULL,
  `link` varchar(45) DEFAULT NULL,
  `brand` varchar(45) DEFAULT NULL,
  `series` varchar(45) DEFAULT NULL,
  `desc` varchar(45) DEFAULT NULL,
  `createat` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifyat` timestamp NULL DEFAULT NULL,
  `pic_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_id_UNIQUE` (`product_id`),
  KEY `pic_product_relation_idx` (`pic_id`),
  CONSTRAINT `pic_product_relation` FOREIGN KEY (`pic_id`) REFERENCES `jiasp_pics` (`pic_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jiasp_product`
--

LOCK TABLES `jiasp_product` WRITE;
/*!40000 ALTER TABLE `jiasp_product` DISABLE KEYS */;
INSERT INTO `jiasp_product` VALUES (10,'宜家组合沙发',NULL,'www.sina.com','宜家',NULL,NULL,'2013-04-23 16:49:05',NULL,47);
/*!40000 ALTER TABLE `jiasp_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jiasp_project`
--

DROP TABLE IF EXISTS `jiasp_project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jiasp_project` (
  `project_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text,
  `city` varchar(45) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  `desc` text,
  `designer` varchar(45) DEFAULT NULL,
  `uploader_id` int(11) DEFAULT NULL,
  `company` varchar(45) DEFAULT NULL,
  `createat` timestamp NULL DEFAULT NULL,
  `project_time` datetime DEFAULT NULL,
  `link` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`project_id`),
  UNIQUE KEY `project_id_UNIQUE` (`project_id`),
  KEY `user_id_idx` (`uploader_id`),
  CONSTRAINT `uploader` FOREIGN KEY (`uploader_id`) REFERENCES `jiasp_user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jiasp_project`
--

LOCK TABLES `jiasp_project` WRITE;
/*!40000 ALTER TABLE `jiasp_project` DISABLE KEYS */;
/*!40000 ALTER TABLE `jiasp_project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jiasp_reviews`
--

DROP TABLE IF EXISTS `jiasp_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jiasp_reviews` (
  `review_id` int(11) NOT NULL AUTO_INCREMENT,
  `reviewer_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT '-1',
  `desc` text,
  `createat` timestamp NULL DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `disigner_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  UNIQUE KEY `review_id_UNIQUE` (`review_id`),
  KEY `review_user_idx` (`reviewer_id`),
  KEY `review_project_idx` (`project_id`),
  KEY `designer_been_review_idx` (`disigner_id`),
  CONSTRAINT `review_user` FOREIGN KEY (`reviewer_id`) REFERENCES `jiasp_user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `designer_been_review` FOREIGN KEY (`disigner_id`) REFERENCES `jiasp_user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `review_project` FOREIGN KEY (`project_id`) REFERENCES `jiasp_project` (`project_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jiasp_reviews`
--

LOCK TABLES `jiasp_reviews` WRITE;
/*!40000 ALTER TABLE `jiasp_reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `jiasp_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jiasp_user`
--

DROP TABLE IF EXISTS `jiasp_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jiasp_user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `gender` varchar(45) DEFAULT NULL,
  `birth` datetime DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `desc` text,
  `company` varchar(45) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `telephone` varchar(45) DEFAULT NULL,
  `qq` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `website` varchar(45) DEFAULT NULL,
  `author_type` varchar(45) DEFAULT '爱好者',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jiasp_user`
--

LOCK TABLES `jiasp_user` WRITE;
/*!40000 ALTER TABLE `jiasp_user` DISABLE KEYS */;
INSERT INTO `jiasp_user` VALUES (1,'admin',NULL,'m','1985-04-30 00:00:00','bj','administartor','bubargain Inc.','shangdi','123456','234567','22222','contact@jiasp.com','www.jiasp.com','admin'),(2,'徐连军',NULL,'m',NULL,NULL,NULL,'航天设计院',NULL,'123456','123456','123131',NULL,'www.jiasp.com','designer'),(3,'竺佳彦',NULL,'f',NULL,NULL,NULL,'中青旅',NULL,'123458','12458','15454',NULL,NULL,'设计师'),(4,'2',NULL,NULL,NULL,NULL,NULL,'1',NULL,NULL,NULL,NULL,NULL,NULL,'normal'),(5,'3',NULL,NULL,NULL,NULL,NULL,'2',NULL,NULL,NULL,NULL,NULL,NULL,'normal'),(6,'4',NULL,NULL,NULL,NULL,NULL,'3',NULL,NULL,NULL,NULL,NULL,NULL,'normal'),(7,'5',NULL,NULL,NULL,NULL,NULL,'4',NULL,NULL,NULL,NULL,NULL,NULL,'normal'),(8,'6',NULL,NULL,NULL,NULL,NULL,'5',NULL,NULL,NULL,NULL,NULL,NULL,'normal'),(9,'7',NULL,NULL,NULL,NULL,NULL,'6',NULL,NULL,NULL,NULL,NULL,NULL,'normal'),(10,'8',NULL,NULL,NULL,NULL,NULL,'7',NULL,NULL,NULL,NULL,NULL,NULL,'normal'),(11,'9',NULL,NULL,NULL,NULL,NULL,'89',NULL,NULL,NULL,NULL,NULL,NULL,'normal'),(12,'10',NULL,NULL,NULL,NULL,NULL,'9',NULL,NULL,NULL,NULL,NULL,NULL,'normal'),(13,'11',NULL,NULL,NULL,NULL,NULL,'10',NULL,NULL,NULL,NULL,NULL,NULL,'normal');
/*!40000 ALTER TABLE `jiasp_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jiasp_weibo_user`
--

DROP TABLE IF EXISTS `jiasp_weibo_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jiasp_weibo_user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `uid` varchar(45) DEFAULT NULL,
  `nickname` varchar(45) DEFAULT NULL,
  `accesskey` varchar(45) DEFAULT NULL,
  `createat` timestamp NULL DEFAULT NULL,
  `expiredat` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userid_idx` (`user_id`),
  CONSTRAINT `userid` FOREIGN KEY (`user_id`) REFERENCES `jiasp_user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jiasp_weibo_user`
--

LOCK TABLES `jiasp_weibo_user` WRITE;
/*!40000 ALTER TABLE `jiasp_weibo_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `jiasp_weibo_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-04-30  0:03:14
