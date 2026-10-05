Build a complete MVP web application called **“What’s in My Fridge?”**.

## 1. Product Goal

Build a simple AI-powered web app for a friend who often has ingredients at home but doesn't know what to cook.

The core experience is:

> **Tell me what you have. I'll tell you what you can cook.**

The user adds ingredients they currently have, then the AI analyzes those ingredients and suggests practical meals they can make.

This project is specifically intended for the **Hacktoberfest 2026 “Build for a Friend”** challenge, so keep the scope focused and make the product feel like a real, usable small application rather than a generic AI demo.

---

## 2. Tech Stack

Use:

* **TanStack Start**
* **TypeScript**
* **TanStack Router**
* **TanStack Query**
* **TanStack AI**
* **Supabase PostgreSQL**
* **Supabase JS / SSR integration where appropriate**
* **OpenRouter** as the AI provider
* **OpenRouter free model routing** (`openrouter/free`) for the default AI model
* **Tailwind CSS**

Keep the application as a single TanStack Start application.

---

## 3. Core User Flow

The main flow should be:

1. User opens the application.
2. User sees their current ingredients/pantry.
3. User can add ingredients.
4. User can remove ingredients.
5. User clicks **“What can I cook?”**
6. The application sends the available ingredients to the server-side AI integration.
7. OpenRouter generates structured meal suggestions.
8. The UI displays practical meal suggestions.
9. User can open a suggestion to see its details.

Example:

Ingredients:

* Eggs
* Chicken
* Carrots
* Rice

AI suggestions:

* Chicken Fried Rice
* Chicken & Egg Rice Bowl
* Simple Chicken Soup

Each suggestion should show:

* meal name
* short description
* estimated cooking time
* difficulty
* ingredients used
* missing ingredients, if any

---

## 4. AI Requirements

The AI is the core feature of the application.

Use **TanStack AI with OpenRouter**.

Default provider/model configuration should use:

`openrouter/free`

Keep the AI integration isolated behind a small service/module so the model/provider can easily be changed later.

Do NOT expose the OpenRouter API key to the browser.

The OpenRouter API call must happen server-side.

The AI must return **structured JSON**, not arbitrary prose.

Use a schema/validation approach appropriate for TypeScript to validate the AI response.

Expected conceptual output:

```json
{
  "suggestions": [
    {
      "name": "Chicken Fried Rice",
      "description": "A simple fried rice using the chicken, eggs, carrots, and rice you already have.",
      "time_minutes": 15,
      "difficulty": "easy",
      "ingredients_used": [
        "rice",
        "chicken",
        "egg",
        "carrot"
      ],
      "missing_ingredients": [
        "soy sauce"
      ]
    }
  ]
}
```

The AI should generate approximately **3 meal suggestions**.

The AI prompt should instruct the model to:

* prioritize ingredients the user already has
* minimize additional ingredients
* avoid suggesting ingredients that are obviously unavailable
* keep recipes realistic
* keep cooking times reasonable
* clearly separate available and missing ingredients
* never claim an ingredient is available when it is not
* return only the required structured output

---

## 5. User Constraints

Allow the user to optionally provide additional instructions before generating suggestions.

Examples:

* “No spicy food”
* “Under Rp20.000”
* “Only 15 minutes”
* “I only have a rice cooker”
* “I don't want chicken today”

Add a simple optional text input:

**“Anything I should consider?”**

Send this instruction together with the ingredient list to the AI.

Do not build a complex preference-management system for the MVP.

---

## 6. Pantry / Ingredient Management

Create a simple pantry interface.

Users should be able to:

* add an ingredient
* remove an ingredient
* see all current ingredients

Each ingredient can have:

```text
name
quantity (optional)
unit (optional)
```

Example:

```text
Eggs       4 pcs
Chicken    500 g
Carrots    2 pcs
Rice       1 kg
```

Keep this intentionally simple.

Do not implement inventory tracking, expiration tracking, shopping lists, nutrition tracking, or barcode scanning in the MVP.

---

## 7. Supabase Database

Use Supabase PostgreSQL.

Create a simple database structure appropriate for the MVP.

At minimum, support storing pantry ingredients.

A reasonable initial table is:

```text
ingredients

id
name
quantity
unit
created_at
```

If authentication is not necessary for the MVP, do not add a complicated authentication system.

The application should still have a clean data layer so authentication can be added later.

Use environment variables for Supabase configuration.

Never expose secret service-role credentials to the client.

---

## 8. Pages / Routes

Keep the application small.

Suggested routes:

```text
/
```

Main application page containing:

* app branding
* pantry
* ingredient management
* optional instruction
* “What can I cook?” button
* generated suggestions

And:

```text
/recipe/:id
```

for recipe/suggestion details if needed.

Do not create unnecessary pages.

---

## 9. UI / UX

Design should feel like a small polished consumer product, not an admin dashboard.

Visual direction:

* clean
* friendly
* warm
* minimal
* modern
* food-oriented
* responsive
* mobile-friendly

Use Tailwind CSS.

The main page should make the core action immediately obvious.

Suggested hierarchy:

```text
What's in My Fridge?

Tell us what you have.
We'll figure out what you can cook.

[ Add ingredient ]

Your ingredients
────────────────────────

🥚 Eggs × 4
🍗 Chicken × 500g
🥕 Carrots × 2
🍚 Rice

[ What can I cook? ]

Anything I should consider?
[ _______________________ ]

────────────────────────

AI Suggestions

[ Meal Card ]
[ Meal Card ]
[ Meal Card ]
```

Avoid excessive gradients, excessive animations, glassmorphism, or dashboard-style UI.

Prioritize usability.

---

## 10. Loading / Error States

Implement proper states for:

### Loading

While AI is generating:

```text
Thinking of something delicious...
```

Do not freeze the UI.

### Empty pantry

Show a helpful empty state:

```text
Your fridge is empty.

Add a few ingredients and let's see what you can make.
```

### AI error

Show a friendly error message and allow retrying.

Never expose raw API errors or secrets to the user.

### Invalid AI response

Gracefully handle invalid structured output.

---

## 11. Security

Important:

* OpenRouter API key must remain server-side.
* Supabase secret/service-role key must remain server-side.
* Validate user input.
* Validate AI output.
* Do not trust arbitrary AI-generated data.
* Do not expose environment secrets through client-side code.

Use public Supabase configuration only where appropriate.

---

## 12. Code Quality

Follow good TypeScript practices.

Prefer:

* small reusable components
* clear separation between UI, data access, and AI logic
* typed API responses
* schema validation
* server-side AI calls
* simple maintainable architecture

Avoid overengineering.

Do not add abstractions that are not needed by the MVP.

---

## 13. README

Create a polished README explaining:

### What is What's in My Fridge?

Explain the problem and the solution.

### Why I Built It

Explain that this was built for a friend who often has ingredients at home but doesn't know what to cook.

### Open Source AI

Explain why the application uses an open/free model through OpenRouter.

Important: do NOT claim that inference is fully local.

Instead explain that:

* the application is not locked to one proprietary model
* the model can be swapped
* OpenRouter provides access to open/free models
* the AI provider is isolated from the application logic

### Features

List the MVP features.

### Tech Stack

List:

* TanStack Start
* TypeScript
* TanStack Router
* TanStack Query
* TanStack AI
* Supabase
* OpenRouter
* Tailwind CSS

### Local Development

Provide clear setup instructions including:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=
```

Use the correct environment variable conventions for the chosen TanStack Start/Supabase setup.

Explain how to:

1. install dependencies
2. configure environment variables
3. create the Supabase table
4. run the development server

### AI Configuration

Explain how to change the OpenRouter model later.

---

## 14. Important Product Constraint

Do NOT turn this into a generic AI chatbot.

There should be no giant chat interface.

The primary interaction must remain:

```text
Ingredients
    ↓
AI analysis
    ↓
Meal suggestions
```

The AI should feel like a feature of the product, not the entire product.

---

## 15. Acceptance Criteria

The project is complete when:

* [ ] Application runs successfully with TanStack Start.
* [ ] User can add ingredients.
* [ ] User can remove ingredients.
* [ ] Ingredients persist in Supabase.
* [ ] User can enter optional cooking constraints.
* [ ] User can click “What can I cook?”
* [ ] Server securely calls OpenRouter.
* [ ] OpenRouter uses `openrouter/free` by default.
* [ ] AI returns structured meal suggestions.
* [ ] AI suggestions are validated before rendering.
* [ ] UI displays approximately 3 meal suggestions.
* [ ] Each suggestion shows used ingredients and missing ingredients.
* [ ] Loading state works.
* [ ] Error state works.
* [ ] Empty state works.
* [ ] OpenRouter API key is never exposed to the client.
* [ ] Supabase secret credentials are never exposed to the client.
* [ ] Application is responsive.
* [ ] README contains complete setup instructions.
* [ ] No unnecessary features are added.

---

## 16. Implementation Instructions

Start by inspecting the current project structure and existing dependencies.

If the project is empty, initialize the project using the recommended TanStack Start setup.

Before implementing, determine the current stable APIs for:

* TanStack Start
* TanStack AI
* TanStack AI OpenRouter adapter
* Supabase integration

Use the current APIs rather than deprecated examples.

Then implement the MVP end-to-end.

Do not stop after creating a scaffold.

The final result should be a working application with:

**UI → server-side AI → OpenRouter → structured response → rendered meal suggestions → Supabase persistence.**

After implementation, run the available type checks, linting, and build/tests, fix any errors you encounter, and leave the project in a runnable state.
