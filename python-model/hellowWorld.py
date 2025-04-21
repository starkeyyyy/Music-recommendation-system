import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load Dataset
print("Loading dataset...")
df = pd.read_csv("Hindi_songs.csv")
print(f"Dataset loaded! Total songs: {len(df)}")

# Sample Data (Reduce if slow)
df = df.sample(n=min(1000, len(df)), random_state=42).reset_index(drop=True)
print(f"Data sampled! Songs in use: {len(df)}")

# Check for numerical features
print("Checking for available numerical features...")
numerical_features = [
    col for col in ["valence", "danceability", "energy", "tempo", 
                    "acousticness", "liveness", "speechiness", "instrumentalness"]
    if col in df.columns
]
print(f"Selected numerical features: {numerical_features}")

# Check if numerical features exist
if not numerical_features:
    raise ValueError("No numerical features found in the dataset!")

# Fill NaN values **only in numerical columns**
print("Filling missing values...")
df[numerical_features] = df[numerical_features].apply(lambda x: x.fillna(x.mean()), axis=0)
print("Missing values filled!")

# Standardize the numerical features
print("Standardizing features...")
scaler = StandardScaler()
df_scaled = pd.DataFrame(scaler.fit_transform(df[numerical_features]), columns=numerical_features)
print("Standardization complete!")

# Apply K-Means Clustering
print("Applying K-Means clustering...")
kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
df["Cluster"] = kmeans.fit_predict(df_scaled)
print("Clustering complete!")

# OPTIONAL: PCA Visualization
print("Performing PCA for visualization...")
pca = PCA(n_components=2)
pca_result = pca.fit_transform(df_scaled)

plt.figure(figsize=(10,8))
plt.scatter(pca_result[:, 0], pca_result[:, 1], c=df["Cluster"], cmap="viridis")
plt.title("K-Means Clusters")
plt.show()

# Recommendation System
def recommend_songs(song_name, df, num_recommendations=5):
    if song_name not in df["song_name"].values:
        print(f"'{song_name}' not found in dataset.")
        return []

    song_cluster = df[df["song_name"] == song_name]["Cluster"].values[0]
    same_cluster_songs = df[df["Cluster"] == song_cluster]

    song_index = same_cluster_songs[same_cluster_songs["song_name"] == song_name].index[0]
    cluster_features = same_cluster_songs[numerical_features]
    similarity = cosine_similarity(cluster_features, cluster_features)

    similar_songs = np.argsort(similarity[song_index])[-(num_recommendations + 1):-1][::-1]
    recommendations = same_cluster_songs.iloc[similar_songs][["song_name", "released_date", "singer"]]

    return recommendations


# Save Final Data
print("Saving clustered data to 'clustered_hindi_songs.csv'...")
df.to_csv("clustered_hindi_songs.csv", index=False)
print("File saved successfully!")

# Test Recommendation System
print(recommend_songs("Main Solah Baras Ki", df))
