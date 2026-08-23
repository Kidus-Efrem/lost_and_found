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
2. Backend Setup (Django)
Create and activate a Python virtual environment:

Bash
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate
Install the required Python packages:

Bash
pip install -r requirements.txt
Create a .env file in the root directory (referencing .env.example) and add your configuration:

Plaintext
SECRET_KEY=your-django-secret-key-here
DEBUG=True
DATABASE_URL=postgresql://your_db_user:your_password@your_host:5432/your_db_name
Run database migrations:

Bash
python manage.py migrate
Start the Django development server:

Bash
python manage.py runserver
(The backend will be running at http://127.0.0.1:8000)

3. Frontend Setup (Next.js)
Open a new terminal window and navigate to the frontend directory:

Bash
cd frontend
Install dependencies:

Bash
npm install
Create a .env.local file inside the frontend/ folder if you want to override the default API endpoint:

Plaintext
NEXT_PUBLIC_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)
Start the Next.js development server:

Bash
npm run dev
(The frontend will be running at http://localhost:3000)

📁 Project Structure
Plaintext
lost-and-found/
├── core/               # Django project settings, urls, and wsgi configuration
├── matcher/            # Core Django app (models, views, semantic search services)
├── frontend/           # Next.js frontend application (App Router, Tailwind)
├── requirements.txt    # Python dependencies
└── manage.py           # Django management script
📄 License
This project is open-source and available for educational and portfolio purposes.