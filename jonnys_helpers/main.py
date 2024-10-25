import re
import csv

book = "1-nephi"
file_path = 'jonnys_helpers/mytxt.txt'
csv_file_path = 'jonnys_helpers/output.csv'

# Initialize a 2D list to store chapters and verses
bible = []

# Read the file and parse the content
with open(file_path, 'r') as file:
    current_chapter = []
    
    for line in file:
        # Check for a chapter header (assumed to start with a number)
        if line.strip() and line[0].isdigit():
            # If there is a current chapter being processed, add it to the bible list
            if current_chapter:
                bible.append(current_chapter)
                current_chapter = []  # Reset for the next chapter
        # Check if the line starts with a verse (indicated by brackets)
        elif line.strip() and line.startswith('['):
            # Get the verse number
            verse_number = re.findall(r'\[(\d+)\]', line)[0]  # Extract the verse number
            edited_verse = re.sub(r'\[\d+\]\s*', '', line.strip())  # Remove the [verse number]
            current_chapter.append((verse_number, edited_verse))  # Store verse number and text

    # Don't forget to add the last chapter after the loop
    if current_chapter:
        bible.append(current_chapter)

# Create a CSV file with the specified headers
with open(csv_file_path, 'w', newline='') as csv_file:
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow(['book', 'chapter', 'startVerse', 'name', 'quoteText'])  # Write header

    # Populate the CSV with data
    for chapter_index, chapter in enumerate(bible):
        for verse_number, verse in chapter:
            # Find all quotes in the verse
            quotes = re.findall(r'<(.*?)>(.*?)<\/\1>', verse)
            for name, quote_text in quotes:
                csv_writer.writerow([book, chapter_index + 1, verse_number, name, quote_text.strip()])  # Write to CSV
