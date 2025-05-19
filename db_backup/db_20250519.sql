-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        8.0.41 - MySQL Community Server - GPL
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 테이블 react_project.chat_messages 구조 내보내기
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int DEFAULT NULL,
  `sender_id` varchar(255) DEFAULT NULL,
  `message` text,
  `sent_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=213 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 react_project.chat_messages:~25 rows (대략적) 내보내기
INSERT INTO `chat_messages` (`id`, `room_id`, `sender_id`, `message`, `sent_at`) VALUES
	(188, 4, 'abc@abc.com', '하이', '2025-05-15 13:05:57'),
	(189, 4, 'abc@abc.com', '안녕', '2025-05-15 13:09:51'),
	(190, 4, 'abc@abc.com', 'ㅠㅠ', '2025-05-15 13:09:58'),
	(191, 4, 'abc@abc.com', 'ㅎㅇ', '2025-05-15 13:11:09'),
	(192, 4, 'test@test.com', '안냐세요', '2025-05-15 14:41:00'),
	(193, 4, 'test@test.com', 'ㅎㅇ', '2025-05-15 14:41:06'),
	(194, 4, 'abc@abc.com', '냐세요', '2025-05-15 14:41:32'),
	(195, 4, 'abc@abc.com', '냐세여', '2025-05-15 14:41:50'),
	(196, 4, 'abc@abc.com', '하이여', '2025-05-15 14:41:58'),
	(197, 4, 'abc@abc.com', 'ㅎㅇ', '2025-05-15 14:42:04'),
	(198, 4, 'test@test.com', 'ㅠㅠ', '2025-05-15 14:42:32'),
	(199, 4, 'test@test.com', '스크롤이 안 됨', '2025-05-15 14:43:09'),
	(200, 4, 'test@test.com', '??', '2025-05-15 14:44:23'),
	(201, 4, 'abc@abc.com', '된다', '2025-05-15 14:44:47'),
	(202, 5, 'zzz@zzz.com', 'ㅎㅇ', '2025-05-15 15:03:29'),
	(203, 5, 'abc@abc.com', 'ㅎㅇ', '2025-05-15 15:03:46'),
	(204, 6, 'bb@bb.com', '안냐세요', '2025-05-15 15:19:00'),
	(205, 6, 'abc@abc.com', '안냐세요', '2025-05-15 15:19:17'),
	(206, 6, 'bb@bb.com', '냐세요', '2025-05-15 15:55:15'),
	(207, 6, 'abc@abc.com', 'ㅎㅇㅎㅇ', '2025-05-15 16:00:17'),
	(208, 6, 'bb@bb.com', 'ㅎㅇㅎㅇ', '2025-05-15 16:09:12'),
	(209, 4, 'test@test.com', '답장', '2025-05-15 16:12:28'),
	(210, 4, 'test@test.com', '답장', '2025-05-15 16:12:29'),
	(211, 4, 'test@test.com', '답답장', '2025-05-15 16:12:32'),
	(212, 6, 'bb@bb.com', '냐', '2025-05-15 16:51:18');

-- 테이블 react_project.chat_read_status 구조 내보내기
CREATE TABLE IF NOT EXISTS `chat_read_status` (
  `room_id` int NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `last_read_message_id` int DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`room_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 react_project.chat_read_status:~6 rows (대략적) 내보내기
INSERT INTO `chat_read_status` (`room_id`, `user_id`, `last_read_message_id`, `updated_at`) VALUES
	(4, 'abc@abc.com', 200, '2025-05-15 14:44:37'),
	(4, 'test@test.com', 201, '2025-05-15 15:37:02'),
	(5, 'abc@abc.com', 202, '2025-05-15 15:03:44'),
	(5, 'zzz@zzz.com', 203, '2025-05-15 15:03:54'),
	(6, 'abc@abc.com', 206, '2025-05-15 16:00:15'),
	(6, 'bb@bb.com', 208, '2025-05-15 16:51:15');

-- 테이블 react_project.chat_rooms 구조 내보내기
CREATE TABLE IF NOT EXISTS `chat_rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `is_group` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 react_project.chat_rooms:~3 rows (대략적) 내보내기
INSERT INTO `chat_rooms` (`id`, `name`, `is_group`, `created_at`) VALUES
	(4, NULL, 0, '2025-05-15 13:05:54'),
	(5, NULL, 0, '2025-05-15 15:03:26'),
	(6, NULL, 0, '2025-05-15 15:18:57');

-- 테이블 react_project.chat_room_members 구조 내보내기
CREATE TABLE IF NOT EXISTS `chat_room_members` (
  `room_id` int NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `joined_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`room_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 react_project.chat_room_members:~6 rows (대략적) 내보내기
INSERT INTO `chat_room_members` (`room_id`, `user_id`, `joined_at`) VALUES
	(4, 'abc@abc.com', '2025-05-15 13:05:54'),
	(4, 'test@test.com', '2025-05-15 13:05:54'),
	(5, 'abc@abc.com', '2025-05-15 15:03:26'),
	(5, 'zzz@zzz.com', '2025-05-15 15:03:26'),
	(6, 'abc@abc.com', '2025-05-15 15:18:57'),
	(6, 'bb@bb.com', '2025-05-15 15:18:57');

-- 테이블 react_project.follow 구조 내보내기
CREATE TABLE IF NOT EXISTS `follow` (
  `id` int NOT NULL AUTO_INCREMENT,
  `follower_id` varchar(255) NOT NULL DEFAULT '',
  `following_id` varchar(255) NOT NULL DEFAULT '',
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 react_project.follow:~2 rows (대략적) 내보내기
INSERT INTO `follow` (`id`, `follower_id`, `following_id`, `cdatetime`) VALUES
	(16, 'abc@abc.com', 'test@test.com', '2025-05-13 09:52:24'),
	(20, 'test@test.com', 'abc@abc.com', '2025-05-15 11:04:17'),
	(21, 'zzz@zzz.com', 'abc@abc.com', '2025-05-15 15:03:15');

-- 테이블 react_project.hashtag 구조 내보내기
CREATE TABLE IF NOT EXISTS `hashtag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 react_project.hashtag:~0 rows (대략적) 내보내기

-- 테이블 react_project.likes 구조 내보내기
CREATE TABLE IF NOT EXISTS `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `postId` int NOT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 react_project.likes:~0 rows (대략적) 내보내기

-- 테이블 react_project.like_table 구조 내보내기
CREATE TABLE IF NOT EXISTS `like_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `postId` int NOT NULL,
  `cdatetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`,`postId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 react_project.like_table:~0 rows (대략적) 내보내기

-- 테이블 react_project.post 구조 내보내기
CREATE TABLE IF NOT EXISTS `post` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) NOT NULL DEFAULT '',
  `content` text,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `retweetCount` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 react_project.post:~10 rows (대략적) 내보내기
INSERT INTO `post` (`id`, `userId`, `content`, `cdatetime`, `udatetime`, `retweetCount`) VALUES
	(1, 'test@test.com', 'ㄷㄷ', '2025-05-08 15:02:34', '2025-05-08 15:02:34', NULL),
	(2, 'abc@abc.com', 'dd', '2025-05-08 15:37:13', '2025-05-08 15:37:13', NULL),
	(3, 'abc@abc.com', 'ㅇㅇㅇ', '2025-05-08 15:47:46', '2025-05-08 15:47:46', NULL),
	(4, 'abc@abc.com', 'ㅠㅠ', '2025-05-08 15:49:35', '2025-05-08 15:49:35', NULL),
	(5, 'abc@abc.com', 'ㅇㅇㅇㅇ', '2025-05-08 15:50:37', '2025-05-08 15:50:37', NULL),
	(6, 'abc@abc.com', 'ㅣ;ㅣ;', '2025-05-08 15:50:52', '2025-05-08 15:50:52', NULL),
	(7, 'abc@abc.com', 'ㅇㅇㅇㅇ', '2025-05-08 15:52:25', '2025-05-08 15:52:25', NULL),
	(8, 'abc@abc.com', 'ㅇㅇ', '2025-05-08 16:00:09', '2025-05-08 16:00:09', NULL),
	(9, 'abc@abc.com', 'ㅇㅇ', '2025-05-08 17:09:58', '2025-05-08 17:09:58', NULL),
	(10, 'zzz@zzz.com', 'ㅎㅇ', '2025-05-15 17:51:58', '2025-05-15 17:51:58', 0),
	(12, 'zzz@zzz.com', '냐세요', '2025-05-15 18:13:35', '2025-05-15 18:13:35', 0);

-- 테이블 react_project.post_hashtag 구조 내보내기
CREATE TABLE IF NOT EXISTS `post_hashtag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postId` int NOT NULL,
  `hashtagId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 react_project.post_hashtag:~0 rows (대략적) 내보내기

-- 테이블 react_project.post_img 구조 내보내기
CREATE TABLE IF NOT EXISTS `post_img` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postId` int NOT NULL,
  `imgName` varchar(255) NOT NULL,
  `imgPath` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 react_project.post_img:~17 rows (대략적) 내보내기
INSERT INTO `post_img` (`id`, `postId`, `imgName`, `imgPath`) VALUES
	(1, 1, '1746684154086-í¬ì± ì½.jpg', 'uploads/'),
	(2, 2, '1746686233872-í¬ì± ì½3.jpg', 'uploads/'),
	(3, 3, '1746686866507-í¬ì± ì½.jpg', 'uploads/'),
	(4, 3, '1746686866508-í¬ì± ì½2.jpg', 'uploads/'),
	(5, 3, '1746686866508-í¬ì± ì½3.jpg', 'uploads/'),
	(6, 3, '1746686866510-í¬ì± ì½4.jpg', 'uploads/'),
	(7, 4, '1746686975449-í¬ì± ì½.jpg', 'uploads/'),
	(8, 5, '1746687037496-í¬ì± ì½2.jpg', 'uploads/'),
	(9, 6, '1746687052104-í¬ì± ì½3.jpg', 'uploads/'),
	(10, 7, '1746687145101-í¬ì± ì½2.jpg', 'uploads/'),
	(11, 8, '1746687609841-í¬ì± ì½3.jpg', 'uploads/'),
	(12, 9, '1746691798201-í¬ì± ì½.jpg', 'uploads/'),
	(13, 9, '1746691798201-í¬ì± ì½2.jpg', 'uploads/'),
	(14, 9, '1746691798202-í¬ì± ì½3.jpg', 'uploads/'),
	(15, 10, '1747299118581-ë°ííë©´3.jpg', 'uploads/'),
	(16, 11, '1747299655369-ë°ííë©´2.jpg', 'uploads/'),
	(17, 12, '1747300415651-ë°ííë©´2.jpg', 'uploads/');

-- 테이블 react_project.reply 구조 내보내기
CREATE TABLE IF NOT EXISTS `reply` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postId` int NOT NULL,
  `userId` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 react_project.reply:~3 rows (대략적) 내보내기
INSERT INTO `reply` (`id`, `postId`, `userId`, `content`, `cdatetime`) VALUES
	(4, 9, 'test@test.com', 'ㅎㅇ', '2025-05-13 16:45:46'),
	(10, 1, 'test@test.com', 'ㄹㄹ', '2025-05-14 15:03:39'),
	(12, 8, 'test@test.com', 'ㄹ', '2025-05-14 15:04:28'),
	(14, 8, 'abc@abc.com', 'ㅇㅇ', '2025-05-15 16:47:17');

-- 테이블 react_project.retweet 구조 내보내기
CREATE TABLE IF NOT EXISTS `retweet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) NOT NULL DEFAULT '',
  `postId` int NOT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 react_project.retweet:~3 rows (대략적) 내보내기
INSERT INTO `retweet` (`id`, `userId`, `postId`, `cdatetime`) VALUES
	(85, 'test@test.com', 9, '2025-05-13 12:33:20'),
	(87, 'abc@abc.com', 1, '2025-05-15 14:47:39'),
	(88, 'abc@abc.com', 9, '2025-05-15 14:47:53');

-- 테이블 react_project.story 구조 내보내기
CREATE TABLE IF NOT EXISTS `story` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `content` text,
  `img` varchar(255) DEFAULT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `exdatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 react_project.story:~0 rows (대략적) 내보내기

-- 테이블 react_project.sub_reply 구조 내보내기
CREATE TABLE IF NOT EXISTS `sub_reply` (
  `id` int NOT NULL AUTO_INCREMENT,
  `replyId` int NOT NULL,
  `userId` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `replyId` (`replyId`),
  CONSTRAINT `sub_reply_ibfk_1` FOREIGN KEY (`replyId`) REFERENCES `reply` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 react_project.sub_reply:~4 rows (대략적) 내보내기
INSERT INTO `sub_reply` (`id`, `replyId`, `userId`, `content`, `cdatetime`) VALUES
	(56, 10, 'test@test.com', 'ㄹㄹ', '2025-05-14 15:03:41'),
	(57, 10, 'test@test.com', 'ㅇㅇ', '2025-05-14 15:15:54'),
	(58, 4, 'abc@abc.com', 'ㅎㅇ', '2025-05-15 16:46:42'),
	(61, 12, 'abc@abc.com', 'ㅇㅇ', '2025-05-15 16:47:30');

-- 테이블 react_project.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `username` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `profileImg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 react_project.users:~4 rows (대략적) 내보내기
INSERT INTO `users` (`id`, `email`, `password`, `username`, `phone`, `profileImg`, `bio`, `cdatetime`, `udatetime`) VALUES
	(1, 'test@test.com', '$2b$10$3gr7ywhPRyI3lxSsVEa/cu/jhDcKnOicz0odxMpxof84xttzxMqbS', '이응', '01011112222', 'uploads\\1747035365568-í¬ì± ì½.jpg', 'ㅁㄴㅇㅇㅁㄴㄴㅁㅇ', '2025-05-08 11:12:13', '2025-05-12 16:36:09'),
	(2, 'abc@abc.com', '$2b$10$o3bSBoLIWKD.PWGNfDzu9.yvxjCQrPqNt0s.syl2lamVabfeGRV5m', '냠냠', '01023232323', 'uploads/1746686206866-í¬ì± ì½2.jpg', '소개글을 입력해 주세요.', '2025-05-08 15:36:46', '2025-05-08 15:36:46'),
	(3, 'zzz@zzz.com', '$2b$10$K6gLBXhPHGiTv4BUX3FrbuUb7j1RTdinGkAhvYqSENUg641VVtGiy', '하이', '01029293939', 'uploads/1747273583220-í¬ì± ì½4.jpg', '소개글을 입력해 주세요.', '2025-05-15 10:46:23', '2025-05-15 10:46:23'),
	(4, 'bb@bb.com', '$2b$10$NaKNkKyg0WRcJyrZK5bQ8eLUBBqEhM4LuY0bRqv3LKaa82mHMNDL2', '제갈', '01030302020', 'uploads/1747289114122-leaf.png', '소개글을 입력해 주세요.', '2025-05-15 15:05:14', '2025-05-15 15:05:14');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
