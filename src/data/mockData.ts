// ─── Types ────────────────────────────────────────────────────────────────────

export interface Course {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  progress: number
  totalLessons: number
  completedLessons: number
  duration: string
  xpReward: number
  color: string
  icon: string
  tags: string[]
  chapters: Chapter[]
}

export interface Chapter {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  type: 'video' | 'reading' | 'practice' | 'quiz'
  duration: string
  completed: boolean
  locked: boolean
  xp: number
}

export interface Exercise {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  completed: boolean
  attempts: number
  xp: number
  description: string
  starterCode: string
  solution: string
  examples?: { input: string; output: string; note?: string }[]
  constraints?: string[]
  hint?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  type?: 'hint' | 'error' | 'explanation' | 'normal'
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_USER = {
  id: 'usr_001',
  name: 'Alex Chen',
  email: 'alex@example.com',
  avatar: 'AC',
  xp: 3240,
  level: 12,
  streak: 7,
  totalSolved: 47,
  rank: 'Algorithm Apprentice',
  joinedAt: '2024-01-15',
}

export const XP_TO_NEXT_LEVEL = 4000
export const LEVEL_TITLES: Record<number, string> = {
  1: 'Novice', 5: 'Apprentice', 10: 'Practitioner',
  15: 'Expert', 20: 'Master', 25: 'Grandmaster', 30: 'Legend',
}

export const MOCK_COURSES: Course[] = [
  {
    id: 'sorting-algorithms',
    title: 'Sorting Algorithms',
    description: 'Master the art of ordering — from bubble sort to quicksort with interactive visualizations.',
    category: 'Algorithms',
    difficulty: 'Beginner',
    progress: 68,
    totalLessons: 12,
    completedLessons: 8,
    duration: '4h 30m',
    xpReward: 800,
    color: '#1a5cff',
    icon: '↕',
    tags: ['Arrays', 'Time Complexity', 'Comparison'],
    chapters: [
      {
        id: 'ch-1',
        title: 'Introduction to Sorting',
        lessons: [
          { id: 'l-1', title: 'What is Sorting?', type: 'video', duration: '8m', completed: true, locked: false, xp: 30 },
          { id: 'l-2', title: 'Time Complexity Basics', type: 'reading', duration: '12m', completed: true, locked: false, xp: 20 },
          { id: 'l-3', title: 'Comparison Operators', type: 'practice', duration: '15m', completed: true, locked: false, xp: 50 },
        ],
      },
      {
        id: 'ch-2',
        title: 'Elementary Sorting',
        lessons: [
          { id: 'l-4', title: 'Bubble Sort', type: 'video', duration: '10m', completed: true, locked: false, xp: 40 },
          { id: 'l-5', title: 'Bubble Sort Visualization', type: 'practice', duration: '20m', completed: true, locked: false, xp: 80 },
          { id: 'l-6', title: 'Selection Sort', type: 'video', duration: '9m', completed: true, locked: false, xp: 40 },
          { id: 'l-7', title: 'Insertion Sort', type: 'video', duration: '11m', completed: true, locked: false, xp: 40 },
          { id: 'l-8', title: 'Practice: Elementary Sorts', type: 'quiz', duration: '25m', completed: true, locked: false, xp: 100 },
        ],
      },
      {
        id: 'ch-3',
        title: 'Efficient Sorting',
        lessons: [
          { id: 'l-9', title: 'Merge Sort Deep Dive', type: 'video', duration: '15m', completed: false, locked: false, xp: 60 },
          { id: 'l-10', title: 'Quick Sort Strategy', type: 'video', duration: '18m', completed: false, locked: true, xp: 60 },
          { id: 'l-11', title: 'Heap Sort', type: 'reading', duration: '14m', completed: false, locked: true, xp: 40 },
          { id: 'l-12', title: 'Final Challenge', type: 'practice', duration: '40m', completed: false, locked: true, xp: 200 },
        ],
      },
    ],
  },
  {
    id: 'graph-algorithms',
    title: 'Graph Algorithms',
    description: 'Traverse networks, find shortest paths, and detect cycles using BFS, DFS, and Dijkstra.',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    progress: 25,
    totalLessons: 15,
    completedLessons: 4,
    duration: '6h 15m',
    xpReward: 1200,
    color: '#7c3aed',
    icon: '◈',
    tags: ['Graphs', 'BFS', 'DFS', 'Shortest Path'],
    chapters: [
      {
        id: 'g-ch-1',
        title: 'Graph Fundamentals',
        lessons: [
          { id: 'g-l-1', title: 'Graph Representations', type: 'video', duration: '12m', completed: true, locked: false, xp: 40 },
          { id: 'g-l-2', title: 'Adjacency Matrix vs List', type: 'reading', duration: '10m', completed: true, locked: false, xp: 30 },
          { id: 'g-l-3', title: 'Types of Graphs', type: 'reading', duration: '8m', completed: true, locked: false, xp: 25 },
          { id: 'g-l-4', title: 'Graph Quiz', type: 'quiz', duration: '15m', completed: true, locked: false, xp: 70 },
        ],
      },
      {
        id: 'g-ch-2',
        title: 'Traversal Algorithms',
        lessons: [
          { id: 'g-l-5', title: 'Breadth First Search', type: 'video', duration: '16m', completed: false, locked: false, xp: 60 },
          { id: 'g-l-6', title: 'Depth First Search', type: 'video', duration: '14m', completed: false, locked: true, xp: 60 },
          { id: 'g-l-7', title: 'Practice: BFS & DFS', type: 'practice', duration: '35m', completed: false, locked: true, xp: 150 },
        ],
      },
    ],
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    description: 'Break complex problems into overlapping subproblems with memoization and tabulation.',
    category: 'Techniques',
    difficulty: 'Advanced',
    progress: 10,
    totalLessons: 18,
    completedLessons: 2,
    duration: '8h 45m',
    xpReward: 2000,
    color: '#f59e0b',
    icon: '⟳',
    tags: ['Memoization', 'Tabulation', 'Optimization'],
    chapters: [
      {
        id: 'dp-ch-1',
        title: 'DP Foundations',
        lessons: [
          { id: 'dp-l-1', title: 'Intro to Dynamic Programming', type: 'video', duration: '20m', completed: true, locked: false, xp: 50 },
          { id: 'dp-l-2', title: 'Fibonacci with Memoization', type: 'practice', duration: '30m', completed: true, locked: false, xp: 100 },
          { id: 'dp-l-3', title: 'Top-down vs Bottom-up', type: 'reading', duration: '15m', completed: false, locked: false, xp: 40 },
        ],
      },
    ],
  },
  {
    id: 'data-structures',
    title: 'Data Structures',
    description: 'Stacks, queues, trees, heaps — build a rock-solid foundation for algorithmic thinking.',
    category: 'Foundations',
    difficulty: 'Beginner',
    progress: 90,
    totalLessons: 10,
    completedLessons: 9,
    duration: '3h 20m',
    xpReward: 600,
    color: '#10b981',
    icon: '◳',
    tags: ['Arrays', 'Trees', 'Stacks', 'Queues'],
    chapters: [],
  },
]

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 'ex-001',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    completed: true,
    attempts: 2,
    xp: 100,
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Find two numbers that add up to target.
    
    Args:
        nums: List of integers
        target: Target sum
    
    Returns:
        Indices of the two numbers
    """
    # Your solution here
    pass


# Test cases
print(two_sum([2, 7, 11, 15], 9))   # Expected: [0, 1]
print(two_sum([3, 2, 4], 6))         # Expected: [1, 2]
print(two_sum([3, 3], 6))            # Expected: [0, 1]
`,
    solution: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    examples: [
      { input: '[2, 7, 11, 15], target = 9', output: '[0, 1]', note: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: '[3, 2, 4], target = 6',       output: '[1, 2]' },
    ],
    constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists'],
    hint: 'For each element x, you need target − x. Can you check for it in O(1) using a data structure you\'ve seen?',
  },
  {
    id: 'ex-002',
    title: 'Implement Bubble Sort',
    difficulty: 'Easy',
    category: 'Sorting',
    completed: false,
    attempts: 1,
    xp: 150,
    description: 'Implement the bubble sort algorithm to sort an array of integers in ascending order.',
    starterCode: `def bubble_sort(arr: list[int]) -> list[int]:
    """
    Sort array using bubble sort algorithm.
    Time Complexity: O(n²)
    Space Complexity: O(1)
    
    Args:
        arr: Unsorted list of integers
    
    Returns:
        Sorted list
    """
    # Your solution here
    pass


# Test cases
print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))
# Expected: [11, 12, 22, 25, 34, 64, 90]

print(bubble_sort([5, 4, 3, 2, 1]))
# Expected: [1, 2, 3, 4, 5]
`,
    solution: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
    examples: [
      { input: '[64, 34, 25, 12, 22, 11, 90]', output: '[11, 12, 22, 25, 34, 64, 90]' },
      { input: '[5, 4, 3, 2, 1]',               output: '[1, 2, 3, 4, 5]' },
    ],
    constraints: ['1 ≤ arr.length ≤ 10⁴', '-10⁴ ≤ arr[i] ≤ 10⁴', 'Must sort in ascending order'],
    hint: 'Compare adjacent elements and swap them if they are in the wrong order. Repeat until no swaps are needed.',
  },
  {
    id: 'ex-003',
    title: 'Binary Search',
    difficulty: 'Easy',
    category: 'Searching',
    completed: true,
    attempts: 1,
    xp: 120,
    description: 'Implement binary search to find a target value in a sorted array. Return the index, or -1 if not found.',
    starterCode: `def binary_search(nums: list[int], target: int) -> int:
    """
    Binary search implementation.
    Time Complexity: O(log n)
    
    Args:
        nums: Sorted list of integers
        target: Value to find
    
    Returns:
        Index of target, or -1 if not found
    """
    # Your solution here
    pass


print(binary_search([-1, 0, 3, 5, 9, 12], 9))   # Expected: 4
print(binary_search([-1, 0, 3, 5, 9, 12], 2))   # Expected: -1
`,
    solution: `def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    examples: [
      { input: '[-1, 0, 3, 5, 9, 12], target = 9', output: '4',  note: 'nums[4] = 9' },
      { input: '[-1, 0, 3, 5, 9, 12], target = 2', output: '-1', note: '2 does not exist' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', 'nums is sorted in ascending order', 'All values in nums are unique'],
    hint: 'Use two pointers (left and right) and repeatedly halve the search space by comparing the middle element to the target.',
  },
  {
    id: 'ex-004',
    title: 'Valid Parentheses',
    difficulty: 'Medium',
    category: 'Stacks',
    completed: false,
    attempts: 0,
    xp: 200,
    description: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.',
    starterCode: `def is_valid(s: str) -> bool:
    """
    Check if brackets are valid and balanced.
    
    Args:
        s: String containing bracket characters
    
    Returns:
        True if valid, False otherwise
    """
    # Your solution here
    pass


print(is_valid("()"))          # True
print(is_valid("()[]{}"))      # True
print(is_valid("(]"))          # False
print(is_valid("([)]"))        # False
print(is_valid("{[]}"))        # True
`,
    solution: `def is_valid(s):
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for c in s:
        if c in '({[':
            stack.append(c)
        elif stack and stack[-1] == pairs[c]:
            stack.pop()
        else:
            return False
    return len(stack) == 0`,
    examples: [
      { input: 's = "()"',      output: 'True' },
      { input: 's = "()[]{}"',  output: 'True' },
      { input: 's = "(]"',      output: 'False' },
      { input: 's = "([)]"',    output: 'False', note: 'brackets must close in the correct order' },
    ],
    constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of ( ) { } [ ] only'],
    hint: 'Use a stack. Push opening brackets, and when you see a closing bracket check if it matches the top of the stack.',
  },
]

export const MOCK_BADGES: Badge[] = [
  {
    id: 'b-001',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🚀',
    earned: true,
    earnedAt: '2024-01-16',
    rarity: 'common',
  },
  {
    id: 'b-002',
    name: 'Sort Savant',
    description: 'Complete all sorting algorithm lessons',
    icon: '↕️',
    earned: true,
    earnedAt: '2024-02-05',
    rarity: 'rare',
  },
  {
    id: 'b-003',
    name: 'Speed Coder',
    description: 'Solve 5 exercises in under 10 minutes each',
    icon: '⚡',
    earned: true,
    earnedAt: '2024-02-12',
    rarity: 'rare',
  },
  {
    id: 'b-004',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    earned: true,
    earnedAt: '2024-03-01',
    rarity: 'epic',
  },
  {
    id: 'b-005',
    name: 'Graph Guru',
    description: 'Complete the entire Graph Algorithms course',
    icon: '◈',
    earned: false,
    rarity: 'epic',
  },
  {
    id: 'b-006',
    name: 'DP Master',
    description: 'Solve 10 dynamic programming problems',
    icon: '🧠',
    earned: false,
    rarity: 'legendary',
  },
  {
    id: 'b-007',
    name: 'Century Club',
    description: 'Solve 100 problems',
    icon: '💯',
    earned: false,
    rarity: 'legendary',
  },
  {
    id: 'b-008',
    name: 'Bug Hunter',
    description: 'Find and fix 20 bugs in practice mode',
    icon: '🐛',
    earned: false,
    rarity: 'common',
  },
]

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    role: 'assistant',
    content: "Hey Alex! 👋 I'm your AI Mentor. I'm here to help you understand algorithms, debug code, and guide you through tricky concepts. What are you working on today?",
    timestamp: '10:00 AM',
    type: 'normal',
  },
  {
    id: 'm-2',
    role: 'user',
    content: "I'm working on bubble sort but I don't understand why the time complexity is O(n²).",
    timestamp: '10:02 AM',
    type: 'normal',
  },
  {
    id: 'm-3',
    role: 'assistant',
    content: "Great question! Let's break it down. In bubble sort, you have **two nested loops**: the outer loop runs `n` times, and the inner loop also runs up to `n` times for each outer iteration. That's `n × n = n²` comparisons in the worst case. Here's a quick mental model: imagine sorting a deck of 10 cards — you'd need to do up to 100 comparisons. For 100 cards? Up to 10,000 comparisons. The growth is quadratic!",
    timestamp: '10:02 AM',
    type: 'explanation',
  },
  {
    id: 'm-4',
    role: 'user',
    content: "Oh that makes sense! But my implementation keeps getting an IndexError...",
    timestamp: '10:05 AM',
    type: 'normal',
  },
  {
    id: 'm-5',
    role: 'assistant',
    content: "🔍 **IndexError detected!** This is very common in bubble sort. The fix is in your inner loop range. Change `range(n)` to `range(n - i - 1)`. Here's why: after each outer pass `i`, the last `i` elements are already in their final position — no need to check them again. Without this, you'll access `arr[j+1]` when `j = n-1`, which is out of bounds.",
    timestamp: '10:05 AM',
    type: 'error',
  },
]

export const RECENT_ACTIVITY = [
  { id: 1, action: 'Completed', target: 'Bubble Sort Visualization', xp: 80, time: '2h ago', icon: '✓' },
  { id: 2, action: 'Solved', target: 'Two Sum (Easy)', xp: 100, time: '5h ago', icon: '⚡' },
  { id: 3, action: 'Started', target: 'Graph Algorithms', xp: 0, time: '1d ago', icon: '→' },
  { id: 4, action: 'Earned badge', target: 'Week Warrior 🔥', xp: 200, time: '2d ago', icon: '🏅' },
]

export const LEADERBOARD = [
  { rank: 1, name: 'Sarah K.', xp: 8920, streak: 21, avatar: 'SK' },
  { rank: 2, name: 'Marcus J.', xp: 7650, streak: 14, avatar: 'MJ' },
  { rank: 3, name: 'Priya M.', xp: 6800, streak: 9, avatar: 'PM' },
  { rank: 4, name: 'Alex Chen', xp: 3240, streak: 7, avatar: 'AC', isCurrentUser: true },
  { rank: 5, name: 'David L.', xp: 2900, streak: 5, avatar: 'DL' },
]
