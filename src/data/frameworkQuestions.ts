import { CodingQuestion } from '../types';

export const reactQuestions: CodingQuestion[] = [
  {
    id: 'react-1',
    subject: 'javascript',
    difficulty: 'basic',
    question: 'Create a React component that displays a counter with increment and decrement buttons.',
    options: [],
    correctAnswer: 0,
    explanation: 'This challenge teaches React state management with useState hook and event handling.',
    xpReward: 100,
    coinReward: 20,
    hint: 'Use useState hook to manage the counter state and create onClick handlers for the buttons.',
    language: 'javascript',
    codeTemplate: `import React, { useState } from 'react';

function Counter() {
  // Add your state here
  
  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Counter</h2>
      {/* Add your counter display and buttons here */}
    </div>
  );
}

export default Counter;`,
    expectedOutput: 'A counter component with increment and decrement functionality',
    testCases: [
      { input: 'useState', expectedOutput: 'Found', description: 'Uses useState hook' },
      { input: 'onClick', expectedOutput: 'Found', description: 'Has click handlers' }
    ]
  },
  {
    id: 'react-2',
    subject: 'javascript',
    difficulty: 'intermediate',
    question: 'Build a Todo List component with add, delete, and toggle completion functionality.',
    options: [],
    correctAnswer: 0,
    explanation: 'This challenge covers state management, array manipulation, and conditional rendering in React.',
    xpReward: 150,
    coinReward: 30,
    hint: 'Use useState for todos array, map for rendering, and filter for deletion.',
    language: 'javascript',
    codeTemplate: `import React, { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Add your functions here
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Todo List</h2>
      {/* Add your input and todo list here */}
    </div>
  );
}

export default TodoList;`,
    expectedOutput: 'A functional todo list with add, delete, and toggle features'
  }
];

export const angularQuestions: CodingQuestion[] = [
  {
    id: 'angular-1',
    subject: 'javascript',
    difficulty: 'basic',
    question: 'Create an Angular component that displays a list of users with their names and emails.',
    options: [],
    correctAnswer: 0,
    explanation: 'This challenge teaches Angular component structure, data binding, and *ngFor directive.',
    xpReward: 100,
    coinReward: 20,
    hint: 'Use @Component decorator, define users array in component class, and use *ngFor in template.',
    language: 'typescript',
    codeTemplate: `import { Component } from '@angular/core';

@Component({
  selector: 'app-user-list',
  template: \`
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">User List</h2>
      <!-- Add your user list here -->
    </div>
  \`,
  styles: [\`
    :host {
      display: block;
    }
  \`]
})
export class UserListComponent {
  // Add your users array here
  
}`,
    expectedOutput: 'A component displaying a list of users with names and emails'
  },
  {
    id: 'angular-2',
    subject: 'javascript',
    difficulty: 'intermediate',
    question: 'Build an Angular form component with validation for name, email, and phone number.',
    options: [],
    correctAnswer: 0,
    explanation: 'This challenge covers Angular reactive forms, form validation, and error handling.',
    xpReward: 150,
    coinReward: 30,
    hint: 'Use FormBuilder, Validators, and reactive form patterns with proper error display.',
    language: 'typescript',
    codeTemplate: `import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  template: \`
    <div class="p-4 max-w-md mx-auto">
      <h2 class="text-2xl font-bold mb-4">User Form</h2>
      <!-- Add your form here -->
    </div>
  \`
})
export class UserFormComponent {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize your form here
  }

  onSubmit() {
    // Handle form submission
  }
}`,
    expectedOutput: 'A validated form with name, email, and phone fields'
  }
];

export const vueQuestions: CodingQuestion[] = [
  {
    id: 'vue-1',
    subject: 'javascript',
    difficulty: 'basic',
    question: 'Create a Vue component that displays a shopping cart with items and total price calculation.',
    options: [],
    correctAnswer: 0,
    explanation: 'This challenge teaches Vue data binding, computed properties, and event handling.',
    xpReward: 100,
    coinReward: 20,
    hint: 'Use data() for cart items, computed for total calculation, and methods for cart operations.',
    language: 'javascript',
    codeTemplate: `<template>
  <div class="p-4 max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Shopping Cart</h2>
    <!-- Add your cart items and total here -->
  </div>
</template>

<script>
export default {
  name: 'ShoppingCart',
  data() {
    return {
      // Add your cart items here
    }
  },
  computed: {
    // Add computed properties here
  },
  methods: {
    // Add methods here
  }
}
</script>`,
    expectedOutput: 'A shopping cart component with items and total price calculation'
  },
  {
    id: 'vue-2',
    subject: 'javascript',
    difficulty: 'intermediate',
    question: 'Build a Vue component with search functionality that filters a list of products.',
    options: [],
    correctAnswer: 0,
    explanation: 'This challenge covers Vue computed properties, watchers, and dynamic filtering.',
    xpReward: 150,
    coinReward: 30,
    hint: 'Use v-model for search input, computed property for filtered results, and v-for for rendering.',
    language: 'javascript',
    codeTemplate: `<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Product Search</h2>
    <!-- Add search input and product list here -->
  </div>
</template>

<script>
export default {
  name: 'ProductSearch',
  data() {
    return {
      searchQuery: '',
      products: [
        { id: 1, name: 'Laptop', category: 'Electronics', price: 999 },
        { id: 2, name: 'Phone', category: 'Electronics', price: 599 },
        { id: 3, name: 'Book', category: 'Education', price: 29 }
      ]
    }
  },
  computed: {
    // Add filtered products computed property
  }
}
</script>`,
    expectedOutput: 'A product search component with real-time filtering'
  }
];

export const reactNativeQuestions: CodingQuestion[] = [
  {
    id: 'rn-1',
    subject: 'javascript',
    difficulty: 'basic',
    question: 'Create a React Native screen with a profile card showing user avatar, name, and bio.',
    options: [],
    correctAnswer: 0,
    explanation: 'This challenge teaches React Native core components, styling, and layout.',
    xpReward: 100,
    coinReward: 20,
    hint: 'Use View, Text, Image components with StyleSheet for styling and flexbox for layout.',
    language: 'javascript',
    codeTemplate: `import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView
} from 'react-native';

const ProfileScreen = () => {
  const user = {
    name: 'John Doe',
    bio: 'Software Developer passionate about mobile apps',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Add your profile card here */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Add your styles here
});

export default ProfileScreen;`,
    expectedOutput: 'A profile screen with user avatar, name, and bio'
  },
  {
    id: 'rn-2',
    subject: 'javascript',
    difficulty: 'intermediate',
    question: 'Build a React Native contact list with search functionality and navigation.',
    options: [],
    correctAnswer: 0,
    explanation: 'This challenge covers FlatList, TextInput, state management, and navigation in React Native.',
    xpReward: 150,
    coinReward: 30,
    hint: 'Use FlatList for contacts, TextInput for search, useState for filtering, and TouchableOpacity for navigation.',
    language: 'javascript',
    codeTemplate: `import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';

const ContactList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts] = useState([
    { id: '1', name: 'Alice Johnson', phone: '+1 234 567 8901' },
    { id: '2', name: 'Bob Smith', phone: '+1 234 567 8902' },
    { id: '3', name: 'Carol Davis', phone: '+1 234 567 8903' }
  ]);

  // Add your filtering logic here

  const renderContact = ({ item }) => (
    // Add contact item component here
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Add search input and contact list here */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Add your styles here
});

export default ContactList;`,
    expectedOutput: 'A contact list with search functionality and touch interactions'
  }
];

export const allFrameworkQuestions = [
  ...reactQuestions,
  ...angularQuestions,
  ...vueQuestions,
  ...reactNativeQuestions
];