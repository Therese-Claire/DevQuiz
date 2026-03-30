-- Seed Tactical Quiz Sets
DO $$
DECLARE
    web_core_id UUID;
    responsive_id UUID;
    logic_node_id UUID;
    ops_excellence_id UUID;
BEGIN
    -- 1. Insert Quiz Sets
    INSERT INTO quiz_sets (name, description, difficulty)
    VALUES ('Web Core Mastery', 'A foundational mission covering HTML, CSS, and JS essential protocols.', 'beginner')
    RETURNING id INTO web_core_id;

    INSERT INTO quiz_sets (name, description, difficulty)
    VALUES ('Responsive Tactics', 'Advanced strategies for building fluid, high-performance user interfaces.', 'intermediate')
    RETURNING id INTO responsive_id;

    INSERT INTO quiz_sets (name, description, difficulty)
    VALUES ('Logic Node', 'Deep dive into DOM manipulation and Pythonic logic structures.', 'advanced')
    RETURNING id INTO logic_node_id;

    INSERT INTO quiz_sets (name, description, difficulty)
    VALUES ('Operations Excellence', 'Mastering clean code, design patterns, and agile deployment cycles.', 'professional')
    RETURNING id INTO ops_excellence_id;

    -- 2. Map Questions to Sets
    
    -- Web Core Mastery (HTML Basics + CSS Selectors + JS Syntax)
    INSERT INTO quiz_set_questions (quiz_set_id, question_id)
    SELECT web_core_id, id FROM questions WHERE (category_id = 'html' AND topic_id = 'basics') LIMIT 4;
    INSERT INTO quiz_set_questions (quiz_set_id, question_id)
    SELECT web_core_id, id FROM questions WHERE (category_id = 'css' AND topic_id = 'selectors') LIMIT 3;
    INSERT INTO quiz_set_questions (quiz_set_id, question_id)
    SELECT web_core_id, id FROM questions WHERE (category_id = 'js' AND topic_id = 'syntax') LIMIT 3;

    -- Responsive Tactics (CSS Flexbox + HTML Forms)
    INSERT INTO quiz_set_questions (quiz_set_id, question_id)
    SELECT responsive_id, id FROM questions WHERE (category_id = 'css' AND topic_id = 'flexbox') LIMIT 6;
    INSERT INTO quiz_set_questions (quiz_set_id, question_id)
    SELECT responsive_id, id FROM questions WHERE (category_id = 'html' AND topic_id = 'forms') LIMIT 4;

    -- Logic Node (JS DOM + Python Basics)
    INSERT INTO quiz_set_questions (quiz_set_id, question_id)
    SELECT logic_node_id, id FROM questions WHERE (category_id = 'js' AND topic_id = 'dom') LIMIT 5;
    INSERT INTO quiz_set_questions (quiz_set_id, question_id)
    SELECT logic_node_id, id FROM questions WHERE (category_id = 'python' AND topic_id = 'basics') LIMIT 5;

    -- Operations Excellence (Clean Code + Design Patterns + Agile Scrum)
    INSERT INTO quiz_set_questions (quiz_set_id, question_id)
    SELECT ops_excellence_id, id FROM questions WHERE (category_id = 'software' AND topic_id = 'clean_code') LIMIT 4;
    INSERT INTO quiz_set_questions (quiz_set_id, question_id)
    SELECT ops_excellence_id, id FROM questions WHERE (category_id = 'software' AND topic_id = 'design_patterns') LIMIT 3;
    INSERT INTO quiz_set_questions (quiz_set_id, question_id)
    SELECT ops_excellence_id, id FROM questions WHERE (category_id = 'agile' AND topic_id = 'scrum') LIMIT 3;

END $$;
