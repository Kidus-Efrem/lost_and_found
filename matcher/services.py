from sentence_transformers import SentenceTransformer

_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model

def generate_embedding(text: str) -> list[float]:
    """
    Converts unstructured text description into a 384-dimensional vector.
    """
    model = get_model()
    vector = model.encode(text).tolist()
    return vector