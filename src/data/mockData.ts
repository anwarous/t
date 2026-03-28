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
  testCases?: { call: string; expected: string }[]
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
    progress: 0,
    totalLessons: 12,
    completedLessons: 0,
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
          { id: 'l-1', title: 'What is Sorting?', type: 'video', duration: '8m', completed: false, locked: false, xp: 30 },
          { id: 'l-2', title: 'Time Complexity Basics', type: 'reading', duration: '12m', completed: false, locked: true, xp: 20 },
          { id: 'l-3', title: 'Comparison Operators', type: 'practice', duration: '15m', completed: false, locked: true, xp: 50 },
        ],
      },
      {
        id: 'ch-2',
        title: 'Elementary Sorting',
        lessons: [
          { id: 'l-4', title: 'Bubble Sort', type: 'video', duration: '10m', completed: false, locked: true, xp: 40 },
          { id: 'l-5', title: 'Bubble Sort Visualization', type: 'practice', duration: '20m', completed: false, locked: true, xp: 80 },
          { id: 'l-6', title: 'Selection Sort', type: 'video', duration: '9m', completed: false, locked: true, xp: 40 },
          { id: 'l-7', title: 'Insertion Sort', type: 'video', duration: '11m', completed: false, locked: true, xp: 40 },
          { id: 'l-8', title: 'Practice: Elementary Sorts', type: 'quiz', duration: '25m', completed: false, locked: true, xp: 100 },
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
    progress: 0,
    totalLessons: 15,
    completedLessons: 0,
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
          { id: 'g-l-1', title: 'Graph Representations', type: 'video', duration: '12m', completed: false, locked: false, xp: 40 },
          { id: 'g-l-2', title: 'Adjacency Matrix vs List', type: 'reading', duration: '10m', completed: false, locked: true, xp: 30 },
          { id: 'g-l-3', title: 'Types of Graphs', type: 'reading', duration: '8m', completed: false, locked: true, xp: 25 },
          { id: 'g-l-4', title: 'Graph Quiz', type: 'quiz', duration: '15m', completed: false, locked: true, xp: 70 },
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
      {
        id: 'g-ch-3',
        title: 'Shortest Paths',
        lessons: [
          { id: 'g-l-8', title: "Dijkstra's Algorithm", type: 'video', duration: '20m', completed: false, locked: true, xp: 80 },
          { id: 'g-l-9', title: 'Bellman-Ford Algorithm', type: 'reading', duration: '15m', completed: false, locked: true, xp: 50 },
          { id: 'g-l-10', title: 'Practice: Shortest Path', type: 'practice', duration: '40m', completed: false, locked: true, xp: 200 },
        ],
      },
      {
        id: 'g-ch-4',
        title: 'Advanced Graph Topics',
        lessons: [
          { id: 'g-l-11', title: 'Cycle Detection', type: 'video', duration: '12m', completed: false, locked: true, xp: 60 },
          { id: 'g-l-12', title: 'Topological Sort', type: 'reading', duration: '14m', completed: false, locked: true, xp: 55 },
          { id: 'g-l-13', title: "Kruskal's MST", type: 'video', duration: '18m', completed: false, locked: true, xp: 70 },
          { id: 'g-l-14', title: 'Practice: MST', type: 'practice', duration: '35m', completed: false, locked: true, xp: 150 },
          { id: 'g-l-15', title: 'Graph Algorithms Final', type: 'quiz', duration: '30m', completed: false, locked: true, xp: 250 },
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
    progress: 0,
    totalLessons: 18,
    completedLessons: 0,
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
          { id: 'dp-l-1', title: 'Intro to Dynamic Programming', type: 'video', duration: '20m', completed: false, locked: false, xp: 50 },
          { id: 'dp-l-2', title: 'Fibonacci with Memoization', type: 'practice', duration: '30m', completed: false, locked: true, xp: 100 },
          { id: 'dp-l-3', title: 'Top-down vs Bottom-up', type: 'reading', duration: '15m', completed: false, locked: true, xp: 40 },
        ],
      },
      {
        id: 'dp-ch-2',
        title: 'Classic DP Problems',
        lessons: [
          { id: 'dp-l-4', title: 'Climbing Stairs', type: 'practice', duration: '20m', completed: false, locked: true, xp: 80 },
          { id: 'dp-l-5', title: 'Coin Change Problem', type: 'video', duration: '22m', completed: false, locked: true, xp: 70 },
          { id: 'dp-l-6', title: '0/1 Knapsack', type: 'reading', duration: '18m', completed: false, locked: true, xp: 60 },
          { id: 'dp-l-7', title: 'Longest Common Subsequence', type: 'video', duration: '25m', completed: false, locked: true, xp: 90 },
          { id: 'dp-l-8', title: 'Practice: Classic DP', type: 'practice', duration: '50m', completed: false, locked: true, xp: 200 },
        ],
      },
      {
        id: 'dp-ch-3',
        title: 'Advanced DP Patterns',
        lessons: [
          { id: 'dp-l-9', title: 'DP on Trees', type: 'video', duration: '20m', completed: false, locked: true, xp: 80 },
          { id: 'dp-l-10', title: 'Bitmask DP', type: 'reading', duration: '25m', completed: false, locked: true, xp: 100 },
          { id: 'dp-l-11', title: 'Matrix Chain Multiplication', type: 'video', duration: '28m', completed: false, locked: true, xp: 110 },
          { id: 'dp-l-12', title: 'Edit Distance', type: 'practice', duration: '35m', completed: false, locked: true, xp: 150 },
          { id: 'dp-l-13', title: 'DP Final Challenge', type: 'quiz', duration: '45m', completed: false, locked: true, xp: 300 },
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
    progress: 0,
    totalLessons: 10,
    completedLessons: 0,
    duration: '3h 20m',
    xpReward: 600,
    color: '#10b981',
    icon: '◳',
    tags: ['Arrays', 'Trees', 'Stacks', 'Queues'],
    chapters: [
      {
        id: 'ds-ch-1',
        title: 'Linear Structures',
        lessons: [
          { id: 'ds-l-1', title: 'Arrays & Lists', type: 'video', duration: '12m', completed: false, locked: false, xp: 40 },
          { id: 'ds-l-2', title: 'Stacks', type: 'video', duration: '10m', completed: false, locked: true, xp: 40 },
          { id: 'ds-l-3', title: 'Queues & Deques', type: 'video', duration: '11m', completed: false, locked: true, xp: 40 },
          { id: 'ds-l-4', title: 'Linked Lists', type: 'reading', duration: '14m', completed: false, locked: true, xp: 50 },
          { id: 'ds-l-5', title: 'Practice: Linear Structures', type: 'practice', duration: '25m', completed: false, locked: true, xp: 100 },
        ],
      },
      {
        id: 'ds-ch-2',
        title: 'Trees & Heaps',
        lessons: [
          { id: 'ds-l-6', title: 'Binary Trees', type: 'video', duration: '15m', completed: false, locked: true, xp: 50 },
          { id: 'ds-l-7', title: 'Binary Search Trees', type: 'video', duration: '18m', completed: false, locked: true, xp: 60 },
          { id: 'ds-l-8', title: 'Heaps & Priority Queues', type: 'reading', duration: '16m', completed: false, locked: true, xp: 55 },
          { id: 'ds-l-9', title: 'Hash Tables', type: 'video', duration: '14m', completed: false, locked: true, xp: 50 },
          { id: 'ds-l-10', title: 'Data Structures Final', type: 'quiz', duration: '30m', completed: false, locked: true, xp: 200 },
        ],
      },
    ],
  },
  // ── New courses ─────────────────────────────────────────────────────────────
  {
    id: 'recursion',
    title: 'Recursion & Backtracking',
    description: 'Master the art of self-referential problem solving and learn to explore solution spaces efficiently.',
    category: 'Techniques',
    difficulty: 'Intermediate',
    progress: 0,
    totalLessons: 10,
    completedLessons: 0,
    duration: '4h 0m',
    xpReward: 900,
    color: '#ec4899',
    icon: '↺',
    tags: ['Recursion', 'Backtracking', 'Call Stack'],
    chapters: [
      {
        id: 'rec-ch-1',
        title: 'Recursion Fundamentals',
        lessons: [
          { id: 'rec-l-1', title: 'What is Recursion?', type: 'video', duration: '10m', completed: false, locked: false, xp: 40 },
          { id: 'rec-l-2', title: 'Base Cases & Induction', type: 'reading', duration: '12m', completed: false, locked: true, xp: 35 },
          { id: 'rec-l-3', title: 'Call Stack Visualization', type: 'practice', duration: '20m', completed: false, locked: true, xp: 80 },
          { id: 'rec-l-4', title: 'Recursion vs Iteration', type: 'quiz', duration: '15m', completed: false, locked: true, xp: 60 },
        ],
      },
      {
        id: 'rec-ch-2',
        title: 'Backtracking Patterns',
        lessons: [
          { id: 'rec-l-5', title: 'N-Queens Problem', type: 'video', duration: '22m', completed: false, locked: true, xp: 90 },
          { id: 'rec-l-6', title: 'Sudoku Solver', type: 'video', duration: '25m', completed: false, locked: true, xp: 100 },
          { id: 'rec-l-7', title: 'Permutations & Combinations', type: 'reading', duration: '18m', completed: false, locked: true, xp: 65 },
          { id: 'rec-l-8', title: 'Subset Generation', type: 'practice', duration: '30m', completed: false, locked: true, xp: 120 },
          { id: 'rec-l-9', title: 'Maze Solving', type: 'practice', duration: '35m', completed: false, locked: true, xp: 140 },
          { id: 'rec-l-10', title: 'Backtracking Final', type: 'quiz', duration: '30m', completed: false, locked: true, xp: 200 },
        ],
      },
    ],
  },
  {
    id: 'string-algorithms',
    title: 'String Algorithms',
    description: 'Pattern matching, substring search, and manipulation — essential skills for coding interviews.',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    progress: 0,
    totalLessons: 9,
    completedLessons: 0,
    duration: '3h 30m',
    xpReward: 850,
    color: '#06b6d4',
    icon: 'Aa',
    tags: ['Strings', 'Pattern Matching', 'KMP'],
    chapters: [
      {
        id: 'str-ch-1',
        title: 'String Basics',
        lessons: [
          { id: 'str-l-1', title: 'String Manipulation', type: 'video', duration: '10m', completed: false, locked: false, xp: 35 },
          { id: 'str-l-2', title: 'Sliding Window Technique', type: 'video', duration: '15m', completed: false, locked: true, xp: 60 },
          { id: 'str-l-3', title: 'Two Pointer on Strings', type: 'reading', duration: '12m', completed: false, locked: true, xp: 45 },
        ],
      },
      {
        id: 'str-ch-2',
        title: 'Pattern Matching',
        lessons: [
          { id: 'str-l-4', title: 'Naive Pattern Search', type: 'video', duration: '12m', completed: false, locked: true, xp: 50 },
          { id: 'str-l-5', title: 'KMP Algorithm', type: 'video', duration: '22m', completed: false, locked: true, xp: 90 },
          { id: 'str-l-6', title: 'Rabin-Karp Hashing', type: 'reading', duration: '16m', completed: false, locked: true, xp: 65 },
          { id: 'str-l-7', title: 'Practice: Pattern Matching', type: 'practice', duration: '35m', completed: false, locked: true, xp: 150 },
          { id: 'str-l-8', title: 'Anagram Detection', type: 'practice', duration: '25m', completed: false, locked: true, xp: 100 },
          { id: 'str-l-9', title: 'String Algorithms Final', type: 'quiz', duration: '25m', completed: false, locked: true, xp: 180 },
        ],
      },
    ],
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
    testCases: [
      { call: 'two_sum([2, 7, 11, 15], 9)',  expected: '[0, 1]' },
      { call: 'two_sum([3, 2, 4], 6)',        expected: '[1, 2]' },
      { call: 'two_sum([3, 3], 6)',            expected: '[0, 1]' },
    ],
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
    testCases: [
      { call: 'bubble_sort([64, 34, 25, 12, 22, 11, 90])', expected: '[11, 12, 22, 25, 34, 64, 90]' },
      { call: 'bubble_sort([5, 4, 3, 2, 1])',               expected: '[1, 2, 3, 4, 5]' },
      { call: 'bubble_sort([1])',                            expected: '[1]' },
    ],
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
    testCases: [
      { call: 'binary_search([-1, 0, 3, 5, 9, 12], 9)', expected: '4'  },
      { call: 'binary_search([-1, 0, 3, 5, 9, 12], 2)', expected: '-1' },
      { call: 'binary_search([5], 5)',                   expected: '0'  },
    ],
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
    testCases: [
      { call: 'is_valid("()")',     expected: 'True'  },
      { call: 'is_valid("()[]{}")', expected: 'True'  },
      { call: 'is_valid("(]")',     expected: 'False' },
      { call: 'is_valid("([)]")',   expected: 'False' },
    ],
  },
  // ── New exercises ─────────────────────────────────────────────────────────
  {
    id: 'ex-005',
    title: 'Reverse a String',
    difficulty: 'Easy',
    category: 'Strings',
    completed: false,
    attempts: 0,
    xp: 80,
    description: 'Write a function that reverses a string. The input string is given as an array of characters.',
    starterCode: `def reverse_string(s: str) -> str:
    """
    Reverse the given string.
    
    Args:
        s: Input string
    
    Returns:
        Reversed string
    """
    # Your solution here
    pass


print(reverse_string("hello"))    # Expected: "olleh"
print(reverse_string("Hannah"))   # Expected: "hannaH"
print(reverse_string(""))         # Expected: ""
`,
    solution: `def reverse_string(s):
    return s[::-1]`,
    examples: [
      { input: '"hello"',  output: '"olleh"' },
      { input: '"Hannah"', output: '"hannaH"' },
    ],
    constraints: ['0 ≤ s.length ≤ 10⁵', 's consists of printable ASCII characters'],
    hint: 'Python has a very elegant one-liner for this using slice notation.',
    testCases: [
      { call: "reverse_string('hello')",  expected: 'olleh'  },
      { call: "reverse_string('Hannah')", expected: 'hannaH' },
      { call: "reverse_string('')",       expected: ''       },
    ],
  },
  {
    id: 'ex-006',
    title: 'Palindrome Check',
    difficulty: 'Easy',
    category: 'Strings',
    completed: false,
    attempts: 0,
    xp: 90,
    description: 'Given a string s, return true if it is a palindrome (reads the same forward and backward), ignoring case and non-alphanumeric characters.',
    starterCode: `def is_palindrome(s: str) -> bool:
    """
    Check if the string is a palindrome.
    Ignore case and non-alphanumeric characters.
    
    Args:
        s: Input string
    
    Returns:
        True if palindrome, False otherwise
    """
    # Your solution here
    pass


print(is_palindrome("A man, a plan, a canal: Panama"))  # True
print(is_palindrome("race a car"))                       # False
print(is_palindrome("Was it a car or a cat I saw?"))    # True
`,
    solution: `def is_palindrome(s):
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]`,
    examples: [
      { input: '"A man, a plan, a canal: Panama"', output: 'True', note: '"amanaplanacanalpanama" is a palindrome' },
      { input: '"race a car"',                      output: 'False' },
    ],
    constraints: ['1 ≤ s.length ≤ 2 × 10⁵', 's consists only of printable ASCII characters'],
    hint: 'First clean the string (keep only alphanumeric, lowercase), then check if it equals its reverse.',
    testCases: [
      { call: "is_palindrome('A man, a plan, a canal: Panama')", expected: 'True'  },
      { call: "is_palindrome('race a car')",                     expected: 'False' },
      { call: "is_palindrome('Was it a car or a cat I saw?')",   expected: 'True'  },
    ],
  },
  {
    id: 'ex-007',
    title: 'FizzBuzz',
    difficulty: 'Easy',
    category: 'Basics',
    completed: false,
    attempts: 0,
    xp: 60,
    description: 'Given an integer n, return a list of strings from 1 to n. For multiples of 3 output "Fizz", for multiples of 5 output "Buzz", for multiples of both output "FizzBuzz", otherwise output the number.',
    starterCode: `def fizz_buzz(n: int) -> list[str]:
    """
    Classic FizzBuzz problem.
    
    Args:
        n: Upper bound (inclusive)
    
    Returns:
        List of strings
    """
    # Your solution here
    pass


print(fizz_buzz(15))
# Expected: ['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz']
`,
    solution: `def fizz_buzz(n):
    result = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    return result`,
    examples: [
      { input: 'n = 5',  output: '["1","2","Fizz","4","Buzz"]' },
      { input: 'n = 15', output: '["1",..."FizzBuzz"]' },
    ],
    constraints: ['1 ≤ n ≤ 10⁴'],
    hint: 'Check divisibility by 15 first (both 3 and 5), then by 3, then by 5.',
    testCases: [
      { call: 'fizz_buzz(5)',  expected: "['1', '2', 'Fizz', '4', 'Buzz']" },
      { call: 'fizz_buzz(3)',  expected: "['1', '2', 'Fizz']"              },
      { call: 'fizz_buzz(15)', expected: "['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz']" },
    ],
  },
  {
    id: 'ex-008',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    category: 'Arrays',
    completed: false,
    attempts: 0,
    xp: 220,
    description: "Given an integer array nums, find the subarray with the largest sum and return its sum. (Kadane's Algorithm)",
    starterCode: `def max_subarray(nums: list[int]) -> int:
    """
    Find the maximum sum subarray (Kadane's Algorithm).
    Time Complexity: O(n)
    
    Args:
        nums: List of integers (can be negative)
    
    Returns:
        Maximum subarray sum
    """
    # Your solution here
    pass


print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # Expected: 6
print(max_subarray([1]))                                  # Expected: 1
print(max_subarray([5, 4, -1, 7, 8]))                    # Expected: 23
`,
    solution: `def max_subarray(nums):
    max_sum = current_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum`,
    examples: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6', note: '[4,-1,2,1] has the largest sum = 6' },
      { input: '[5,4,-1,7,8]',             output: '23' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'],
    hint: "At each position, decide: is it better to extend the previous subarray or start fresh? That's Kadane's key insight.",
    testCases: [
      { call: 'max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4])', expected: '6'  },
      { call: 'max_subarray([5, 4, -1, 7, 8])',                 expected: '23' },
      { call: 'max_subarray([1])',                               expected: '1'  },
    ],
  },
  {
    id: 'ex-009',
    title: 'Count Duplicates',
    difficulty: 'Easy',
    category: 'Arrays',
    completed: false,
    attempts: 0,
    xp: 90,
    description: 'Given an integer array, return the count of elements that appear more than once.',
    starterCode: `def count_duplicates(nums: list[int]) -> int:
    """
    Count elements appearing more than once.
    
    Args:
        nums: List of integers
    
    Returns:
        Number of duplicate elements
    """
    # Your solution here
    pass


print(count_duplicates([1, 2, 3, 2, 4, 3]))  # Expected: 2  (2 and 3 appear twice)
print(count_duplicates([1, 1, 1, 1]))          # Expected: 1  (only 1 is duplicated)
print(count_duplicates([1, 2, 3]))             # Expected: 0
`,
    solution: `def count_duplicates(nums):
    from collections import Counter
    return sum(1 for count in Counter(nums).values() if count > 1)`,
    examples: [
      { input: '[1, 2, 3, 2, 4, 3]', output: '2' },
      { input: '[1, 1, 1, 1]',        output: '1' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', '-10⁴ ≤ nums[i] ≤ 10⁴'],
    hint: 'Use a Counter (hash map) to count occurrences, then count how many values exceed 1.',
    testCases: [
      { call: 'count_duplicates([1, 2, 3, 2, 4, 3])', expected: '2' },
      { call: 'count_duplicates([1, 1, 1, 1])',        expected: '1' },
      { call: 'count_duplicates([1, 2, 3])',            expected: '0' },
    ],
  },
  {
    id: 'ex-010',
    title: 'Fibonacci with Memoization',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    completed: false,
    attempts: 0,
    xp: 180,
    description: 'Implement the Fibonacci sequence using memoization (top-down DP) to achieve O(n) time complexity.',
    starterCode: `def fib(n: int, memo: dict = None) -> int:
    """
    Compute nth Fibonacci number using memoization.
    Time Complexity: O(n)
    Space Complexity: O(n)
    
    Args:
        n: Position in sequence (0-indexed)
        memo: Cache dictionary
    
    Returns:
        nth Fibonacci number
    """
    # Your solution here
    pass


print(fib(0))   # Expected: 0
print(fib(1))   # Expected: 1
print(fib(10))  # Expected: 55
print(fib(30))  # Expected: 832040
`,
    solution: `def fib(n, memo=None):
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]`,
    examples: [
      { input: 'n = 10', output: '55' },
      { input: 'n = 30', output: '832040' },
    ],
    constraints: ['0 ≤ n ≤ 40'],
    hint: 'Store already-computed results in a dictionary. Before computing fib(n), check if it\'s already in the cache.',
    testCases: [
      { call: 'fib(10)', expected: '55'     },
      { call: 'fib(0)',  expected: '0'      },
      { call: 'fib(1)',  expected: '1'      },
      { call: 'fib(30)', expected: '832040' },
    ],
  },
  {
    id: 'ex-011',
    title: 'Longest Common Prefix',
    difficulty: 'Easy',
    category: 'Strings',
    completed: false,
    attempts: 0,
    xp: 100,
    description: 'Write a function to find the longest common prefix string amongst an array of strings. Return an empty string if there is no common prefix.',
    starterCode: `def longest_common_prefix(strs: list[str]) -> str:
    """
    Find longest common prefix among all strings.
    
    Args:
        strs: List of strings
    
    Returns:
        Longest common prefix string
    """
    # Your solution here
    pass


print(longest_common_prefix(["flower","flow","flight"]))  # Expected: "fl"
print(longest_common_prefix(["dog","racecar","car"]))      # Expected: ""
print(longest_common_prefix(["abc"]))                      # Expected: "abc"
`,
    solution: `def longest_common_prefix(strs):
    if not strs:
        return ""
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix`,
    examples: [
      { input: '["flower","flow","flight"]', output: '"fl"' },
      { input: '["dog","racecar","car"]',    output: '""' },
    ],
    constraints: ['1 ≤ strs.length ≤ 200', '0 ≤ strs[i].length ≤ 200', 'strs[i] consists of lowercase English letters'],
    hint: 'Start with the first string as the prefix, then shorten it until all other strings start with it.',
    testCases: [
      { call: "longest_common_prefix(['flower', 'flow', 'flight'])",      expected: 'fl'    },
      { call: "longest_common_prefix(['dog', 'racecar', 'car'])",         expected: ''      },
      { call: "longest_common_prefix(['interview', 'inter', 'interact'])", expected: 'inter' },
    ],
  },
  {
    id: 'ex-012',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    completed: false,
    attempts: 0,
    xp: 130,
    description: 'You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    starterCode: `def climb_stairs(n: int) -> int:
    """
    Count distinct ways to climb n stairs (1 or 2 steps at a time).
    Time Complexity: O(n)
    Space Complexity: O(1)
    
    Args:
        n: Number of stairs
    
    Returns:
        Number of distinct ways
    """
    # Your solution here
    pass


print(climb_stairs(2))   # Expected: 2  (1+1, 2)
print(climb_stairs(3))   # Expected: 3  (1+1+1, 1+2, 2+1)
print(climb_stairs(10))  # Expected: 89
`,
    solution: `def climb_stairs(n):
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
    examples: [
      { input: 'n = 2', output: '2', note: '1 step + 1 step, or 2 steps' },
      { input: 'n = 3', output: '3', note: '1+1+1, 1+2, 2+1' },
    ],
    constraints: ['1 ≤ n ≤ 45'],
    hint: 'Notice that ways(n) = ways(n-1) + ways(n-2). This is just Fibonacci! Use two variables to track the last two values.',
    testCases: [
      { call: 'climb_stairs(2)', expected: '2' },
      { call: 'climb_stairs(3)', expected: '3' },
      { call: 'climb_stairs(5)', expected: '8' },
    ],
  },
  {
    id: 'ex-013',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    category: 'Linked Lists',
    completed: false,
    attempts: 0,
    xp: 140,
    description: 'Reverse a singly linked list represented as a Python list (for simplicity). Return the reversed list.',
    starterCode: `def reverse_list(head: list) -> list:
    """
    Reverse a list (simulating linked list reversal logic).
    
    Args:
        head: Input list
    
    Returns:
        Reversed list
    """
    # Implement iterative reversal using prev/current pointers
    # Do NOT use slicing or reversed()
    pass


print(reverse_list([1, 2, 3, 4, 5]))  # Expected: [5, 4, 3, 2, 1]
print(reverse_list([1, 2]))           # Expected: [2, 1]
print(reverse_list([]))               # Expected: []
`,
    solution: `def reverse_list(head):
    prev = []
    for val in head:
        prev.insert(0, val)
    return prev`,
    examples: [
      { input: '[1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]' },
      { input: '[1, 2]',           output: '[2, 1]' },
    ],
    constraints: ['0 ≤ list.length ≤ 5000', '-5000 ≤ node.val ≤ 5000'],
    hint: 'Think of three pointers: previous, current, next. Redirect each node\'s pointer to the previous node.',
    testCases: [
      { call: 'reverse_list([1, 2, 3, 4, 5])', expected: '[5, 4, 3, 2, 1]' },
      { call: 'reverse_list([1, 2])',           expected: '[2, 1]'          },
      { call: 'reverse_list([])',               expected: '[]'              },
    ],
  },
  {
    id: 'ex-014',
    title: 'Find Maximum Depth of Tree',
    difficulty: 'Easy',
    category: 'Trees',
    completed: false,
    attempts: 0,
    xp: 130,
    description: 'Given a binary tree represented as a nested list [val, left, right], find its maximum depth (number of nodes along the longest path from root to leaf).',
    starterCode: `def max_depth(root) -> int:
    """
    Find the maximum depth of a binary tree.
    Tree format: [value, left_subtree, right_subtree] or None for empty.
    
    Args:
        root: Root node as nested list
    
    Returns:
        Maximum depth
    """
    # Your solution here (hint: use recursion!)
    pass


# Tree: [3, [9, None, None], [20, [15, None, None], [7, None, None]]]
# Depth = 3
tree1 = [3, [9, None, None], [20, [15, None, None], [7, None, None]]]
print(max_depth(tree1))   # Expected: 3
print(max_depth(None))    # Expected: 0
print(max_depth([1, None, [2, None, None]]))  # Expected: 2
`,
    solution: `def max_depth(root):
    if root is None:
        return 0
    val, left, right = root[0], root[1], root[2]
    return 1 + max(max_depth(left), max_depth(right))`,
    examples: [
      { input: '[3,[9,None,None],[20,[15,None,None],[7,None,None]]]', output: '3' },
      { input: 'None', output: '0' },
    ],
    constraints: ['0 ≤ number of nodes ≤ 10⁴', '-100 ≤ Node.val ≤ 100'],
    hint: 'The depth of a tree = 1 + max(depth of left subtree, depth of right subtree). Base case: None returns 0.',
    testCases: [
      { call: 'max_depth([3, [9, None, None], [20, [15, None, None], [7, None, None]]])', expected: '3' },
      { call: 'max_depth(None)',                                                          expected: '0' },
      { call: 'max_depth([1, None, None])',                                               expected: '1' },
    ],
  },
  {
    id: 'ex-015',
    title: 'Merge Two Sorted Arrays',
    difficulty: 'Easy',
    category: 'Arrays',
    completed: false,
    attempts: 0,
    xp: 110,
    description: 'Given two sorted arrays nums1 and nums2, merge them into a single sorted array and return it.',
    starterCode: `def merge_sorted(nums1: list[int], nums2: list[int]) -> list[int]:
    """
    Merge two sorted arrays into one sorted array.
    Time Complexity: O(n + m)
    
    Args:
        nums1: First sorted array
        nums2: Second sorted array
    
    Returns:
        Merged sorted array
    """
    # Your solution here
    pass


print(merge_sorted([1, 3, 5], [2, 4, 6]))     # Expected: [1, 2, 3, 4, 5, 6]
print(merge_sorted([1, 2, 3], []))             # Expected: [1, 2, 3]
print(merge_sorted([], [1]))                   # Expected: [1]
`,
    solution: `def merge_sorted(nums1, nums2):
    result = []
    i = j = 0
    while i < len(nums1) and j < len(nums2):
        if nums1[i] <= nums2[j]:
            result.append(nums1[i]); i += 1
        else:
            result.append(nums2[j]); j += 1
    result.extend(nums1[i:])
    result.extend(nums2[j:])
    return result`,
    examples: [
      { input: '[1,3,5], [2,4,6]', output: '[1,2,3,4,5,6]' },
      { input: '[1,2,3], []',      output: '[1,2,3]' },
    ],
    constraints: ['0 ≤ nums1.length, nums2.length ≤ 10⁴', '-10⁴ ≤ values ≤ 10⁴'],
    hint: 'Use two pointers i and j, picking the smaller element from each array at each step.',
    testCases: [
      { call: 'merge_sorted([1, 3, 5], [2, 4, 6])', expected: '[1, 2, 3, 4, 5, 6]' },
      { call: 'merge_sorted([1, 2, 3], [])',         expected: '[1, 2, 3]'          },
      { call: 'merge_sorted([], [1])',               expected: '[1]'                },
    ],
  },
  {
    id: 'ex-016',
    title: 'Coin Change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    completed: false,
    attempts: 0,
    xp: 250,
    description: 'Given an array of coin denominations and an amount, return the fewest number of coins needed to make up the amount. Return -1 if not possible.',
    starterCode: `def coin_change(coins: list[int], amount: int) -> int:
    """
    Find minimum coins to make up the amount (bottom-up DP).
    Time Complexity: O(amount × len(coins))
    
    Args:
        coins: Available coin denominations
        amount: Target amount
    
    Returns:
        Minimum coins needed, or -1 if impossible
    """
    # Your solution here
    pass


print(coin_change([1, 5, 10, 25], 41))  # Expected: 4  (25+10+5+1)
print(coin_change([2], 3))              # Expected: -1
print(coin_change([1, 2, 5], 11))       # Expected: 3  (5+5+1)
`,
    solution: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
    examples: [
      { input: 'coins = [1,5,10,25], amount = 41', output: '4', note: '25+10+5+1' },
      { input: 'coins = [2], amount = 3',           output: '-1' },
    ],
    constraints: ['1 ≤ coins.length ≤ 12', '1 ≤ coins[i] ≤ 2³¹ − 1', '0 ≤ amount ≤ 10⁴'],
    hint: 'Build a DP table where dp[i] = minimum coins for amount i. For each amount, try all coins and take the minimum.',
    testCases: [
      { call: 'coin_change([1, 5, 10, 25], 41)', expected: '4'  },
      { call: 'coin_change([2], 3)',              expected: '-1' },
      { call: 'coin_change([1, 2, 5], 11)',       expected: '3'  },
    ],
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
  {
    id: 'b-009',
    name: 'String Wizard',
    description: 'Solve 5 string manipulation problems',
    icon: '🔤',
    earned: false,
    rarity: 'rare',
  },
  {
    id: 'b-010',
    name: 'Recursion Ninja',
    description: 'Complete the Recursion & Backtracking course',
    icon: '🥷',
    earned: false,
    rarity: 'epic',
  },
  {
    id: 'b-011',
    name: 'Polyglot',
    description: 'Submit solutions in both Python and pseudocode',
    icon: '🌍',
    earned: false,
    rarity: 'rare',
  },
  {
    id: 'b-012',
    name: 'Iron Coder',
    description: 'Maintain a 30-day learning streak',
    icon: '⚔️',
    earned: false,
    rarity: 'legendary',
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

export interface LeaderboardEntry {
  name: string
  xp: number
  streak: number
  avatar: string
  isCurrentUser?: boolean
  rank?: number
}

export const LEADERBOARD_OTHERS: LeaderboardEntry[] = [
  { name: 'Sarah K.', xp: 8920, streak: 21, avatar: 'SK' },
  { name: 'Marcus J.', xp: 7650, streak: 14, avatar: 'MJ' },
  { name: 'Priya M.', xp: 6800, streak: 9, avatar: 'PM' },
  { name: 'David L.', xp: 2900, streak: 5, avatar: 'DL' },
]
