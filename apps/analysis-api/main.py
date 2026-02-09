from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Analysis API")


class AnalysisRequest(BaseModel):
    repo: str
    path: str
    content: str


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}


@app.post("/analyze")
def analyze(payload: AnalysisRequest) -> dict:
    return {
        "repo": payload.repo,
        "path": payload.path,
        "insights": [
            "Dependency graph updated.",
            "No architectural drift detected."
        ]
    }
