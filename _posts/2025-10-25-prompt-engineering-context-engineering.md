---
title: "Prompt Engineering and Context Engineering in Generative AI Apps"
date: 2025-10-25
description: "Master the art of prompt and context engineering. Learn how to design effective prompts, manage context with RAG, and build better Generative AI applications with practical examples."
categories: [AI, Software Design]
tags: [Prompt Engineering, Context Engineering, Generative AI, LLM, RAG, LangChain, DSPy]
meta:
  - name: "keywords"
    content: "Prompt engineering, context engineering, generative AI, RAG, LangChain, DSPy, LLM, few-shot learning, chain of thought"
  - name: "author"
    content: "Mohamed Thabet"
---

# Prompt Engineering and Context Engineering in Generative AI Apps

## Introduction

When building a Generative AI app, the _prompt_ is one of the most essential components of the system.
It defines how the model interprets your request, reasons through it, and what kind of output it produces.

Over time, **prompt design evolves** — from simple static prompts to structured, dynamic prompts managed programmatically using frameworks like **DSPy**.

---

## The Changing Role of Prompts

Different models interpret prompts differently, and even the same model can change its behavior after fine-tuning or version updates.
That's why using a **prompt management layer** (such as DSPy) becomes crucial for apps that need stable, repeatable outputs or complex pipelines.

---

## Components of a Prompt

A high-quality prompt contains multiple elements that guide the model toward the right outcome.
Here's a breakdown with **real-world examples** for each:

| Component                               | Description                                                                              | Example                                                                                                         |
| --------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Role Assignment**                     | Defines who the AI should act as to influence its tone, vocabulary, and reasoning style. | "You are a senior Python developer reviewing junior developers' code for readability and performance."          |
| **Objective / Goals / Tasks**           | Describes what the model must accomplish.                                                | "Write an SQL query to find all users who registered in the past 30 days."                                      |
| **Keywords and Specificity**            | Adds relevant domain terms or instructions for precision.                                | "Use Django ORM syntax and return the query as a string."                                                       |
| **Few-Shot Examples**                   | Shows examples of desired behavior to improve reliability.                               | **Input:** "Summarize: AI tools help developers." → **Output:** "Developers boost productivity using AI tools." |
| **Chain of Thought (CoT)**              | Encourages reasoning through complex steps.                                              | "Think step by step before providing the final SQL query."                                                      |
| **Constraint Settings**                 | Defines boundaries to control length, style, or structure.                               | "Respond in under 200 words and use bullet points."                                                             |
| **Conciseness and Relevance**           | Directs the model to stay focused and brief.                                             | "Answer only the question asked; avoid general introductions."                                                  |
| **Encourage Creativity / Adaptability** | Allows flexibility for open-ended tasks.                                                 | "Suggest three unique app ideas that use generative AI in education."                                           |
| **Formatting Instructions**             | Tells the model how to structure the output.                                             | "Return the response as valid JSON with keys: 'idea', 'description', 'impact'."                                 |

---

## Context Engineering

Prompt engineering focuses on _what_ to tell the model.
**Context engineering** ensures the model has _the right information_ to reason effectively and generate consistent results.

### Core Elements

| Component                                | Description                                                                   | Example / Why It's Needed                                                                                                                                                 |
| ---------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Memory**                               | Lets the model retain or recall relevant information from prior interactions. | **Short-term:** Summarize the last three messages in a chat to maintain context. **Long-term:** Store user preferences (like "preferred language: French") in a database. |
| **State Management**                     | Keeps track of the current conversation or task progress.                     | In a travel booking agent, ensure the model remembers whether the user already provided dates before asking again.                                                        |
| **RAG (Retrieval-Augmented Generation)** | Retrieves external data or documents before responding.                       | Fetch relevant policy text from a company manual before explaining HR procedures.                                                                                         |
| **Tools**                                | Allows the LLM to take real actions beyond text generation.                   | Call an API to fetch weather data or update a record in a database. (At this point, your app becomes an AI Agent.)                                                        |
| **Prompt (Static)**                      | The base structure or system prompt that defines core behavior.               | "Always reply as a helpful technical assistant."                                                                                                                          |

### LangChain Tools for Context Engineering

| Tool                 | Purpose                                               | Example                                                                          |
| -------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Memory**           | Store and retrieve conversation history.              | `ConversationBufferMemory` maintains dialogue context in chatbots.               |
| **Text Chunks**      | Split large documents into manageable pieces for RAG. | `RecursiveCharacterTextSplitter` divides long PDFs into 1000-character segments. |
| **State Management** | Track steps and workflow progress.                    | `RunnableSequence` or LangGraph to ensure the app knows what step comes next.    |

---

## Rules for Effective Prompt Design

| Rule                        | Explanation                                                       | Example                                                                                                            |
| --------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Keep it short and clear** | Avoid unnecessary words or vague instructions.                    | ❌ "Please help me by possibly explaining some sorting method." → ✅ "Explain merge sort simply with Python code." |
| **Provide context**         | Give background or purpose to guide the model's tone and details. | "You're helping a student learn databases. Explain normalization."                                                 |
| **Make tasks explicit**     | Tell the model exactly what to do.                                | "List three pros and three cons of using microservices in web apps."                                               |
| **Set limits**              | Control verbosity and prevent off-topic output.                   | "Write a summary under 100 words."                                                                                 |
| **Avoid bias**              | Frame requests neutrally to get balanced answers.                 | Instead of "Why open source is better?" use "Compare open source and proprietary models."                          |

---

## Example: Simple Generative AI App in Python

```python
from openai import OpenAI

client = OpenAI(api_key="your_api_key")

generation_config = {
    "max_tokens": 1024,  # Maximum length of the generated response in tokens (1 token ≈ 4 characters)
    "temperature": 0.7,  # Controls randomness: 0 = deterministic/focused, 1 = creative/random
    "top_p": 0.8,  # Nucleus sampling: only considers tokens with cumulative probability up to 80%
    "top_k": 40,  # Only considers the top 40 most likely next tokens (reduces irrelevant choices)
}

prompt = """
You are a helpful assistant.
Task: Write a short motivational quote for developers about learning AI.
"""

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": prompt}],
    **generation_config
)

print(response.choices[0].message.content)
```

---

## Safety Settings (with Real Example)

When building Gen AI apps, always use **safety filters** to detect or block unsafe inputs and outputs such as hate speech, self-harm content, or sensitive data.

### Example 1: OpenAI Moderation API

```python
from openai import OpenAI

client = OpenAI(api_key="your_api_key")

user_input = "Tell me how to hack a system."

# Run moderation before sending the prompt to the model
moderation = client.moderations.create(input=user_input)

if moderation.results[0].flagged:
    print("⚠️ Unsafe content detected. Request blocked.")
else:
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": user_input}]
    )
    print(response.choices[0].message.content)
```

### Example 2: Google Gemini Safety Settings

```python
safety_settings = [
    {"category": "HARM_CATEGORY_DEROGATORY", "threshold": "BLOCK"},
    {"category": "HARM_CATEGORY_VIOLENCE", "threshold": "BLOCK"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK"},
]
```

---

## SLM vs LLM Comparison

| Feature                  | SLM (Small Language Model)                            | LLM (Large Language Model)                             |
| ------------------------ | ----------------------------------------------------- | ------------------------------------------------------ |
| **Parameters**           | 100M–3B                                               | 7B–500B+                                               |
| **Compute Requirements** | Can run on CPU or edge devices                        | Requires GPUs or TPUs                                  |
| **Context Window**       | Limited (few thousand tokens)                         | Very large (up to millions of tokens)                  |
| **Response Quality**     | Quick and efficient but less deep                     | High reasoning ability, detailed answers               |
| **Pros**                 | Fast, cost-effective, great for offline or local apps | Versatile, accurate, handles complex reasoning         |
| **Cons**                 | Limited context and nuance                            | High cost, slower response time                        |
| **Use Cases**            | Chatbots, embedded assistants, mobile AI              | Research, writing tools, AI copilots, complex analysis |

---

## Resources

- [Prompt Engineering Guide](https://www.promptingguide.ai/) - Comprehensive guide covering advanced prompting techniques, AI agents, and LLM research
- [Prompt Engineering: The Secret to Better AI Responses](https://youtu.be/vD0E3EUb8-8?si=2mx2lCAScPme-qQ3)
- [Deep Dive: Context Engineering for LLMs](https://www.youtube.com/watch?v=_ieP1C3qpQs)
- [DSPy](https://dspy.ai/) - Framework for programmatically optimizing language model prompts and weights
