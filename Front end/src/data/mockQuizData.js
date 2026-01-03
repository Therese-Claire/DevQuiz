export const categories = [
  { id: 'html', name: 'HTML', icon: '🌐', description: 'Structure of the Web' },
  { id: 'css', name: 'CSS', icon: '🎨', description: 'Styling and Design' },
  { id: 'js', name: 'JavaScript', icon: '⚡', description: 'Logic and Interactivity' },
  { id: 'python', name: 'Python', icon: '🐍', description: 'Versatile Programming' },
  { id: 'software', name: 'Software Practices', icon: '🛠️', description: 'Clean Code & Patterns' },
  { id: 'agile', name: 'Agile Methods', icon: '🔄', description: 'Scrum & Kanban' },
];

export const quizData = {
  html: {
    topics: [
      { id: 'basics', name: 'Basics', description: 'Fundamental HTML tags and capabilities' },
      { id: 'forms', name: 'Forms', description: 'Inputs, validations, and user data' },
      { id: 'seo', name: 'SEO', description: 'Semantic HTML and accessibility' }
    ],
    questions: {
      basics: [
        { id: 1, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Tech Markup Language"], correctAnswer: "Hyper Text Markup Language" },
        { id: 2, question: "Choose the correct HTML element for the largest heading:", options: ["<h6>", "<heading>", "<h1>", "<head>"], correctAnswer: "<h1>" },
        { id: 3, question: "Which character is used to indicate an end tag?", options: ["*", "/", "<", "^"], correctAnswer: "/" },
        { id: 4, question: "What is the correct element for inserting a line break?", options: ["<br>", "<lb>", "<break>", "<newline>"], correctAnswer: "<br>" },
        { id: 5, question: "Which element wraps the metadata of an HTML document?", options: ["<body>", "<head>", "<meta>", "<title>"], correctAnswer: "<head>" },
        { id: 6, question: "Which tag is used to define an unordered list?", options: ["<ul>", "<ol>", "<li>", "<list>"], correctAnswer: "<ul>" },
        { id: 7, question: "Which attribute is used to provide an alternate text for an image?", options: ["alt", "title", "src", "href"], correctAnswer: "alt" },
        { id: 8, question: "How do you create a hyperlink?", options: ["<a url='...'>", "<a href='...'>", "<link src='...'>", "<a>"], correctAnswer: "<a href='...'>" },
        { id: 9, question: "Which tag is used to emphasize text?", options: ["<i>", "<em>", "<bold>", "<sl>"], correctAnswer: "<em>" },
        { id: 10, question: "What is the correct HTML for making a checkbox?", options: ["<check>", "<checkbox>", "<input type='check'>", "<input type='checkbox'>"], correctAnswer: "<input type='checkbox'>" }
      ],
      forms: [
        { id: 1, question: "Which input type defines a slider control?", options: ["slider", "range", "controls", "search"], correctAnswer: "range" },
        { id: 2, question: "Which element is used to group related data in a form?", options: ["<fieldset>", "<group>", "<section>", "<div>"], correctAnswer: "<fieldset>" },
        { id: 3, question: "Which attribute specifies a hint that describes the expected value of an input field?", options: ["value", "placeholder", "hint", "desc"], correctAnswer: "placeholder" },
        { id: 4, question: "Which input type defines a date picker?", options: ["date", "datetime", "calendar", "picker"], correctAnswer: "date" },
        { id: 5, question: "How can you make a list of options for an input field?", options: ["<datalist>", "<select>", "<list>", "<dropdown>"], correctAnswer: "<datalist>" },
        { id: 6, question: "Which attribute forces a user to fill out a field?", options: ["validate", "required", "mandatory", "need"], correctAnswer: "required" },
        { id: 7, question: "Which input type is used for passwords?", options: ["secure", "password", "hidden", "text"], correctAnswer: "password" },
        { id: 8, question: "What element is used to create a drop-down list?", options: ["<input type='dropdown'>", "<list>", "<select>", "<option>"], correctAnswer: "<select>" },
        { id: 9, question: "Which attribute disables an input field?", options: ["block", "disabled", "readonly", "stop"], correctAnswer: "disabled" },
        { id: 10, question: "Which element defines a caption for a <fieldset>?", options: ["<caption>", "<legend>", "<title>", "<label>"], correctAnswer: "<legend>" }
      ],
      seo: [
        { id: 1, question: "Which element is used to specify a header for a document or section?", options: ["<top>", "<head>", "<header>", "<section>"], correctAnswer: "<header>" },
        { id: 2, question: "Which tag is best for independent, self-contained content?", options: ["<section>", "<article>", "<div>", "<details>"], correctAnswer: "<article>" },
        { id: 3, question: "Which element creates a thematic break?", options: ["<br>", "<hr>", "<break>", "<line>"], correctAnswer: "<hr>" },
        { id: 4, question: "What is the purpose of the <main> element?", options: ["Main content of document", "Main menu", "Main header", "Main footer"], correctAnswer: "Main content of document" },
        { id: 5, question: "Which input attribute is crucial for screen readers on images?", options: ["src", "alt", "title", "id"], correctAnswer: "alt" },
        { id: 6, question: "Which element represents navigation links?", options: ["<nav>", "<links>", "<menu>", "<ul>"], correctAnswer: "<nav>" },
        { id: 7, question: "Which tag is used for the footer of a document or section?", options: ["<bottom>", "<footer>", "<end>", "<section>"], correctAnswer: "<footer>" },
        { id: 8, question: "Which element creates a figure caption?", options: ["<caption>", "<title>", "<figcaption>", "<legend>"], correctAnswer: "<figcaption>" },
        { id: 9, question: "Which tag is used to highlight text for reference purposes?", options: ["<mark>", "<strong>", "<em>", "<highlight>"], correctAnswer: "<mark>" },
        { id: 10, question: "Does <div class='header'> have semantic meaning?", options: ["Yes", "No", "Depends on CSS", "Only in HTML4"], correctAnswer: "No" }
      ]
    }
  },
  css: {
    topics: [
      { id: 'selectors', name: 'Selectors', description: 'Classes, IDs, and attributes' },
      { id: 'flexbox', name: 'Flexbox', description: 'Modern layout modules' }
    ],
    questions: {
      selectors: [
        { id: 1, question: "Which character is used to indicate an ID selector?", options: [".", "#", "*", "&"], correctAnswer: "#" },
        { id: 2, question: "Which character is used to indicate a class selector?", options: [".", "#", "*", "&"], correctAnswer: "." },
        { id: 3, question: "Which selector selects all elements?", options: ["all", "*", "root", "body"], correctAnswer: "*" },
        { id: 4, question: "How do you select elements with attribute type='text'?", options: ["input.text", "input[type='text']", "input(type='text')", "input:text"], correctAnswer: "input[type='text']" },
        { id: 5, question: "Which selector matches direct children?", options: [">", "+", "~", " "], correctAnswer: ">" },
        { id: 6, question: "Which pseudo-class selects the first child?", options: [":first", ":child-1", ":first-child", ":one"], correctAnswer: ":first-child" },
        { id: 7, question: "What does ':hover' do?", options: ["Selects active link", "Selects visited link", "Selects element on mouse over", "Selects focused element"], correctAnswer: "Selects element on mouse over" },
        { id: 8, question: "Which specificity is highest?", options: ["ID", "Class", "Element", "Universal"], correctAnswer: "ID" },
        { id: 9, question: "How do you group multiple selectors?", options: ["Space", "Comma", "Plus", "Hyphen"], correctAnswer: "Comma" },
        { id: 10, question: "Which pseudo-element inserts content before an element?", options: ["::before", "::after", "::start", "::first"], correctAnswer: "::before" }
      ],
      flexbox: [
        { id: 1, question: "Which property is used to define a flex container?", options: ["display: flex", "position: flex", "flex: true", "display: box"], correctAnswer: "display: flex" },
        { id: 2, question: "Which property controls the main axis alignment?", options: ["align-items", "justify-content", "align-content", "flex-align"], correctAnswer: "justify-content" },
        { id: 3, question: "Which property controls the cross axis alignment?", options: ["align-items", "justify-content", "text-align", "vertical-align"], correctAnswer: "align-items" },
        { id: 4, question: "What is the default value of flex-direction?", options: ["column", "row", "row-reverse", "column-reverse"], correctAnswer: "row" },
        { id: 5, question: "Which property allows flex items to wrap?", options: ["flex-wrap", "white-space", "overflow", "word-wrap"], correctAnswer: "flex-wrap" },
        { id: 6, question: "What does 'flex-grow: 1' do?", options: ["Shrinks the item", "Allows item to grow to fill space", "Fixes width", "Removes visual size"], correctAnswer: "Allows item to grow to fill space" },
        { id: 7, question: "Which property is a shorthand for flex-grow, flex-shrink, flex-basis?", options: ["flex", "flex-flow", "flex-group", "flex-all"], correctAnswer: "flex" },
        { id: 8, question: "how to center content perfectly in flex?", options: ["justify-center & align-center", "text-align: center", "margin: auto", "float: center"], correctAnswer: "justify-center & align-center" }, // Note: align-items: center is the real CSS but keeping simple text for option
        { id: 9, question: "What is the default flex-shrink value?", options: ["0", "1", "auto", "none"], correctAnswer: "1" },
        { id: 10, question: "Which property aligns multiple lines of flex items?", options: ["align-content", "line-height", "wrap-align", "justify-lines"], correctAnswer: "align-content" }
      ]
    }
  },
  js: {
    topics: [
      { id: 'syntax', name: 'Syntax', description: 'Variables, loops, and conditions' },
      { id: 'dom', name: 'DOM', description: 'Document Object Model manipulation' }
    ],
    questions: {
      syntax: [
        { id: 1, question: "How do you declare a JavaScript variable?", options: ["v carName;", "variable carName;", "var carName;", "val carName;"], correctAnswer: "var carName;" },
        { id: 2, question: "Which operator is used to assign a value?", options: ["*", "=", "-", "x"], correctAnswer: "=" },
        { id: 3, question: "What is the correct way to write an array?", options: ["(1, 2, 3)", "{1, 2, 3}", "[1, 2, 3]", "<1, 2, 3>"], correctAnswer: "[1, 2, 3]" },
        { id: 4, question: "How do you check if 'a' is equal to 'b' (value & type)?", options: ["a == b", "a === b", "a = b", "a equals b"], correctAnswer: "a === b" },
        { id: 5, question: "Which keyword breaks a loop?", options: ["stop", "break", "exit", "return"], correctAnswer: "break" },
        { id: 6, question: "How to write an IF statement?", options: ["if i == 5 then", "if (i == 5)", "if i = 5 then", "if i == 5"], correctAnswer: "if (i == 5)" },
        { id: 7, question: "Which loop runs at least once?", options: ["for", "while", "do...while", "foreach"], correctAnswer: "do...while" },
        { id: 8, question: "How do you write a comment?", options: ["<!-- -->", "//", "**", "#"], correctAnswer: "//" },
        { id: 9, question: "What is NaN?", options: ["Not a Number", "Null and Null", "New and New", "None a None"], correctAnswer: "Not a Number" },
        { id: 10, question: "Which function parses a string to an integer?", options: ["Integer.parse()", "parseInt()", "parseInteger()", "toInt()"], correctAnswer: "parseInt()" }
      ],
      dom: [
        { id: 1, question: "Which method is used to finding an HTML element by ID?", options: ["getElementById()", "getElement(id)", "selectId()", "queryId()"], correctAnswer: "getElementById()" },
        { id: 2, question: "Which property changes the HTML content?", options: ["innerHTML", "htmlContent", "content", "value"], correctAnswer: "innerHTML" },
        { id: 3, question: "How to retrieve the value of an input field?", options: [".content", ".text", ".value", ".input"], correctAnswer: ".value" },
        { id: 4, question: "Which method adds a class to an element?", options: ["addClass()", "classList.add()", "style.class", "class()"], correctAnswer: "classList.add()" },
        { id: 5, question: "What method creates a new HTML element?", options: ["createElement()", "newElement()", "addElement()", "makeElement()"], correctAnswer: "createElement()" },
        { id: 6, question: "How to append a child node?", options: ["addChild()", "append()", "appendChild()", "insertChild()"], correctAnswer: "appendChild()" },
        { id: 7, question: "Which event occurs when a user clicks an element?", options: ["onmouseclick", "onclick", "click", "press"], correctAnswer: "onclick" },
        { id: 8, question: "How to remove an element?", options: ["remove()", "delete()", "erase()", "kill()"], correctAnswer: "remove()" },
        { id: 9, question: "What does 'document.querySelector' return?", options: ["All matches", "First match", "Last match", "Array"], correctAnswer: "First match" },
        { id: 10, question: "How to verify an element contains a class?", options: ["hasClass()", "classList.contains()", "inClass()", "checkClass()"], correctAnswer: "classList.contains()" }
      ]
    }
  },
  python: {
    topics: [
      { id: 'basics', name: 'Basics', description: 'Syntax, Variables, and Data Types' },
      { id: 'oop', name: 'OOP', description: 'Classes and Objects' }
    ],
    questions: {
      basics: [
        { id: 1, question: "How do you output 'Hello World' in Python?", options: ["echo 'Hello World'", "print('Hello World')", "console.log('Hello World')", "System.out.println('Hello World')"], correctAnswer: "print('Hello World')" },
        { id: 2, question: "How do you create a variable with value 5?", options: ["x = 5", "int x = 5", "vx = 5", "x : 5"], correctAnswer: "x = 5" },
        { id: 3, question: "What is the correct file extension for Python files?", options: [".pt", ".pyth", ".py", ".pyt"], correctAnswer: ".py" },
        { id: 4, question: "How do you create a function?", options: ["function myFunc():", "def myFunc():", "create myFunc():", "func myFunc():"], correctAnswer: "def myFunc():" },
        { id: 5, question: "Which list method adds an item to the end?", options: ["push()", "add()", "append()", "insert()"], correctAnswer: "append()" },
        { id: 6, question: "How to start a comment in Python?", options: ["//", "#", "/*", "<!--"], correctAnswer: "#" },
        { id: 7, question: "Which operator is used for exponentiation?", options: ["^", "**", "power", "exp"], correctAnswer: "**" },
        { id: 8, question: "What is a tuple?", options: ["Mutable list", "Immutable list", "Dictionary", "Function"], correctAnswer: "Immutable list" },
        { id: 9, question: "How to import a module?", options: ["import module", "include module", "using module", "require module"], correctAnswer: "import module" },
        { id: 10, question: "What does len() do?", options: ["Returns length", "Returns last element", "Returns letters", "Loops"], correctAnswer: "Returns length" }
      ],
      oop: [
        { id: 1, question: "Which keyword is used to create a class?", options: ["class", "struct", "object", "def"], correctAnswer: "class" },
        { id: 2, question: "What is '__init__'?", options: ["A constructor", "A destructor", "A static method", "Just a function"], correctAnswer: "A constructor" },
        { id: 3, question: "What parameter refers to the current instance?", options: ["this", "self", "me", "it"], correctAnswer: "self" },
        { id: 4, question: "How do you inherit from a class?", options: ["class Child(Parent):", "class Child extends Parent:", "class Child inherits Parent:", "Child : Parent"], correctAnswer: "class Child(Parent):" },
        { id: 5, question: "Can a class have methods?", options: ["Yes", "No", "Only static", "Only private"], correctAnswer: "Yes" },
        { id: 6, question: "What is encapsulation?", options: ["Hiding data", "Deleting data", "Sharing data", "Printing data"], correctAnswer: "Hiding data" },
        { id: 7, question: "What is polymorphism?", options: ["Many forms", "One form", "No form", "Static form"], correctAnswer: "Many forms" },
        { id: 8, question: "Does Python support multiple inheritance?", options: ["Yes", "No", "Sometimes", "With plugins"], correctAnswer: "Yes" },
        { id: 9, question: "How to create an object of class MyClass?", options: ["new MyClass()", "MyClass()", "create MyClass()", "obj MyClass"], correctAnswer: "MyClass()" },
        { id: 10, question: "What is a class attribute?", options: ["Shared by all instances", "Unique to instance", "A function", "A file"], correctAnswer: "Shared by all instances" }
      ]
    }
  },
  software: {
    topics: [
      { id: 'clean_code', name: 'Clean Code', description: 'Writing maintainable code' },
      { id: 'design_patterns', name: 'Design Patterns', description: 'Reusable solutions' }
    ],
    questions: {
      clean_code: [
        { id: 1, question: "What does DRY stand for?", options: ["Don't Repeat Yourself", "Do Repeat Yourself", "Data Repeat Yes", "Don't Run Yet"], correctAnswer: "Don't Repeat Yourself" },
        { id: 2, question: "What does KISS stand for?", options: ["Keep It Simple, Stupid", "Keep It Safe, Secure", "Keep It Small, Simple", "Code It Simple"], correctAnswer: "Keep It Simple, Stupid" },
        { id: 3, question: "Meaningful names apply to?", options: ["Variables", "Functions", "Classes", "All of the above"], correctAnswer: "All of the above" },
        { id: 4, question: "Ideally, functions should do?", options: ["One thing", "Everything", "Many things", "Nothing"], correctAnswer: "One thing" },
        { id: 5, question: "What is 'Code Smell'?", options: ["Indicator of potential problem", "Bad comments", "Compiler error", "Syntax error"], correctAnswer: "Indicator of potential problem" },
        { id: 6, question: "Why avoid magic numbers?", options: ["Confusing meaning", "Hard to update", "Prone to errors", "All of the above"], correctAnswer: "All of the above" },
        { id: 7, question: "Long parameter lists are?", options: ["Good", "Bad practice", "Necessary", "Optimal"], correctAnswer: "Bad practice" },
        { id: 8, question: "What is Refactoring?", options: ["Improving structure without changing behavior", "Fixing bugs", "Adding features", "Deleting code"], correctAnswer: "Improving structure without changing behavior" },
        { id: 9, question: "Comments should explain?", options: ["Why", "What", "How", "Who"], correctAnswer: "Why" },
        { id: 10, question: "What is YAGNI?", options: ["You Ain't Gonna Need It", "You Are Good Now Indeed", "Yet Another Git No Idea", "Yes All Good"], correctAnswer: "You Ain't Gonna Need It" }
      ],
      design_patterns: [
        { id: 1, question: "Which pattern ensures a class has only one instance?", options: ["Singleton", "Factory", "Observer", "Strategy"], correctAnswer: "Singleton" },
        { id: 2, question: "Which pattern creates objects without creating exact class?", options: ["Factory", "Singleton", "Adapter", "Facade"], correctAnswer: "Factory" },
        { id: 3, question: "Observer pattern is used for?", options: ["Event handling", "Database connection", "Sorting", "Looping"], correctAnswer: "Event handling" },
        { id: 4, question: "MVC stands for?", options: ["Model View Controller", "Model View Class", "Make View Controller", "Main View Control"], correctAnswer: "Model View Controller" },
        { id: 5, question: "Which pattern converts interface of a class to another?", options: ["Adapter", "Bridge", "Proxy", "Decorator"], correctAnswer: "Adapter" },
        { id: 6, question: "Facade pattern provides?", options: ["Simplified interface", "Complex interface", "No interface", "Backend logic"], correctAnswer: "Simplified interface" },
        { id: 7, question: "Strategy pattern allows?", options: ["Swapping algorithms at runtime", "Hardcoding logic", "Single algorithm", "Static flow"], correctAnswer: "Swapping algorithms at runtime" },
        { id: 8, question: "Decorator pattern adds behavior?", options: ["Dynamically", "Statically", "Never", "Compile time"], correctAnswer: "Dynamically" },
        { id: 9, question: "What are the three types of patterns?", options: ["Creational, Structural, Behavioral", "Good, Bad, Ugly", "Simple, Complex, Hard", "Fast, Slow, Medium"], correctAnswer: "Creational, Structural, Behavioral" },
        { id: 10, question: "Is Singleton considered an anti-pattern?", options: ["Sometimes", "Never", "Always", "No concept"], correctAnswer: "Sometimes" }
      ]
    }
  },
  agile: {
    topics: [
      { id: 'scrum', name: 'Scrum', description: 'Framework for developing complex products' },
      { id: 'kanban', name: 'Kanban', description: 'Visualizing work and managing flow' }
    ],
    questions: {
      scrum: [
        { id: 1, question: "What is the duration of a Sprint in Scrum?", options: ["1-4 weeks", "6 weeks", "3 months", "Variable"], correctAnswer: "1-4 weeks" },
        { id: 2, question: "Who owns the product backlog?", options: ["Product Owner", "Scrum Master", "Team", "CEO"], correctAnswer: "Product Owner" },
        { id: 3, question: "Who facilitates the Scrum process?", options: ["Scrum Master", "Manager", "Lead Dev", "Product Owner"], correctAnswer: "Scrum Master" },
        { id: 4, question: "What meeting is held daily?", options: ["Daily Standup", "Retro", "Planning", "Review"], correctAnswer: "Daily Standup" },
        { id: 5, question: "What is done at the end of a sprint?", options: ["Review and Retro", "Coding", "Planning only", "Nothing"], correctAnswer: "Review and Retro" },
        { id: 6, question: "What is a User Story?", options: ["Description of feature from user perspective", "A bug report", "A task", "A database schema"], correctAnswer: "Description of feature from user perspective" },
        { id: 7, question: "What is Velocity?", options: ["Measure of work/sprint", "Speed of code", "Bug count", "Lines of code"], correctAnswer: "Measure of work/sprint" },
        { id: 8, question: "What does Definition of Done mean?", options: ["Criteria for a completed item", "Code is written", "Tested locally", "Deployed"], correctAnswer: "Criteria for a completed item" },
        { id: 9, question: "Who creates the Sprint Backlog?", options: ["The Development Team", "Product Owner", "Scrum Master", "Manager"], correctAnswer: "The Development Team" },
        { id: 10, question: "Is Scrum Agile?", options: ["Yes", "No", "Only partially", "It is Waterfall"], correctAnswer: "Yes" }
      ],
      kanban: [
        { id: 1, question: "What is a key principle of Kanban?", options: ["Limit WIP (Work In Progress)", "Fixed Sprints", "Daily Standups", "Project Manager role"], correctAnswer: "Limit WIP (Work In Progress)" },
        { id: 2, question: "What does the Kanban board visualize?", options: ["Workflow", "Database", "Users", "Bugs"], correctAnswer: "Workflow" },
        { id: 3, question: "Does Kanban have fixed sprints?", options: ["No", "Yes", "Depends", "Always"], correctAnswer: "No" },
        { id: 4, question: "What is 'Pull System'?", options: ["Work is pulled when capacity permits", "Work is pushed by managers", "Git Pull", "Database Pull"], correctAnswer: "Work is pulled when capacity permits" },
        { id: 5, question: "Cycle time measures?", options: ["Time from start to finish", "Time in meeting", "Coding time", "Break time"], correctAnswer: "Time from start to finish" },
        { id: 6, question: "Who can add items to the backlog?", options: ["Ideally Anyone/Product Owner", "Only Manager", "No one", "Clients only"], correctAnswer: "Ideally Anyone/Product Owner" },
        { id: 7, question: "What is a bottleneck?", options: ["Constraint in the flow", "A bottle shape", "Fast process", "Good thing"], correctAnswer: "Constraint in the flow" },
        { id: 8, question: "Is Kanban Agile?", options: ["Yes", "No", "Waterfall", "Hybrid"], correctAnswer: "Yes" },
        { id: 9, question: "Kanban originated from?", options: ["Toyota / Manufacturing", "Software", "Construction", "Farming"], correctAnswer: "Toyota / Manufacturing" },
        { id: 10, question: "Does Kanban prescribe roles like Scrum Master?", options: ["No", "Yes", "Strictly", "Maybe"], correctAnswer: "No" }
      ]
    }
  }
};
