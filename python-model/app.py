from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import requests
import base64
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

# Load dataset
df = pd.read_csv('clustered_hindi_songs.csv')

# Feature columns
numerical_features = ['danceability', 'energy', 'tempo', 'acousticness', 'liveness', 'speechiness']

def get_random_songs(num_songs=5):
    """Returns random songs as a fallback."""
    return df.sample(n=min(num_songs, len(df)))[["song_name", "singer", "released_date"]].to_dict(orient="records")

def recommend_songs(song_name, num_recommendations=5):
    """Recommends similar songs based on cosine similarity."""

    # Check if the song exists in dataset
    if song_name not in df["song_name"].values:
        return {"message": f"'{song_name}' not found. Showing random songs.", "recommendations": get_random_songs(num_recommendations)}

    # Get the song's cluster
    song_row = df[df["song_name"] == song_name]
    song_cluster = song_row["Cluster"].values[0]

    # Get all songs from the same cluster
    same_cluster_songs = df[df["Cluster"] == song_cluster]

    # Get song index in cluster
    song_indices = same_cluster_songs[same_cluster_songs["song_name"] == song_name].index.tolist()
    if not song_indices:
        return {"message": f"'{song_name}' not found in its cluster. Showing random songs.", "recommendations": get_random_songs(num_recommendations)}

    song_index = song_indices[0]  # Get first index

    # Check if numerical features exist
    if not set(numerical_features).issubset(same_cluster_songs.columns):
        return {"message": "Numerical features missing. Showing random songs.", "recommendations": get_random_songs(num_recommendations)}

    # Compute similarity
    cluster_features = same_cluster_songs[numerical_features]
    similarity = cosine_similarity(cluster_features, cluster_features)

    # Ensure index is within bounds
    if song_index >= len(similarity):
        return {"message": f"Song index {song_index} out of bounds. Showing random songs.", "recommendations": get_random_songs(num_recommendations)}

    # Get top similar songs
    num_available_songs = len(same_cluster_songs) - 1
    num_recommendations = min(num_recommendations, num_available_songs)

    if num_recommendations <= 0:
        return {"message": f"Not enough similar songs for '{song_name}'. Showing random songs.", "recommendations": get_random_songs(num_recommendations)}

    similar_songs = np.argsort(similarity[song_index])[-(num_recommendations + 1):-1][::-1]

    if len(similar_songs) == 0:
        return {"message": "No similar songs found. Showing random songs.", "recommendations": get_random_songs(num_recommendations)}

    recommendations = same_cluster_songs.iloc[similar_songs][["song_name", "singer", "released_date"]].to_dict(orient="records")

    return {"message": "Recommendations found!", "recommendations": recommendations}

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

def get_spotify_token():
    auth_str = f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}"
    b64_auth_str = base64.b64encode(auth_str.encode()).decode()

    headers = {
        "Authorization": f"Basic {b64_auth_str}",
    }
    data = {
        "grant_type": "client_credentials",
    }

    resp = requests.post("https://accounts.spotify.com/api/token", headers=headers, data=data)
    return resp.json().get("access_token")

def get_spotify_song_data(song_name, token):
    headers = {
        "Authorization": f"Bearer {token}"
    }

    params = {
        "q": song_name,
        "type": "track",
        "limit": 1
    }

    resp = requests.get("https://api.spotify.com/v1/search", headers=headers, params=params)
    items = resp.json().get("tracks", {}).get("items", [])

    if not items:
        return None

    track = items[0]

    return {
        "title": track["name"],
        "artist": track["artists"][0]["name"],
        "album": track["album"]["name"],
        "cover_url": track["album"]["images"][0]["url"],
        "release_date": track["album"]["release_date"],
        "spotify_url": track["external_urls"]["spotify"],
        "duration_ms": track["duration_ms"]
    }


@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    song_name = data.get("song_name", "").strip()

    if not song_name:
        return jsonify({"error": "Song name is required"}), 400

    # Get song recommendations (your existing logic)
    recommended_songs = recommend_songs(song_name)

    # Get Spotify token
    token = get_spotify_token()

    # Attach Spotify info to each recommended song
    enriched = []
    songs = [rec["song_name"] for rec in recommended_songs["recommendations"]]
    for rec in songs:
        spotify_data = get_spotify_song_data(rec, token)
        print(recommended_songs["message"])
        if spotify_data:
             enriched.append(spotify_data)

    return jsonify({"songs" :enriched , 'message' : recommended_songs["message"]})


@app.route("/random", methods=["GET"])

def get_random():
    """GET endpoint to return random songs."""
    return jsonify({"message": "Here are some songs that you may like", "songs": get_random_songs(6)})




@app.route("/search", methods=["GET"])
def search_songs():
    """Returns case-insensitive song name suggestions (Top 10)."""
    query = request.args.get("query", "").strip().lower()  # Convert to lowercase
    print(query);

    if not query:
        return jsonify({"songs": []})  # Return empty if no query
    
    # Filter songs that contain the query (case insensitive)
    matched_songs = df[df["song_name"].str.lower().str.contains(query, na=False)]
    
    return jsonify({"songs": matched_songs["song_name"].head(10).tolist()})  # Return top 1


if __name__ == "__main__":
    app.run(debug=True)