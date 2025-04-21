
    """Returns random songs as a fallback."""
    return df.sample(n=min(num_songs, len(df)))[["song_name", "singer", "released_date"]].to_dict(orient="records")

def recommend_songs(song_name, num_recommendations=5):
    """Recommends similar songs based on co