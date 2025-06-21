import { CodingQuestion } from '../types';

export const tailwindQuestions: CodingQuestion[] = [
  {
    id: 'tw-1',
    subject: 'html',
    difficulty: 'basic',
    question: 'Create a responsive card component using Tailwind CSS with a title, description, and button.',
    options: [], // Not used for coding questions
    correctAnswer: 0, // Not used for coding questions
    explanation: 'This challenge teaches basic Tailwind CSS utility classes for creating responsive card layouts.',
    xpReward: 75,
    coinReward: 15,
    hint: 'Use classes like bg-white, shadow-lg, rounded-lg, p-6 for the card container, and text-xl, font-bold for the title.',
    language: 'html',
    codeTemplate: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tailwind Card Challenge</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
    <!-- Create your card component here -->
    <div class="max-w-md">
        <!-- Your card content goes here -->
    </div>
</body>
</html>`,
    expectedOutput: 'A responsive card with proper spacing, shadows, and typography',
    testCases: []
  },
  {
    id: 'tw-2',
    subject: 'html',
    difficulty: 'intermediate',
    question: 'Build a responsive navigation bar with a logo, menu items, and a mobile hamburger menu using Tailwind CSS.',
    options: [],
    correctAnswer: 0,
    explanation: 'This challenge covers responsive design patterns, flexbox utilities, and mobile-first approach in Tailwind.',
    xpReward: 100,
    coinReward: 20,
    hint: 'Use flex, justify-between, items-center for the navbar layout. Use hidden md:flex for desktop menu and md:hidden for mobile menu.',
    language: 'html',
    codeTemplate: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Navbar</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <!-- Create your responsive navbar here -->
    <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4">
            <!-- Your navbar content goes here -->
        </div>
    </nav>
    
    <!-- Sample content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-800">Welcome to our site!</h1>
        <p class="text-gray-600 mt-4">This is sample content below the navbar.</p>
    </main>
</body>
</html>`,
    expectedOutput: 'A responsive navigation bar that adapts to different screen sizes',
    testCases: []
  },
  {
    id: 'tw-3',
    subject: 'css',
    difficulty: 'intermediate',
    question: 'Create custom component classes using Tailwind\'s @apply directive for a button system.',
    options: [],
    correctAnswer: 0,
    explanation: 'This teaches how to create reusable component classes using @apply directive while maintaining Tailwind\'s utility-first approach.',
    xpReward: 100,
    coinReward: 20,
    hint: 'Use @layer components to define your custom classes, then use @apply to combine Tailwind utilities.',
    language: 'css',
    codeTemplate: `/* Tailwind CSS Custom Components */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Create your custom button components here using @apply */
@layer components {
  .btn-base {
    /* Apply base button styles here */
  }
  
  .btn-primary {
    /* Apply primary button styles here */
  }
  
  .btn-secondary {
    /* Apply secondary button styles here */
  }
  
  .btn-danger {
    /* Apply danger button styles here */
  }
}`,
    expectedOutput: 'Custom button components that can be reused across the project',
    testCases: []
  },
  {
    id: 'tw-4',
    subject: 'html',
    difficulty: 'advanced',
    question: 'Create a complex dashboard layout with sidebar, header, and main content area using Tailwind CSS Grid and Flexbox.',
    options: [],
    correctAnswer: 0,
    explanation: 'This advanced challenge combines CSS Grid and Flexbox utilities to create a professional dashboard layout.',
    xpReward: 150,
    coinReward: 30,
    hint: 'Use grid-cols-[250px_1fr] for the main layout, and combine with flexbox for internal component layouts.',
    language: 'html',
    codeTemplate: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Layout</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 h-screen">
    <!-- Create your dashboard layout here -->
    <div class="h-full">
        <!-- Your layout structure goes here -->
        <!-- Sidebar, Header, Main Content -->
    </div>
</body>
</html>`,
    expectedOutput: 'A professional dashboard layout with proper spacing and responsive behavior',
    testCases: []
  },
  {
    id: 'tw-5',
    subject: 'javascript',
    difficulty: 'intermediate',
    question: 'Create a dynamic theme switcher that toggles Tailwind CSS classes for dark/light mode.',
    options: [],
    correctAnswer: 0,
    explanation: 'This challenge teaches how to dynamically manipulate Tailwind classes with JavaScript for interactive features.',
    xpReward: 125,
    coinReward: 25,
    hint: 'Use classList.toggle() to switch between dark and light theme classes. Target the html or body element for global theme changes.',
    language: 'javascript',
    codeTemplate: `// Dynamic Theme Switcher with Tailwind CSS
document.addEventListener('DOMContentLoaded', function() {
    // Get theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the current theme
    if (currentTheme === 'dark') {
        // Add dark mode classes
    }
    
    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            // Toggle between light and dark themes
            // Update localStorage
            // Apply appropriate Tailwind classes
        });
    }
    
    // Update button text/icon based on current theme
    function updateThemeToggleButton() {
        // Update button appearance
    }
});`,
    expectedOutput: 'A working theme switcher that persists user preference',
    testCases: []
  }
];