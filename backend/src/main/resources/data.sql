-- ============================================================
-- Learning++ Seed Data (idempotent without requiring unique indexes)
-- ============================================================

-- Courses
INSERT INTO courses (id, slug, title, description, category, difficulty, total_lessons, duration_minutes, xp_reward, color_hex, icon, tags, created_at)
SELECT '11111111-1111-1111-1111-111111111111', 'arrays-and-hashing', 'Arrays & Hashing', 'Master the fundamentals of arrays and hash maps. Learn to solve problems using frequency maps, two-pointer techniques, and sliding windows.', 'Data Structures', 'BEGINNER', 12, 180, 500, '#3B82F6', 'array', 'arrays,hashing,frequency-map,two-pointers', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'arrays-and-hashing');

INSERT INTO courses (id, slug, title, description, category, difficulty, total_lessons, duration_minutes, xp_reward, color_hex, icon, tags, created_at)
SELECT '11111111-1111-1111-1111-111111111112', 'binary-search', 'Binary Search', 'Deep dive into binary search and its variants. From basic sorted array search to complex search-space reduction problems.', 'Algorithms', 'INTERMEDIATE', 10, 150, 750, '#8B5CF6', 'search', 'binary-search,divide-and-conquer,sorted-arrays', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'binary-search');

INSERT INTO courses (id, slug, title, description, category, difficulty, total_lessons, duration_minutes, xp_reward, color_hex, icon, tags, created_at)
SELECT '11111111-1111-1111-1111-111111111113', 'dynamic-programming', 'Dynamic Programming', 'Unlock the power of memoization and tabulation. Solve classic DP problems including knapsack, LCS, and interval DP.', 'Algorithms', 'ADVANCED', 18, 360, 1500, '#EC4899', 'dp', 'dynamic-programming,memoization,tabulation,optimization', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'dynamic-programming');

-- Exercises
INSERT INTO exercises (id, slug, title, description, difficulty, category, xp_reward, starter_code, solution_code, hints, created_at)
SELECT '22222222-2222-2222-2222-222222222221', 'two-sum', 'Two Sum',
 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
 'EASY', 'Arrays', 50,
 'function twoSum(nums, target) {\n  // Your solution here\n}',
 'function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map[complement] !== undefined) return [map[complement], i];\n    map[nums[i]] = i;\n  }\n}',
 'Use a hash map to store each number and its index. For each element, check if its complement (target - element) exists in the map.',
 CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE slug = 'two-sum');

INSERT INTO exercises (id, slug, title, description, difficulty, category, xp_reward, starter_code, solution_code, hints, created_at)
SELECT '22222222-2222-2222-2222-222222222222', 'valid-anagram', 'Valid Anagram',
 'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.',
 'EASY', 'Strings', 50,
 'function isAnagram(s, t) {\n  // Your solution here\n}',
 'function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (const c of s) count[c] = (count[c] || 0) + 1;\n  for (const c of t) {\n    if (!count[c]) return false;\n    count[c]--;\n  }\n  return true;\n}',
 'Count the frequency of each character in both strings. If all frequencies match, they are anagrams.',
 CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE slug = 'valid-anagram');

INSERT INTO exercises (id, slug, title, description, difficulty, category, xp_reward, starter_code, solution_code, hints, created_at)
SELECT '22222222-2222-2222-2222-222222222223', 'binary-search-basic', 'Binary Search',
 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.',
 'EASY', 'Binary Search', 75,
 'function search(nums, target) {\n  // Your solution here\n}',
 'function search(nums, target) {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (nums[mid] === target) return mid;\n    else if (nums[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}',
 'Maintain two pointers low and high. At each step compare the middle element to target and halve the search space.',
 CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE slug = 'binary-search-basic');

INSERT INTO exercises (id, slug, title, description, difficulty, category, xp_reward, starter_code, solution_code, hints, created_at)
SELECT '22222222-2222-2222-2222-222222222224', 'longest-common-subsequence', 'Longest Common Subsequence',
 'Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.',
 'MEDIUM', 'Dynamic Programming', 150,
 'function longestCommonSubsequence(text1, text2) {\n  // Your solution here\n}',
 'function longestCommonSubsequence(text1, text2) {\n  const m = text1.length, n = text2.length;\n  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));\n  for (let i = 1; i <= m; i++)\n    for (let j = 1; j <= n; j++)\n      dp[i][j] = text1[i-1] === text2[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j], dp[i][j-1]);\n  return dp[m][n];\n}',
 'Build a 2D DP table where dp[i][j] represents the LCS of text1[0..i-1] and text2[0..j-1].',
 CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE slug = 'longest-common-subsequence');

INSERT INTO exercises (id, slug, title, description, difficulty, category, xp_reward, starter_code, solution_code, hints, created_at)
SELECT '22222222-2222-2222-2222-222222222225', 'coin-change', 'Coin Change',
 'You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins needed to make up that amount. If that amount cannot be made up, return -1.',
 'MEDIUM', 'Dynamic Programming', 150,
 'function coinChange(coins, amount) {\n  // Your solution here\n}',
 'function coinChange(coins, amount) {\n  const dp = new Array(amount+1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++)\n    for (const coin of coins)\n      if (coin <= i) dp[i] = Math.min(dp[i], dp[i-coin]+1);\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}',
 'Use a 1D DP array where dp[i] = minimum coins for amount i. Initialize dp[0]=0 and iterate forward.',
 CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE slug = 'coin-change');

INSERT INTO exercises (id, slug, title, description, difficulty, category, xp_reward, starter_code, solution_code, hints, created_at)
SELECT '22222222-2222-2222-2222-222222222226', 'word-break', 'Word Break',
 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
 'HARD', 'Dynamic Programming', 250,
 'function wordBreak(s, wordDict) {\n  // Your solution here\n}',
 'function wordBreak(s, wordDict) {\n  const wordSet = new Set(wordDict);\n  const dp = new Array(s.length+1).fill(false);\n  dp[0] = true;\n  for (let i = 1; i <= s.length; i++)\n    for (let j = 0; j < i; j++)\n      if (dp[j] && wordSet.has(s.slice(j,i))) { dp[i]=true; break; }\n  return dp[s.length];\n}',
 'Use a boolean DP array where dp[i] means s[0..i-1] can be broken into dictionary words.',
 CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE slug = 'word-break');

-- Badges
INSERT INTO badges (id, slug, name, description, icon, rarity)
SELECT '33333333-3333-3333-3333-333333333331', 'first-solve', 'First Blood', 'Solved your very first exercise', '🩸', 'COMMON'
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE slug = 'first-solve');

INSERT INTO badges (id, slug, name, description, icon, rarity)
SELECT '33333333-3333-3333-3333-333333333332', 'streak-7', 'Week Warrior', 'Maintained a 7-day streak', '🔥', 'RARE'
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE slug = 'streak-7');

INSERT INTO badges (id, slug, name, description, icon, rarity)
SELECT '33333333-3333-3333-3333-333333333333', 'xp-1000', 'Rising Star', 'Earned 1,000 XP', '⭐', 'RARE'
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE slug = 'xp-1000');

INSERT INTO badges (id, slug, name, description, icon, rarity)
SELECT '33333333-3333-3333-3333-333333333334', 'solved-10', 'Problem Solver', 'Solved 10 exercises', '🧩', 'EPIC'
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE slug = 'solved-10');

INSERT INTO badges (id, slug, name, description, icon, rarity)
SELECT '33333333-3333-3333-3333-333333333335', 'xp-10000', 'Algorithm Grandmaster', 'Earned 10,000 XP', '🏆', 'LEGENDARY'
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE slug = 'xp-10000');

-- Power user seed (high streak + achievements unlocked)
INSERT INTO users (id, username, email, password, display_name, avatar_initials, xp, level, streak, total_solved, rank, created_at)
SELECT '44444444-4444-4444-4444-444444444444', 'elite_user', 'elite.user@mqacademy.dev', '$2a$10$7EqJtq98hPqEX7fNZaFWoOeN0i7Q8gYdExgkt1/3uzMdGII4XESy', 'Elite User', 'EU', 4280, 1, 120, 350, 'Legend', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'elite_user');

INSERT INTO user_roles (user_id, role)
SELECT '44444444-4444-4444-4444-444444444444', 'USER'
WHERE NOT EXISTS (
	SELECT 1
	FROM user_roles
	WHERE user_id = '44444444-4444-4444-4444-444444444444'
		AND role = 'USER'
);

INSERT INTO user_badges (id, user_id, badge_id, earned_at)
SELECT '55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333331', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
	SELECT 1
	FROM user_badges
	WHERE user_id = '44444444-4444-4444-4444-444444444444'
		AND badge_id = '33333333-3333-3333-3333-333333333331'
);

INSERT INTO user_badges (id, user_id, badge_id, earned_at)
SELECT '55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333332', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
	SELECT 1
	FROM user_badges
	WHERE user_id = '44444444-4444-4444-4444-444444444444'
		AND badge_id = '33333333-3333-3333-3333-333333333332'
);

INSERT INTO user_badges (id, user_id, badge_id, earned_at)
SELECT '55555555-5555-5555-5555-555555555553', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
	SELECT 1
	FROM user_badges
	WHERE user_id = '44444444-4444-4444-4444-444444444444'
		AND badge_id = '33333333-3333-3333-3333-333333333333'
);

INSERT INTO user_badges (id, user_id, badge_id, earned_at)
SELECT '55555555-5555-5555-5555-555555555554', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333334', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
	SELECT 1
	FROM user_badges
	WHERE user_id = '44444444-4444-4444-4444-444444444444'
		AND badge_id = '33333333-3333-3333-3333-333333333334'
);

INSERT INTO user_badges (id, user_id, badge_id, earned_at)
SELECT '55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333335', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
	SELECT 1
	FROM user_badges
	WHERE user_id = '44444444-4444-4444-4444-444444444444'
		AND badge_id = '33333333-3333-3333-3333-333333333335'
);
