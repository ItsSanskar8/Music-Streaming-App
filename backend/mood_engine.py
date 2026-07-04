"""Local heuristic mood recommender.

Uses TextBlob's built-in pattern analyzer (no NLTK downloads required for
`.sentiment`) to read polarity/subjectivity of "title + artist", then blends
that with lightweight keyword hints to pick one of six moods:

    chill, energetic, ambient, focus, happy, melancholic
"""

from textblob import TextBlob

MOODS = ["chill", "energetic", "ambient", "focus", "happy", "melancholic"]

# Strong keyword signals override sentiment when present. Order matters:
# the first mood whose keywords match wins.
_KEYWORDS = {
    "energetic": ["remix", "party", "dance", "workout", "gym", "hype", "banger",
                  "trap", "edm", "drop", "bass", "club", "rave", "power"],
    "melancholic": ["sad", "cry", "alone", "broken", "goodbye", "hurt", "tears",
                    "lonely", "lost", "rain", "empty", "sorry", "miss you"],
    "focus": ["lofi", "lo-fi", "study", "instrumental", "piano", "concentration",
              "coding", "deep", "reading", "work"],
    "ambient": ["ambient", "meditation", "sleep", "calm", "nature", "space",
                "drone", "atmosphere", "float", "dream"],
    "happy": ["happy", "sunshine", "smile", "good vibes", "feel good", "joy",
              "celebrate", "sweet", "love you"],
    "chill": ["chill", "relax", "vibe", "slow", "acoustic", "soul", "smooth",
              "mellow", "sunset", "coffee"],
}


def _keyword_mood(text: str) -> str | None:
    lowered = text.lower()
    for mood, words in _KEYWORDS.items():
        if any(word in lowered for word in words):
            return mood
    return None


def assign_mood(title: str, artist: str = "") -> str:
    """Return a mood label for a track from its title + artist."""
    text = f"{title} {artist}".strip()
    if not text:
        return "chill"

    # 1) Keyword hints are the most reliable signal for music metadata.
    hinted = _keyword_mood(text)
    if hinted:
        return hinted

    # 2) Fall back to sentiment analysis.
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity        # -1.0 .. 1.0
    subjectivity = blob.sentiment.subjectivity  # 0.0 .. 1.0

    if polarity >= 0.5:
        return "happy"
    if polarity >= 0.15:
        # Positive + opinionated reads as upbeat/energetic, otherwise chill.
        return "energetic" if subjectivity >= 0.5 else "chill"
    if polarity <= -0.4:
        return "melancholic"
    if polarity < -0.1:
        return "chill"

    # Roughly neutral polarity -> instrumental-leaning moods.
    return "focus" if subjectivity < 0.4 else "ambient"
