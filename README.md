# 🎒 Campus Lost & Found with Semantic Search

A full-stack university lost and found platform that leverages machine learning and vector embeddings to intelligently match lost items with found reports based on unstructured text descriptions.

---

## 🚀 Tech Stack

*   **Backend:** Django, Django REST Framework, Gunicorn, Whitenoise
*   **Database:** PostgreSQL with `pgvector` extension for multi-dimensional vector similarity search
*   **Machine Learning / AI:** PyTorch, Sentence Transformers (`all-MiniLM-L6-v2`)
*   **Frontend:** Next.js, React, Tailwind CSS
*   **Utilities:** `django-environ` for environment variable management

---

## 🧠 How Semantic Matching Works
Traditional keyword searches fail when users describe items differently (e.g., searching for "black wireless earbuds" when a finder wrote "JBL pods"). This application solves that by:
1. Converting text descriptions into **384-dimensional dense vectors** using a lightweight Sentence Transformer model.
2. Storing and querying vector embeddings directly inside PostgreSQL using `pgvector`.
3. Calculating cosine similarity scores to return high-confidence and possible matches instantly.

---

## 🛠️ Local Development Setup

Follow these steps to set up and run the project locally on your machine.

### Prerequisites
*   Python 3.10+
*   Node.js & npm
*   PostgreSQL database (with the `vector` extension enabled, e.g., via Neon or local Postgres)

### 1. Clone the Repository
```bash
git clone [https://github.com/KidusEfrem/lost-and-found.git](https://github.com/KidusEfrem/lost-and-found.git)
cd lost-and-found