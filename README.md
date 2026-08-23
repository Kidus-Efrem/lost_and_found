# 🎒 Campus Lost & Found with Semantic Search

A full-stack university lost and found platform that uses **machine learning and vector embeddings** to intelligently match lost items with found reports based on natural-language descriptions.

Instead of relying purely on keyword matching, the system understands that different descriptions can refer to the same item—for example, **"black wireless earbuds"** and **"JBL pods."**

---

## ✨ Features

* 🔎 **Semantic Search** — Finds relevant items even when users use different words to describe them.
* 🧠 **AI-Powered Matching** — Uses Sentence Transformers to generate semantic embeddings.
* 📍 **Context-Aware Matching** — Uses campus location information to improve match confidence.
* ⚡ **Vector Search** — Performs similarity searches directly inside PostgreSQL using `pgvector`.
* 🎒 **Lost & Found Reporting** — Supports reporting both lost and found items.
* 📊 **Confidence Scoring** — Categorizes results into high-confidence and possible matches.

---

## 🏗️ Approach & Architecture

The application was built as an end-to-end full-stack campus utility focused on solving a common problem: **users rarely describe the same item using exactly the same vocabulary.**

Instead of relying on brittle keyword matching, the system uses **dense vector embeddings** to capture the semantic meaning of item descriptions.

### High-Level Architecture

```text
┌─────────────────────┐
│    Next.js Frontend │
│   React + Tailwind  │
└──────────┬──────────┘
           │
           │ REST API
           ▼
┌─────────────────────┐
│   Django + DRF      │
│                     │
│  Matching Service   │
│  Business Logic     │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌──────────┐  ┌─────────────────────┐
│PostgreSQL│  │ Sentence Transformer│
│+pgvector │  │ all-MiniLM-L6-v2    │
└──────────┘  └─────────────────────┘
```

### Core Stack

| Layer            | Technology                     |
| ---------------- | ------------------------------ |
| Frontend         | Next.js, React, Tailwind CSS   |
| Backend          | Django, Django REST Framework  |
| Database         | PostgreSQL + `pgvector`        |
| Machine Learning | PyTorch, Sentence Transformers |
| Embedding Model  | `all-MiniLM-L6-v2`             |
| Server           | Gunicorn, Whitenoise           |
| Configuration    | `django-environ`               |

---

## 🧠 How the Matching System Works

The matching system combines **dense vector similarity** with a small **contextual location boost** to classify results into confidence tiers.

### 1. Embedding Generation

When a user reports a lost or found item, the item's text description is passed through the lightweight Sentence Transformer model:

```text
all-MiniLM-L6-v2
```

The model converts the description into a **384-dimensional dense vector**.

For example:

```text
"black wireless earbuds"
            │
            ▼
   Sentence Transformer
            │
            ▼
[0.12, -0.43, 0.87, ..., 0.21]
       384 dimensions
```

Descriptions with similar meanings tend to produce vectors that are closer together in the embedding space.

---

### 2. Vector Similarity Search

The generated embeddings are stored directly in PostgreSQL using the `pgvector` extension.

When searching for potential matches, the backend calculates the vector distance between the user's query and stored item embeddings.

The distance is converted into a raw semantic similarity score:

$$
\text{similarity} = (1 - \text{match.distance}) \times 100
$$

A higher similarity score means the descriptions are more semantically related.

---

### 3. Contextual Location Boost

Semantic similarity alone isn't always enough.

For example, two descriptions may be highly similar, but one item may have been found in a completely different part of campus.

To account for this, the backend checks whether the user's provided location matches the location associated with the item.

When they align, the system applies a **+10 percentage-point bonus** to the score.

---

### 4. Confidence Tiers

The final score is capped at **99%** and categorized into confidence levels:

|      Score | Classification     | Meaning                                                        |
| ---------: | ------------------ | -------------------------------------------------------------- |
| **75–99%** | 🟢 High Confidence | Strong semantic overlap and/or matching contextual information |
| **50–74%** | 🟡 Possible Match  | Some meaningful similarity, but the match is less certain      |
|  **< 50%** | ⚪ No Match         | Does not meet the minimum similarity threshold                 |

For example:

**Query:**

> "wireless earbuds"

**Found report:**

> "JBL pods in a black case"

The descriptions may receive a high semantic similarity score even though they do not share the exact same keywords.

---

## 📐 Important Assumptions

The system currently assumes:

* Users provide descriptions long enough to contain meaningful semantic information.
* Item descriptions contain enough distinguishing information for the embedding model to identify useful similarities.
* The database environment supports the `pgvector` PostgreSQL extension.
* Location information, when provided, can be used as additional contextual information.

---

## 🛠️ Major Technical Decisions

### Why `pgvector` Instead of a Dedicated Vector Database?

The project uses PostgreSQL with `pgvector` instead of introducing a separate vector database such as Pinecone.

This keeps the architecture unified:

```text
Application
     │
     ▼
PostgreSQL
 ┌───────────────┐
 │ Regular Data  │
 │      +        │
 │ Vector Data   │
 └───────────────┘
```

This approach:

* Reduces infrastructure complexity
* Avoids maintaining a separate vector database
* Keeps relational and vector data in the same system
* Reduces additional network communication between services

For the scale of a campus lost-and-found application, this provides a practical balance between simplicity and capability.

### Lazy-Loading the ML Model

The transformer model is initialized on demand or during application startup rather than repeatedly loading it for individual requests.

This helps control memory usage and avoids unnecessary model initialization overhead.

---

## 🚫 What I Intentionally Chose Not to Build

### User Authentication / RBAC

A full authentication and role-based access control system was intentionally left out to keep the application focused on the core lost-and-found workflow and minimize friction during usage.

### Automated Image Recognition

The project focuses specifically on **natural-language semantic matching**.

Multi-modal image recognition was intentionally excluded to keep the scope focused and demonstrate the capabilities of text embeddings and vector similarity search.

---

## 🚀 What I Would Improve for a Real Product

The current implementation demonstrates the core concept, but a production-ready system could be extended with:

### 🔔 Real-Time Notifications

Add WebSocket-based notifications using technologies such as Django Channels or Pusher so users can be immediately notified when a potentially matching item is reported.

### 💬 Secure User Communication

Add a finder-to-owner messaging system or a masked email relay so users can communicate without exposing their personal contact information.

### ⚙️ Asynchronous Embedding Generation

Move embedding generation into background workers using Celery.

```text
User submits item
       │
       ▼
    API Response
       │
       ▼
   Background Job
       │
       ▼
Generate Embedding
       │
       ▼
Store Vector
```

This would prevent ML processing from blocking API requests and help maintain fast response times as the application scales.

### 📈 Improved Ranking

A future version could combine additional signals such as:

* Item category
* Time reported
* Location proximity
* Color
* Brand
* Description similarity
* Image similarity

This would allow the matching system to move from a primarily semantic approach toward a more sophisticated multi-signal ranking system.

---

## 📁 Project Structure

```text
lost-and-found/
├── core/               # Django project settings, URLs, and WSGI configuration
├── matcher/            # Core Django app
│   ├── models/         # Database models
│   ├── views/          # API views
│   └── services/       # Semantic search and matching logic
├── frontend/           # Next.js frontend application
├── requirements.txt    # Python dependencies
└── manage.py           # Django management script
```

---

## 🛠️ Local Development Setup

Follow these steps to set up and run the project locally.

### Prerequisites

* Python 3.10+
* Node.js & npm
* PostgreSQL with the `vector` extension enabled
* A PostgreSQL database such as Neon or a local PostgreSQL installation

### 1. Clone the Repository

```bash
git clone https://github.com/KidusEfrem/lost-and-found.git
cd lost-and-found
```

### 2. Backend Setup

Create and activate a Python virtual environment:

```bash
python -m venv .venv
```

**Windows:**

```bash
.venv\Scripts\activate
```

**macOS/Linux:**

```bash
source .venv/bin/activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the root directory using `.env.example` as a reference:

```env
SECRET_KEY=your-django-secret-key-here
DEBUG=True
DATABASE_URL=postgresql://your_db_user:your_password@your_host:5432/your_db_name
```

Run database migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file inside `frontend/` if you want to override the default API endpoint:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start the Next.js development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

---

## 🤖 AI Usage Disclosure

AI tools including **Claude and ChatGPT** were used as development assistants for:

* Drafting initial UI boilerplate
* Debugging complex `pgvector` Django ORM queries
* Refining semantic similarity scoring logic
* Exploring implementation approaches

All generated code was **reviewed, tested, modified, and integrated manually** as part of the development process.

---

## 📄 License

This project is open-source and available for educational and portfolio purposes.
