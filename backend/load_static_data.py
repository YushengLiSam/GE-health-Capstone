import json
import mysql.connector

# Load data from JSON file
with open('Categories.json', encoding='utf-8-sig') as f:
    data = json.load(f)

# Connect to MySQL
db = mysql.connector.connect(
    host="localhost",
    user="annotation_user",
    password="",
    database="static_categories"
)
cursor = db.cursor()

# Insert categories, subcategories, and datapoints
for category in data['categories']:
    # Insert category
    cursor.execute("INSERT IGNORE INTO categories (name) VALUES (%s)", (category['name'],))
    category_id = cursor.lastrowid or cursor.execute("SELECT id FROM categories WHERE name = %s", (category['name'],)).fetchone()[0]

    for subcategory in category['subcategories']:
        # Insert subcategory
        cursor.execute("INSERT IGNORE INTO subcategories (name, category_id) VALUES (%s, %s)", (subcategory['name'], category_id))
        subcategory_id = cursor.lastrowid or cursor.execute("SELECT id FROM subcategories WHERE name = %s AND category_id = %s", (subcategory['name'], category_id)).fetchone()[0]

        for datapoint in subcategory['datapoints']:
            # Insert datapoint
            cursor.execute("""
                INSERT IGNORE INTO datapoints (name, subcategory_id, data_type, inputType, is_mandatory, listItems)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                datapoint['name'],
                subcategory_id,
                datapoint['datatype'],
                datapoint['inputType'],
                datapoint['isMandatory'],
                json.dumps(datapoint.get('listItems', []))  # Convert listItems to JSON format
            ))

# Commit and close
db.commit()
cursor.close()
db.close()

