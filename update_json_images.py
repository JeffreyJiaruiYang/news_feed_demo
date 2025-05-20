import json
import re
import os

# replace with the actual filenames
input_filename = 'news_feed.json'
output_filename = 'news_updated.json'

# Default dimensions if parsing fails
default_width = 600
default_height = 400

# Regex to capture dimensions from various placeholder services
# (W/H) or (WxH)
dimension_regexes = [
    re.compile(r'placeimg\.com/(\d+)/(\d+)'),
    re.compile(r'placekitten\.com/(?:g/)?(\d+)/(\d+)'),
    re.compile(r'picsum\.photos/(?:seed/[^/]+/)?(\d+)/(\d+)'),
    re.compile(r'dummyimage\.com/(\d+)x(\d+)'),
    re.compile(r'lorempixel\.com/(?:[a-z]+/)?(\d+)/(\d+)') # Handles lorempixel.com/W/H and lorempixel.com/gray/W/H
]
# configure the path
script_dir = os.path.dirname(os.path.abspath(__file__))
input_filepath = os.path.join(script_dir, input_filename)
output_filepath = os.path.join(script_dir, output_filename)

with open(input_filepath, 'r', encoding='utf-8') as f:
    news_data = json.load(f)

modified_count = 0
for article in news_data['articles']:

    current_image_url = article.get('image')
    width = default_width
    height = default_height
    for regex in dimension_regexes:
        match = regex.search(current_image_url)
        if match:
            try:
                parsed_w = int(match.group(1))
                parsed_h = int(match.group(2))
                width = parsed_w
                height = parsed_h
                break 
            except ValueError:
                # Should not happen if regex matches digits, but good practice
                print(f"Could not parse dimensions. Using defaults.")
                pass # Stick to defaults
    
    # Update the image URL
    article['image'] = f"https://picsum.photos/seed/article{article['id']}/{width}/{height}"
    modified_count += 1

with open(output_filepath, 'w', encoding='utf-8') as f:
    json.dump(news_data, f, indent=2, ensure_ascii=False) # indent=2 for pretty printing

print(f"Successfully processed {modified_count} articles.")
print(f"Updated data saved to: {output_filepath}")