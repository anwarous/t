-- ============================================================
-- MQAcademy Seed Data
-- ============================================================

-- Courses
INSERT INTO courses (id, slug, title, description, category, difficulty, total_lessons, duration_minutes, xp_reward, color_hex, icon, tags, created_at)
VALUES
(RANDOM_UUID(), 'arrays-and-hashing', 'Arrays & Hashing', 'Master the fundamentals of arrays and hash maps. Learn to solve problems using frequency maps, two-pointer techniques, and sliding windows.', 'Data Structures', 'BEGINNER', 12, 180, 500, '#3B82F6', 'array', 'arrays,hashing,frequency-map,two-pointers', CURRENT_TIMESTAMP),
(RANDOM_UUID(), 'binary-search', 'Binary Search', 'Deep dive into binary search and its variants. From basic sorted array search to complex search-space reduction problems.', 'Algorithms', 'INTERMEDIATE', 10, 150, 750, '#8B5CF6', 'search', 'binary-search,divide-and-conquer,sorted-arrays', CURRENT_TIMESTAMP),
(RANDOM_UUID(), 'dynamic-programming', 'Dynamic Programming', 'Unlock the power of memoization and tabulation. Solve classic DP problems including knapsack, LCS, and interval DP.', 'Algorithms', 'ADVANCED', 18, 360, 1500, '#EC4899', 'dp', 'dynamic-programming,memoization,tabulation,optimization', CURRENT_TIMESTAMP);

-- Exercises
INSERT INTO exercises (id, slug, title, description, difficulty, category, xp_reward, starter_code, solution_code, hints, created_at)
VALUES
(RANDOM_UUID(), 'two-sum', 'Two Sum',
 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
 'EASY', 'Arrays', 50,
 'function twoSum(nums, target) {\n  // Your solution here\n}',
 'function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map[complement] !== undefined) return [map[complement], i];\n    map[nums[i]] = i;\n  }\n}',
 'Use a hash map to store each number and its index. For each element, check if its complement (target - element) exists in the map.',
 CURRENT_TIMESTAMP),

(RANDOM_UUID(), 'valid-anagram', 'Valid Anagram',
 'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.',
 'EASY', 'Strings', 50,
 'function isAnagram(s, t) {\n  // Your solution here\n}',
 'function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (const c of s) count[c] = (count[c] || 0) + 1;\n  for (const c of t) {\n    if (!count[c]) return false;\n    count[c]--;\n  }\n  return true;\n}',
 'Count the frequency of each character in both strings. If all frequencies match, they are anagrams.',
 CURRENT_TIMESTAMP),

(RANDOM_UUID(), 'binary-search-basic', 'Binary Search',
 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.',
 'EASY', 'Binary Search', 75,
 'function search(nums, target) {\n  // Your solution here\n}',
 'function search(nums, target) {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (nums[mid] === target) return mid;\n    else if (nums[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}',
 'Maintain two pointers low and high. At each step compare the middle element to target and halve the search space.',
 CURRENT_TIMESTAMP),

(RANDOM_UUID(), 'longest-common-subsequence', 'Longest Common Subsequence',
 'Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.',
 'MEDIUM', 'Dynamic Programming', 150,
 'function longestCommonSubsequence(text1, text2) {\n  // Your solution here\n}',
 'function longestCommonSubsequence(text1, text2) {\n  const m = text1.length, n = text2.length;\n  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));\n  for (let i = 1; i <= m; i++)\n    for (let j = 1; j <= n; j++)\n      dp[i][j] = text1[i-1] === text2[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j], dp[i][j-1]);\n  return dp[m][n];\n}',
 'Build a 2D DP table where dp[i][j] represents the LCS of text1[0..i-1] and text2[0..j-1].',
 CURRENT_TIMESTAMP),

(RANDOM_UUID(), 'coin-change', 'Coin Change',
 'You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins needed to make up that amount. If that amount cannot be made up, return -1.',
 'MEDIUM', 'Dynamic Programming', 150,
 'function coinChange(coins, amount) {\n  // Your solution here\n}',
 'function coinChange(coins, amount) {\n  const dp = new Array(amount+1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++)\n    for (const coin of coins)\n      if (coin <= i) dp[i] = Math.min(dp[i], dp[i-coin]+1);\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}',
 'Use a 1D DP array where dp[i] = minimum coins for amount i. Initialize dp[0]=0 and iterate forward.',
 CURRENT_TIMESTAMP),

(RANDOM_UUID(), 'word-break', 'Word Break',
 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
 'HARD', 'Dynamic Programming', 250,
 'function wordBreak(s, wordDict) {\n  // Your solution here\n}',
 'function wordBreak(s, wordDict) {\n  const wordSet = new Set(wordDict);\n  const dp = new Array(s.length+1).fill(false);\n  dp[0] = true;\n  for (let i = 1; i <= s.length; i++)\n    for (let j = 0; j < i; j++)\n      if (dp[j] && wordSet.has(s.slice(j,i))) { dp[i]=true; break; }\n  return dp[s.length];\n}',
 'Use a boolean DP array where dp[i] means s[0..i-1] can be broken into dictionary words.',
 CURRENT_TIMESTAMP);

-- Badges
INSERT INTO badges (id, slug, name, description, icon, rarity)
VALUES
(RANDOM_UUID(), 'first-solve', 'First Blood', 'Solved your very first exercise', '🩸', 'COMMON'),
(RANDOM_UUID(), 'streak-7', 'Week Warrior', 'Maintained a 7-day streak', '🔥', 'RARE'),
(RANDOM_UUID(), 'xp-1000', 'Rising Star', 'Earned 1,000 XP', '⭐', 'RARE'),
(RANDOM_UUID(), 'solved-10', 'Problem Solver', 'Solved 10 exercises', '🧩', 'EPIC'),
(RANDOM_UUID(), 'xp-10000', 'Algorithm Grandmaster', 'Earned 10,000 XP', '🏆', 'LEGENDARY');

-- ============================================================
-- Chapters for Arrays & Hashing course
-- ============================================================
INSERT INTO chapters (id, course_id, title, order_index)
SELECT RANDOM_UUID(), id, 'Introduction to Arrays', 1 FROM courses WHERE slug = 'arrays-and-hashing';

INSERT INTO chapters (id, course_id, title, order_index)
SELECT RANDOM_UUID(), id, 'Hash Maps & Sets', 2 FROM courses WHERE slug = 'arrays-and-hashing';

INSERT INTO chapters (id, course_id, title, order_index)
SELECT RANDOM_UUID(), id, 'Two Pointers & Sliding Window', 3 FROM courses WHERE slug = 'arrays-and-hashing';

-- Lessons for Arrays & Hashing – Chapter 1
INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'What is an Array?', 'VIDEO', 8, 20,
       'https://www.youtube.com/embed/QJNwK2uJyGs',
       'Arrays are contiguous blocks of memory that store elements of the same type. They support O(1) random access by index.',
       1, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'arrays-and-hashing' AND c.order_index = 1;

INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Array Operations & Complexity', 'READING', 10, 20,
       NULL,
       'Learn about common array operations: access O(1), search O(n), insertion O(n), deletion O(n). Understand when to choose arrays vs linked lists.',
       2, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'arrays-and-hashing' AND c.order_index = 1;

INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Prefix Sums', 'VIDEO', 12, 30,
       'https://www.youtube.com/embed/7pJo_rM0z_s',
       'Prefix sums allow range-sum queries in O(1) after O(n) preprocessing. Essential for subarray problems.',
       3, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'arrays-and-hashing' AND c.order_index = 1;

INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Array Practice', 'PRACTICE', 20, 50,
       NULL,
       'Solve 3 array problems to reinforce your understanding of indexing, traversal, and prefix sums.',
       4, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'arrays-and-hashing' AND c.order_index = 1;

-- Lessons for Arrays & Hashing – Chapter 2
INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Hash Maps Explained', 'VIDEO', 14, 30,
       'https://www.youtube.com/embed/KyUTuwz_b7Q',
       'A hash map stores key-value pairs and provides O(1) average-case lookup. Learn how hashing works and how to handle collisions.',
       1, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'arrays-and-hashing' AND c.order_index = 2;

INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Frequency Maps & Anagrams', 'VIDEO', 10, 25,
       'https://www.youtube.com/embed/9UtInBqnCgA',
       'Using hash maps to count character or element frequencies is a common pattern. Two strings are anagrams if their frequency maps are equal.',
       2, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'arrays-and-hashing' AND c.order_index = 2;

INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Two Sum Pattern', 'PRACTICE', 25, 50,
       NULL,
       'Apply the hash map lookup pattern to solve Two Sum and its variants in O(n).',
       3, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'arrays-and-hashing' AND c.order_index = 2;

INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Hash Map Quiz', 'QUIZ', 10, 25,
       NULL,
       'Test your knowledge of hash maps, time complexity, and collision resolution.',
       4, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'arrays-and-hashing' AND c.order_index = 2;

-- Lessons for Arrays & Hashing – Chapter 3
INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Two Pointer Technique', 'VIDEO', 12, 30,
       'https://www.youtube.com/embed/On3r4I1X0Ps',
       'Two pointers move from opposite ends or the same end to solve problems in linear time. Common for sorted arrays, palindromes, and pair sums.',
       1, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'arrays-and-hashing' AND c.order_index = 3;

INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Sliding Window', 'VIDEO', 15, 35,
       'https://www.youtube.com/embed/MK-NZ4hN7rs',
       'A sliding window maintains a subset of elements as a window that expands or contracts. Used for subarray/substring problems with a constraint.',
       2, true
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'arrays-and-hashing' AND c.order_index = 3;

INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Sliding Window Practice', 'PRACTICE', 30, 50,
       NULL,
       'Solve longest substring problems and maximum subarray sum problems using the sliding window pattern.',
       3, true
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'arrays-and-hashing' AND c.order_index = 3;

-- ============================================================
-- Chapters for Binary Search course
-- ============================================================
INSERT INTO chapters (id, course_id, title, order_index)
SELECT RANDOM_UUID(), id, 'Binary Search Basics', 1 FROM courses WHERE slug = 'binary-search';

INSERT INTO chapters (id, course_id, title, order_index)
SELECT RANDOM_UUID(), id, 'Search Space Reduction', 2 FROM courses WHERE slug = 'binary-search';

-- Lessons for Binary Search – Chapter 1
INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Binary Search Intuition', 'VIDEO', 10, 25,
       'https://www.youtube.com/embed/P3YID7liBug',
       'Binary search works on sorted arrays by repeatedly halving the search space. Each step eliminates half the remaining candidates — O(log n).',
       1, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'binary-search' AND c.order_index = 1;

INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Implementation Details', 'READING', 10, 20,
       NULL,
       'Avoid the classic off-by-one bug: use mid = lo + (hi - lo) / 2 to prevent integer overflow. Know when to use lo <= hi vs lo < hi.',
       2, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'binary-search' AND c.order_index = 1;

INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Binary Search Practice', 'PRACTICE', 20, 50,
       NULL,
       'Implement binary search from scratch and solve Find Target in Sorted Array.',
       3, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'binary-search' AND c.order_index = 1;

-- Lessons for Binary Search – Chapter 2
INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Search on Answer', 'VIDEO', 16, 40,
       'https://www.youtube.com/embed/GU7DpgHINWQ',
       'Many problems can be reframed as: "find the smallest/largest value satisfying a monotone condition." Binary search on the answer space solves these in O(log n × f(n)).',
       1, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'binary-search' AND c.order_index = 2;

INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Rotated Sorted Arrays', 'VIDEO', 14, 35,
       'https://www.youtube.com/embed/U8XENwh8Oy8',
       'A rotated sorted array has one "pivot" break point. You can still do binary search in O(log n) by detecting which half is sorted.',
       2, true
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'binary-search' AND c.order_index = 2;

-- ============================================================
-- Chapters for Dynamic Programming course
-- ============================================================
INSERT INTO chapters (id, course_id, title, order_index)
SELECT RANDOM_UUID(), id, 'DP Foundations', 1 FROM courses WHERE slug = 'dynamic-programming';

INSERT INTO chapters (id, course_id, title, order_index)
SELECT RANDOM_UUID(), id, 'Classic DP Patterns', 2 FROM courses WHERE slug = 'dynamic-programming';

INSERT INTO chapters (id, course_id, title, order_index)
SELECT RANDOM_UUID(), id, 'Advanced DP', 3 FROM courses WHERE slug = 'dynamic-programming';

-- Lessons for Dynamic Programming – Chapter 1
INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'What is Dynamic Programming?', 'VIDEO', 15, 30,
       'https://www.youtube.com/embed/oBt53YbR9Kk',
       'DP solves problems by breaking them into overlapping subproblems and storing results to avoid recomputation. Two approaches: top-down memoization and bottom-up tabulation.',
       1, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'dynamic-programming' AND c.order_index = 1;

INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Memoization vs Tabulation', 'READING', 12, 25,
       NULL,
       'Memoization (top-down) uses recursion + a cache. Tabulation (bottom-up) fills a table iteratively. Tabulation avoids recursion overhead and is usually faster in practice.',
       2, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'dynamic-programming' AND c.order_index = 1;

INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Fibonacci the DP Way', 'PRACTICE', 15, 30,
       NULL,
       'Solve Fibonacci using memoization and tabulation. Compare the O(2^n) naive approach with the O(n) DP approach.',
       3, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'dynamic-programming' AND c.order_index = 1;

-- Lessons for Dynamic Programming – Chapter 2
INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Longest Common Subsequence', 'VIDEO', 20, 50,
       'https://www.youtube.com/embed/Ua0GhsJSlWM',
       'LCS is a classic 2D DP problem. dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1]. Time O(mn), Space O(mn) reducible to O(n).',
       1, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'dynamic-programming' AND c.order_index = 2;

INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Coin Change', 'VIDEO', 18, 45,
       'https://www.youtube.com/embed/H9bfqozjoqs',
       'Classic unbounded knapsack variant. dp[i] = minimum coins to make amount i. Initialize dp[0]=0, rest infinity. For each amount, try all coins.',
       2, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'dynamic-programming' AND c.order_index = 2;

INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Classic DP Quiz', 'QUIZ', 15, 30,
       NULL,
       'Test your understanding of LCS, coin change, and the general DP framework.',
       3, false
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'dynamic-programming' AND c.order_index = 2;

-- Lessons for Dynamic Programming – Chapter 3
INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Word Break & String DP', 'VIDEO', 22, 55,
       'https://www.youtube.com/embed/Sx9NNgInc3A',
       'Word Break uses a boolean DP array. dp[i] = true if s[0..i-1] can be segmented. For each i, check all j < i where dp[j] is true and s[j..i-1] is in the dictionary.',
       1, true
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'dynamic-programming' AND c.order_index = 3;

INSERT INTO lessons (id, chapter_id, title, type, duration_minutes, xp_reward, video_url, content, order_index, locked)
SELECT RANDOM_UUID(), c.id,
       'Interval DP', 'READING', 20, 50,
       NULL,
       'Interval DP solves problems on subarrays/substrings by merging smaller intervals. dp[i][j] typically represents the answer for the subarray from index i to j.',
       2, true
FROM chapters c JOIN courses co ON c.course_id = co.id
WHERE co.slug = 'dynamic-programming' AND c.order_index = 3;

-- ============================================================
-- Update exercises with examples, constraints, and test cases
-- ============================================================
UPDATE exercises SET
    examples = '[{"input":"nums = [2,7,11,15], target = 9","output":"[0,1]","explanation":"nums[0] + nums[1] = 2 + 7 = 9"},{"input":"nums = [3,2,4], target = 6","output":"[1,2]"},{"input":"nums = [3,3], target = 6","output":"[0,1]"}]',
    constraints = '["2 <= nums.length <= 10^4","−10^9 <= nums[i] <= 10^9","−10^9 <= target <= 10^9","Only one valid answer exists."]',
    test_cases = '[{"input":{"nums":[2,7,11,15],"target":9},"expected":[0,1]},{"input":{"nums":[3,2,4],"target":6},"expected":[1,2]},{"input":{"nums":[3,3],"target":6},"expected":[0,1]}]'
WHERE slug = 'two-sum';

UPDATE exercises SET
    examples = '[{"input":"s = \"anagram\", t = \"nagaram\"","output":"true"},{"input":"s = \"rat\", t = \"car\"","output":"false"}]',
    constraints = '["1 <= s.length, t.length <= 5 * 10^4","s and t consist of lowercase English letters."]',
    test_cases = '[{"input":{"s":"anagram","t":"nagaram"},"expected":true},{"input":{"s":"rat","t":"car"},"expected":false},{"input":{"s":"a","t":"a"},"expected":true}]'
WHERE slug = 'valid-anagram';

UPDATE exercises SET
    examples = '[{"input":"nums = [-1,0,3,5,9,12], target = 9","output":"4","explanation":"9 exists at index 4"},{"input":"nums = [-1,0,3,5,9,12], target = 2","output":"-1","explanation":"2 does not exist"}]',
    constraints = '["1 <= nums.length <= 10^4","−10^4 < nums[i], target < 10^4","All integers in nums are unique.","nums is sorted in ascending order."]',
    test_cases = '[{"input":{"nums":[-1,0,3,5,9,12],"target":9},"expected":4},{"input":{"nums":[-1,0,3,5,9,12],"target":2},"expected":-1}]'
WHERE slug = 'binary-search-basic';

UPDATE exercises SET
    examples = '[{"input":"text1 = \"abcde\", text2 = \"ace\"","output":"3","explanation":"The LCS is \"ace\" with length 3."},{"input":"text1 = \"abc\", text2 = \"abc\"","output":"3"},{"input":"text1 = \"abc\", text2 = \"def\"","output":"0"}]',
    constraints = '["1 <= text1.length, text2.length <= 1000","text1 and text2 consist of only lowercase English characters."]',
    test_cases = '[{"input":{"text1":"abcde","text2":"ace"},"expected":3},{"input":{"text1":"abc","text2":"abc"},"expected":3},{"input":{"text1":"abc","text2":"def"},"expected":0}]'
WHERE slug = 'longest-common-subsequence';

UPDATE exercises SET
    examples = '[{"input":"coins = [1,5,10], amount = 11","output":"2","explanation":"11 = 10 + 1"},{"input":"coins = [2], amount = 3","output":"-1"},{"input":"coins = [1], amount = 0","output":"0"}]',
    constraints = '["1 <= coins.length <= 12","1 <= coins[i] <= 2^31 - 1","0 <= amount <= 10^4"]',
    test_cases = '[{"input":{"coins":[1,5,10],"amount":11},"expected":2},{"input":{"coins":[2],"amount":3},"expected":-1},{"input":{"coins":[1],"amount":0},"expected":0}]'
WHERE slug = 'coin-change';

UPDATE exercises SET
    examples = '[{"input":"s = \"leetcode\", wordDict = [\"leet\",\"code\"]","output":"true"},{"input":"s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]","output":"true"},{"input":"s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]","output":"false"}]',
    constraints = '["1 <= s.length <= 300","1 <= wordDict.length <= 1000","1 <= wordDict[i].length <= 20","s and wordDict[i] consist of only lowercase English letters.","All strings in wordDict are unique."]',
    test_cases = '[{"input":{"s":"leetcode","wordDict":["leet","code"]},"expected":true},{"input":{"s":"applepenapple","wordDict":["apple","pen"]},"expected":true},{"input":{"s":"catsandog","wordDict":["cats","dog","sand","and","cat"]},"expected":false}]'
WHERE slug = 'word-break';
