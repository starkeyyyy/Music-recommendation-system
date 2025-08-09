import unittest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class TestDatasetLoading(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome(options=Options().add_argument('headless'))

    def test_dataset_loading(self):
        self.driver.get('http://localhost:8000')
        self.driver.find_element_by_tag_name('body')
        df = pd.read_csv('Hindi_songs.csv')
        self.assertEqual(len(df), self.driver.execute_script('return document.body.children.length'))

        df = df.sample(n=min(1000, len(df)), random_state=42).reset_index(drop=True)
        self.assertEqual(len(df), min(1000, self.driver.execute_script('return document.body.children.length')))

    def tearDown(self):
        self.driver.quit()

if __name__ == '__main__':
    unittest.main()