import re
import csv

book = "1-nephi"
file_path = 'jonnys_helpers/mytxt.txt'
csv_file_path = 'jonnys_helpers/output.csv'

def process_file(file_path, book):
    with open(file_path, 'r') as file:
        content = file.read()

    chapters = re.split(r'\n(?=1 Nephi \d+)', content)
    results = []

    for chapter in chapters:
        chapter_lines = chapter.strip().split('\n')
        chapter_num = re.search(r'1 Nephi (\d+)', chapter_lines[0])
        if chapter_num:
            chapter_num = chapter_num.group(1)
        else:
            continue

        current_verse = 0
        open_tag = None
        start_verse = None
        start_word = None
        quote_start_line = None

        for line_num, line in enumerate(chapter_lines[1:], 1):
            verse_match = re.match(r'\[(\d+)\]', line)
            if verse_match:
                current_verse = int(verse_match.group(1))
                line = re.sub(r'^\[\d+\]\s*', '', line)

            words = line.split()
            for i, word in enumerate(words):
                if open_tag:
                    if f'</{open_tag}>' in word:
                        end_word = i + 1
                        results.append({
                            'who': open_tag.lower(),
                            'book': book,
                            'chapter': chapter_num,
                            'startVerse': start_verse,
                            'endVerse': current_verse,
                            'startWord': start_word,
                            'endWord': end_word
                        })
                        open_tag = None
                        quote_start_line = None
                else:
                    match = re.match(r'<(\w+)>', word)
                    if match:
                        open_tag = match.group(1)
                        start_verse = current_verse
                        start_word = i + 1
                        quote_start_line = line_num

    return results

def write_csv(data, csv_file_path):
    with open(csv_file_path, 'w', newline='') as csvfile:
        fieldnames = ['who', 'book', 'chapter', 'startVerse', 'endVerse', 'startWord', 'endWord']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for row in data:
            writer.writerow(row)

# Main execution
results = process_file(file_path, book)
write_csv(results, csv_file_path)

print(f"CSV file has been generated at {csv_file_path}")
