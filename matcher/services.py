from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def generate_embedding(text: str) -> list[float]:
    """
    Converts unstructured text description into a 384-dimensional vector.
    """
    vector = model.encode(text).tolist()
    return vector