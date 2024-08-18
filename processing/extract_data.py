import os
import json
from pymongo import MongoClient
from concurrent.futures import ThreadPoolExecutor

store_dir = '../storage/'

# Connect to MongoDB
mongo_uri = 'mongodb://10.0.10.5:27017/'
client = MongoClient(mongo_uri)
db = client['Procesos_Judiciales']
collection = db['procesos_judiciales_raw_2']

# Functions to get the directories and files
def get_dirs(path):
    return [dir for dir in os.listdir(path) if os.path.isdir(os.path.join(path, dir))]

def get_files(path):
    return [file for file in os.listdir(path) if os.path.isfile(os.path.join(path, file))]

def read_json_file(path):
    # Read the JSON file and return the data
    with open(path, 'r') as file:
        return json.load(file)

def clean_data(data):
    # Move the result to the root of the object
    if 'result' in data:
        data = data['result']
    if data.get('causas_actor_scraped') == True:
        data['causas_actor_scraped'] = 0
    if data.get('causas_demandado_scraped') == True:
        data['causas_demandado_scraped'] = 0
    return data

# Process and upload the data to MongoDB
def process_data(file):
    # Read the file
    data = read_json_file(file)
    # Clean data
    data = clean_data(data)
    # Upload to MongoDB
    collection.insert_one(data)
    print(f'File added: {file}')

# Get only the directories that have a file named 'procesos.*'
dirs = [dir for dir in get_dirs(store_dir) if 'procesos' in dir]

def process_directory(dir):
    print(f'Reading files in: {dir}')
    # Get all the files in the directory
    files = get_files(os.path.join(store_dir, dir))
    # Add path to the files
    files = [os.path.join(store_dir, dir, file) for file in files]
    # Process each file in parallel
    with ThreadPoolExecutor() as executor:
        executor.map(process_data, files)

# Process each directory in parallel
with ThreadPoolExecutor() as executor:
    executor.map(process_directory, dirs)

