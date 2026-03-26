export const categories = [
  { id: 'html', name: 'HTML', icon: '🌐', description: 'Structure of the Web' },
  { id: 'css', name: 'CSS', icon: '🎨', description: 'Styling and Design' },
  { id: 'js', name: 'JavaScript', icon: '⚡', description: 'Logic and Interactivity' },
  { id: 'python', name: 'Python', icon: '🐍', description: 'Versatile Programming' },
  { id: 'software', name: 'Software Practices', icon: '🛠️', description: 'Clean Code & Patterns' },
  { id: 'agile', name: 'Agile Methods', icon: '🔄', description: 'Scrum & Kanban' },
];

export const topicsByCategory = {
  html: [
    { id: 'basics', name: 'Basics', description: 'Fundamental HTML tags and capabilities' },
    { id: 'forms', name: 'Forms', description: 'Inputs, validations, and user data' },
    { id: 'seo', name: 'SEO', description: 'Semantic HTML and accessibility' },
  ],
  css: [
    { id: 'selectors', name: 'Selectors', description: 'Classes, IDs, and attributes' },
    { id: 'flexbox', name: 'Flexbox', description: 'Modern layout modules' },
  ],
  js: [
    { id: 'syntax', name: 'Syntax', description: 'Variables, loops, and conditions' },
    { id: 'dom', name: 'DOM', description: 'Document Object Model manipulation' },
  ],
  python: [
    { id: 'basics', name: 'Basics', description: 'Syntax, Variables, and Data Types' },
    { id: 'oop', name: 'OOP', description: 'Classes and Objects' },
  ],
  software: [
    { id: 'clean_code', name: 'Clean Code', description: 'Writing maintainable code' },
    { id: 'design_patterns', name: 'Design Patterns', description: 'Reusable solutions' },
  ],
  agile: [
    { id: 'scrum', name: 'Scrum', description: 'Framework for developing complex products' },
    { id: 'kanban', name: 'Kanban', description: 'Visualizing work and managing flow' },
  ],
};
