package com.mqacademy.api.seeder;

import com.mqacademy.api.model.*;
import com.mqacademy.api.repository.BadgeRepository;
import com.mqacademy.api.repository.CourseRepository;
import com.mqacademy.api.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CourseRepository courseRepository;
    private final ExerciseRepository exerciseRepository;
    private final BadgeRepository badgeRepository;

    @Override
    public void run(String... args) {
        seedCourses();
        seedExercises();
        seedBadges();
    }

    private void seedCourses() {
        if (courseRepository.count() > 0) return;

        Course arraysAndHashing = Course.builder()
                .slug("arrays-and-hashing")
                .title("Arrays & Hashing")
                .description("Master the fundamentals of arrays and hash maps. Learn to solve problems using frequency maps, two-pointer techniques, and sliding windows.")
                .category("Data Structures")
                .difficulty(Course.Difficulty.BEGINNER)
                .totalLessons(12)
                .durationMinutes(180)
                .xpReward(500)
                .colorHex("#3B82F6")
                .icon("array")
                .tags("arrays,hashing,frequency-map,two-pointers")
                .chapters(List.of(
                        Chapter.builder()
                                .title("Introduction to Arrays")
                                .orderIndex(1)
                                .lessons(List.of(
                                        Lesson.builder().title("What is an Array?").type(Lesson.LessonType.VIDEO)
                                                .durationMinutes(8).xpReward(20)
                                                .videoUrl("https://www.youtube.com/embed/QJNwK2uJyGs")
                                                .content("Arrays are contiguous blocks of memory that store elements of the same type. They support O(1) random access by index.")
                                                .orderIndex(1).locked(false).build(),
                                        Lesson.builder().title("Array Operations & Complexity").type(Lesson.LessonType.READING)
                                                .durationMinutes(10).xpReward(20)
                                                .content("Learn about common array operations: access O(1), search O(n), insertion O(n), deletion O(n). Understand when to choose arrays vs linked lists.")
                                                .orderIndex(2).locked(false).build(),
                                        Lesson.builder().title("Prefix Sums").type(Lesson.LessonType.VIDEO)
                                                .durationMinutes(12).xpReward(30)
                                                .videoUrl("https://www.youtube.com/embed/7pJo_rM0z_s")
                                                .content("Prefix sums allow range-sum queries in O(1) after O(n) preprocessing. Essential for subarray problems.")
                                                .orderIndex(3).locked(false).build(),
                                        Lesson.builder().title("Array Practice").type(Lesson.LessonType.PRACTICE)
                                                .durationMinutes(20).xpReward(50)
                                                .content("Solve 3 array problems to reinforce your understanding of indexing, traversal, and prefix sums.")
                                                .orderIndex(4).locked(false).build()
                                )).build(),
                        Chapter.builder()
                                .title("Hash Maps & Sets")
                                .orderIndex(2)
                                .lessons(List.of(
                                        Lesson.builder().title("Hash Maps Explained").type(Lesson.LessonType.VIDEO)
                                                .durationMinutes(14).xpReward(30)
                                                .videoUrl("https://www.youtube.com/embed/KyUTuwz_b7Q")
                                                .content("A hash map stores key-value pairs and provides O(1) average-case lookup. Learn how hashing works and how to handle collisions.")
                                                .orderIndex(1).locked(false).build(),
                                        Lesson.builder().title("Frequency Maps & Anagrams").type(Lesson.LessonType.VIDEO)
                                                .durationMinutes(10).xpReward(25)
                                                .videoUrl("https://www.youtube.com/embed/9UtInBqnCgA")
                                                .content("Using hash maps to count character or element frequencies is a common pattern. Two strings are anagrams if their frequency maps are equal.")
                                                .orderIndex(2).locked(false).build(),
                                        Lesson.builder().title("Two Sum Pattern").type(Lesson.LessonType.PRACTICE)
                                                .durationMinutes(25).xpReward(50)
                                                .content("Apply the hash map lookup pattern to solve Two Sum and its variants in O(n).")
                                                .orderIndex(3).locked(false).build(),
                                        Lesson.builder().title("Hash Map Quiz").type(Lesson.LessonType.QUIZ)
                                                .durationMinutes(10).xpReward(25)
                                                .content("Test your knowledge of hash maps, time complexity, and collision resolution.")
                                                .orderIndex(4).locked(false).build()
                                )).build(),
                        Chapter.builder()
                                .title("Two Pointers & Sliding Window")
                                .orderIndex(3)
                                .lessons(List.of(
                                        Lesson.builder().title("Two Pointer Technique").type(Lesson.LessonType.VIDEO)
                                                .durationMinutes(12).xpReward(30)
                                                .videoUrl("https://www.youtube.com/embed/On3r4I1X0Ps")
                                                .content("Two pointers move from opposite ends or the same end to solve problems in linear time. Common for sorted arrays, palindromes, and pair sums.")
                                                .orderIndex(1).locked(false).build(),
                                        Lesson.builder().title("Sliding Window").type(Lesson.LessonType.VIDEO)
                                                .durationMinutes(15).xpReward(35)
                                                .videoUrl("https://www.youtube.com/embed/MK-NZ4hN7rs")
                                                .content("A sliding window maintains a subset of elements as a window that expands or contracts. Used for subarray/substring problems with a constraint.")
                                                .orderIndex(2).locked(true).build(),
                                        Lesson.builder().title("Sliding Window Practice").type(Lesson.LessonType.PRACTICE)
                                                .durationMinutes(30).xpReward(50)
                                                .content("Solve longest substring problems and maximum subarray sum problems using the sliding window pattern.")
                                                .orderIndex(3).locked(true).build()
                                )).build()
                )).build();

        Course binarySearch = Course.builder()
                .slug("binary-search")
                .title("Binary Search")
                .description("Deep dive into binary search and its variants. From basic sorted array search to complex search-space reduction problems.")
                .category("Algorithms")
                .difficulty(Course.Difficulty.INTERMEDIATE)
                .totalLessons(10)
                .durationMinutes(150)
                .xpReward(750)
                .colorHex("#8B5CF6")
                .icon("search")
                .tags("binary-search,divide-and-conquer,sorted-arrays")
                .chapters(List.of(
                        Chapter.builder()
                                .title("Binary Search Basics")
                                .orderIndex(1)
                                .lessons(List.of(
                                        Lesson.builder().title("Binary Search Intuition").type(Lesson.LessonType.VIDEO)
                                                .durationMinutes(10).xpReward(25)
                                                .videoUrl("https://www.youtube.com/embed/P3YID7liBug")
                                                .content("Binary search works on sorted arrays by repeatedly halving the search space. Each step eliminates half the remaining candidates — O(log n).")
                                                .orderIndex(1).locked(false).build(),
                                        Lesson.builder().title("Implementation Details").type(Lesson.LessonType.READING)
                                                .durationMinutes(10).xpReward(20)
                                                .content("Avoid the classic off-by-one bug: use mid = lo + (hi - lo) / 2 to prevent integer overflow. Know when to use lo <= hi vs lo < hi.")
                                                .orderIndex(2).locked(false).build(),
                                        Lesson.builder().title("Binary Search Practice").type(Lesson.LessonType.PRACTICE)
                                                .durationMinutes(20).xpReward(50)
                                                .content("Implement binary search from scratch and solve Find Target in Sorted Array.")
                                                .orderIndex(3).locked(false).build()
                                )).build(),
                        Chapter.builder()
                                .title("Search Space Reduction")
                                .orderIndex(2)
                                .lessons(List.of(
                                        Lesson.builder().title("Search on Answer").type(Lesson.LessonType.VIDEO)
                                                .durationMinutes(16).xpReward(40)
                                                .videoUrl("https://www.youtube.com/embed/GU7DpgHINWQ")
                                                .content("Many problems can be reframed as: \"find the smallest/largest value satisfying a monotone condition.\" Binary search on the answer space solves these in O(log n × f(n)).")
                                                .orderIndex(1).locked(false).build(),
                                        Lesson.builder().title("Rotated Sorted Arrays").type(Lesson.LessonType.VIDEO)
                                                .durationMinutes(14).xpReward(35)
                                                .videoUrl("https://www.youtube.com/embed/U8XENwh8Oy8")
                                                .content("A rotated sorted array has one \"pivot\" break point. You can still do binary search in O(log n) by detecting which half is sorted.")
                                                .orderIndex(2).locked(true).build()
                                )).build()
                )).build();

        Course dynamicProgramming = Course.builder()
                .slug("dynamic-programming")
                .title("Dynamic Programming")
                .description("Unlock the power of memoization and tabulation. Solve classic DP problems including knapsack, LCS, and interval DP.")
                .category("Algorithms")
                .difficulty(Course.Difficulty.ADVANCED)
                .totalLessons(18)
                .durationMinutes(360)
                .xpReward(1500)
                .colorHex("#EC4899")
                .icon("dp")
                .tags("dynamic-programming,memoization,tabulation,optimization")
                .chapters(List.of(
                        Chapter.builder()
                                .title("DP Foundations")
                                .orderIndex(1)
                                .lessons(List.of(
                                        Lesson.builder().title("What is Dynamic Programming?").type(Lesson.LessonType.VIDEO)
                                                .durationMinutes(15).xpReward(30)
                                                .videoUrl("https://www.youtube.com/embed/oBt53YbR9Kk")
                                                .content("DP solves problems by breaking them into overlapping subproblems and storing results to avoid recomputation. Two approaches: top-down memoization and bottom-up tabulation.")
                                                .orderIndex(1).locked(false).build(),
                                        Lesson.builder().title("Memoization vs Tabulation").type(Lesson.LessonType.READING)
                                                .durationMinutes(12).xpReward(25)
                                                .content("Memoization (top-down) uses recursion + a cache. Tabulation (bottom-up) fills a table iteratively. Tabulation avoids recursion overhead and is usually faster in practice.")
                                                .orderIndex(2).locked(false).build(),
                                        Lesson.builder().title("Fibonacci the DP Way").type(Lesson.LessonType.PRACTICE)
                                                .durationMinutes(15).xpReward(30)
                                                .content("Solve Fibonacci using memoization and tabulation. Compare the O(2^n) naive approach with the O(n) DP approach.")
                                                .orderIndex(3).locked(false).build()
                                )).build(),
                        Chapter.builder()
                                .title("Classic DP Patterns")
                                .orderIndex(2)
                                .lessons(List.of(
                                        Lesson.builder().title("Longest Common Subsequence").type(Lesson.LessonType.VIDEO)
                                                .durationMinutes(20).xpReward(50)
                                                .videoUrl("https://www.youtube.com/embed/Ua0GhsJSlWM")
                                                .content("LCS is a classic 2D DP problem. dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1]. Time O(mn), Space O(mn) reducible to O(n).")
                                                .orderIndex(1).locked(false).build(),
                                        Lesson.builder().title("Coin Change").type(Lesson.LessonType.VIDEO)
                                                .durationMinutes(18).xpReward(45)
                                                .videoUrl("https://www.youtube.com/embed/H9bfqozjoqs")
                                                .content("Classic unbounded knapsack variant. dp[i] = minimum coins to make amount i. Initialize dp[0]=0, rest infinity. For each amount, try all coins.")
                                                .orderIndex(2).locked(false).build(),
                                        Lesson.builder().title("Classic DP Quiz").type(Lesson.LessonType.QUIZ)
                                                .durationMinutes(15).xpReward(30)
                                                .content("Test your understanding of LCS, coin change, and the general DP framework.")
                                                .orderIndex(3).locked(false).build()
                                )).build(),
                        Chapter.builder()
                                .title("Advanced DP")
                                .orderIndex(3)
                                .lessons(List.of(
                                        Lesson.builder().title("Word Break & String DP").type(Lesson.LessonType.VIDEO)
                                                .durationMinutes(22).xpReward(55)
                                                .videoUrl("https://www.youtube.com/embed/Sx9NNgInc3A")
                                                .content("Word Break uses a boolean DP array. dp[i] = true if s[0..i-1] can be segmented. For each i, check all j < i where dp[j] is true and s[j..i-1] is in the dictionary.")
                                                .orderIndex(1).locked(true).build(),
                                        Lesson.builder().title("Interval DP").type(Lesson.LessonType.READING)
                                                .durationMinutes(20).xpReward(50)
                                                .content("Interval DP solves problems on subarrays/substrings by merging smaller intervals. dp[i][j] typically represents the answer for the subarray from index i to j.")
                                                .orderIndex(2).locked(true).build()
                                )).build()
                )).build();

        courseRepository.saveAll(List.of(arraysAndHashing, binarySearch, dynamicProgramming));
    }

    private void seedExercises() {
        if (exerciseRepository.count() > 0) return;

        Exercise twoSum = Exercise.builder()
                .slug("two-sum")
                .title("Two Sum")
                .description("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.")
                .difficulty(Exercise.Difficulty.EASY)
                .category("Arrays")
                .xpReward(50)
                .starterCode("function twoSum(nums, target) {\n  // Your solution here\n}")
                .solutionCode("function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map[complement] !== undefined) return [map[complement], i];\n    map[nums[i]] = i;\n  }\n}")
                .hints("Use a hash map to store each number and its index. For each element, check if its complement (target - element) exists in the map.")
                .examples("[{\"input\":\"nums = [2,7,11,15], target = 9\",\"output\":\"[0,1]\",\"explanation\":\"nums[0] + nums[1] = 2 + 7 = 9\"},{\"input\":\"nums = [3,2,4], target = 6\",\"output\":\"[1,2]\"},{\"input\":\"nums = [3,3], target = 6\",\"output\":\"[0,1]\"}]")
                .constraints("[\"2 <= nums.length <= 10^4\",\"−10^9 <= nums[i] <= 10^9\",\"−10^9 <= target <= 10^9\",\"Only one valid answer exists.\"]")
                .testCases("[{\"input\":{\"nums\":[2,7,11,15],\"target\":9},\"expected\":[0,1]},{\"input\":{\"nums\":[3,2,4],\"target\":6},\"expected\":[1,2]},{\"input\":{\"nums\":[3,3],\"target\":6},\"expected\":[0,1]}]")
                .build();

        Exercise validAnagram = Exercise.builder()
                .slug("valid-anagram")
                .title("Valid Anagram")
                .description("Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.")
                .difficulty(Exercise.Difficulty.EASY)
                .category("Strings")
                .xpReward(50)
                .starterCode("function isAnagram(s, t) {\n  // Your solution here\n}")
                .solutionCode("function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (const c of s) count[c] = (count[c] || 0) + 1;\n  for (const c of t) {\n    if (!count[c]) return false;\n    count[c]--;\n  }\n  return true;\n}")
                .hints("Count the frequency of each character in both strings. If all frequencies match, they are anagrams.")
                .examples("[{\"input\":\"s = \\\"anagram\\\", t = \\\"nagaram\\\"\",\"output\":\"true\"},{\"input\":\"s = \\\"rat\\\", t = \\\"car\\\"\",\"output\":\"false\"}]")
                .constraints("[\"1 <= s.length, t.length <= 5 * 10^4\",\"s and t consist of lowercase English letters.\"]")
                .testCases("[{\"input\":{\"s\":\"anagram\",\"t\":\"nagaram\"},\"expected\":true},{\"input\":{\"s\":\"rat\",\"t\":\"car\"},\"expected\":false},{\"input\":{\"s\":\"a\",\"t\":\"a\"},\"expected\":true}]")
                .build();

        Exercise binarySearchEx = Exercise.builder()
                .slug("binary-search-basic")
                .title("Binary Search")
                .description("Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.")
                .difficulty(Exercise.Difficulty.EASY)
                .category("Binary Search")
                .xpReward(75)
                .starterCode("function search(nums, target) {\n  // Your solution here\n}")
                .solutionCode("function search(nums, target) {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (nums[mid] === target) return mid;\n    else if (nums[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}")
                .hints("Maintain two pointers low and high. At each step compare the middle element to target and halve the search space.")
                .examples("[{\"input\":\"nums = [-1,0,3,5,9,12], target = 9\",\"output\":\"4\",\"explanation\":\"9 exists at index 4\"},{\"input\":\"nums = [-1,0,3,5,9,12], target = 2\",\"output\":\"-1\",\"explanation\":\"2 does not exist\"}]")
                .constraints("[\"1 <= nums.length <= 10^4\",\"−10^4 < nums[i], target < 10^4\",\"All integers in nums are unique.\",\"nums is sorted in ascending order.\"]")
                .testCases("[{\"input\":{\"nums\":[-1,0,3,5,9,12],\"target\":9},\"expected\":4},{\"input\":{\"nums\":[-1,0,3,5,9,12],\"target\":2},\"expected\":-1}]")
                .build();

        Exercise lcs = Exercise.builder()
                .slug("longest-common-subsequence")
                .title("Longest Common Subsequence")
                .description("Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.")
                .difficulty(Exercise.Difficulty.MEDIUM)
                .category("Dynamic Programming")
                .xpReward(150)
                .starterCode("function longestCommonSubsequence(text1, text2) {\n  // Your solution here\n}")
                .solutionCode("function longestCommonSubsequence(text1, text2) {\n  const m = text1.length, n = text2.length;\n  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));\n  for (let i = 1; i <= m; i++)\n    for (let j = 1; j <= n; j++)\n      dp[i][j] = text1[i-1] === text2[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j], dp[i][j-1]);\n  return dp[m][n];\n}")
                .hints("Build a 2D DP table where dp[i][j] represents the LCS of text1[0..i-1] and text2[0..j-1].")
                .examples("[{\"input\":\"text1 = \\\"abcde\\\", text2 = \\\"ace\\\"\",\"output\":\"3\",\"explanation\":\"The LCS is \\\"ace\\\" with length 3.\"},{\"input\":\"text1 = \\\"abc\\\", text2 = \\\"abc\\\"\",\"output\":\"3\"},{\"input\":\"text1 = \\\"abc\\\", text2 = \\\"def\\\"\",\"output\":\"0\"}]")
                .constraints("[\"1 <= text1.length, text2.length <= 1000\",\"text1 and text2 consist of only lowercase English characters.\"]")
                .testCases("[{\"input\":{\"text1\":\"abcde\",\"text2\":\"ace\"},\"expected\":3},{\"input\":{\"text1\":\"abc\",\"text2\":\"abc\"},\"expected\":3},{\"input\":{\"text1\":\"abc\",\"text2\":\"def\"},\"expected\":0}]")
                .build();

        Exercise coinChange = Exercise.builder()
                .slug("coin-change")
                .title("Coin Change")
                .description("You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins needed to make up that amount. If that amount cannot be made up, return -1.")
                .difficulty(Exercise.Difficulty.MEDIUM)
                .category("Dynamic Programming")
                .xpReward(150)
                .starterCode("function coinChange(coins, amount) {\n  // Your solution here\n}")
                .solutionCode("function coinChange(coins, amount) {\n  const dp = new Array(amount+1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++)\n    for (const coin of coins)\n      if (coin <= i) dp[i] = Math.min(dp[i], dp[i-coin]+1);\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}")
                .hints("Use a 1D DP array where dp[i] = minimum coins for amount i. Initialize dp[0]=0 and iterate forward.")
                .examples("[{\"input\":\"coins = [1,5,10], amount = 11\",\"output\":\"2\",\"explanation\":\"11 = 10 + 1\"},{\"input\":\"coins = [2], amount = 3\",\"output\":\"-1\"},{\"input\":\"coins = [1], amount = 0\",\"output\":\"0\"}]")
                .constraints("[\"1 <= coins.length <= 12\",\"1 <= coins[i] <= 2^31 - 1\",\"0 <= amount <= 10^4\"]")
                .testCases("[{\"input\":{\"coins\":[1,5,10],\"amount\":11},\"expected\":2},{\"input\":{\"coins\":[2],\"amount\":3},\"expected\":-1},{\"input\":{\"coins\":[1],\"amount\":0},\"expected\":0}]")
                .build();

        Exercise wordBreak = Exercise.builder()
                .slug("word-break")
                .title("Word Break")
                .description("Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.")
                .difficulty(Exercise.Difficulty.HARD)
                .category("Dynamic Programming")
                .xpReward(250)
                .starterCode("function wordBreak(s, wordDict) {\n  // Your solution here\n}")
                .solutionCode("function wordBreak(s, wordDict) {\n  const wordSet = new Set(wordDict);\n  const dp = new Array(s.length+1).fill(false);\n  dp[0] = true;\n  for (let i = 1; i <= s.length; i++)\n    for (let j = 0; j < i; j++)\n      if (dp[j] && wordSet.has(s.slice(j,i))) { dp[i]=true; break; }\n  return dp[s.length];\n}")
                .hints("Use a boolean DP array where dp[i] means s[0..i-1] can be broken into dictionary words.")
                .examples("[{\"input\":\"s = \\\"leetcode\\\", wordDict = [\\\"leet\\\",\\\"code\\\"]\",\"output\":\"true\"},{\"input\":\"s = \\\"applepenapple\\\", wordDict = [\\\"apple\\\",\\\"pen\\\"]\",\"output\":\"true\"},{\"input\":\"s = \\\"catsandog\\\", wordDict = [\\\"cats\\\",\\\"dog\\\",\\\"sand\\\",\\\"and\\\",\\\"cat\\\"]\",\"output\":\"false\"}]")
                .constraints("[\"1 <= s.length <= 300\",\"1 <= wordDict.length <= 1000\",\"1 <= wordDict[i].length <= 20\",\"s and wordDict[i] consist of only lowercase English letters.\",\"All strings in wordDict are unique.\"]")
                .testCases("[{\"input\":{\"s\":\"leetcode\",\"wordDict\":[\"leet\",\"code\"]},\"expected\":true},{\"input\":{\"s\":\"applepenapple\",\"wordDict\":[\"apple\",\"pen\"]},\"expected\":true},{\"input\":{\"s\":\"catsandog\",\"wordDict\":[\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]},\"expected\":false}]")
                .build();

        exerciseRepository.saveAll(List.of(twoSum, validAnagram, binarySearchEx, lcs, coinChange, wordBreak));
    }

    private void seedBadges() {
        if (badgeRepository.count() > 0) return;

        badgeRepository.saveAll(List.of(
                Badge.builder().slug("first-solve").name("First Blood").description("Solved your very first exercise").icon("🩸").rarity(Badge.Rarity.COMMON).build(),
                Badge.builder().slug("streak-7").name("Week Warrior").description("Maintained a 7-day streak").icon("🔥").rarity(Badge.Rarity.RARE).build(),
                Badge.builder().slug("xp-1000").name("Rising Star").description("Earned 1,000 XP").icon("⭐").rarity(Badge.Rarity.RARE).build(),
                Badge.builder().slug("solved-10").name("Problem Solver").description("Solved 10 exercises").icon("🧩").rarity(Badge.Rarity.EPIC).build(),
                Badge.builder().slug("xp-10000").name("Algorithm Grandmaster").description("Earned 10,000 XP").icon("🏆").rarity(Badge.Rarity.LEGENDARY).build()
        ));
    }
}
