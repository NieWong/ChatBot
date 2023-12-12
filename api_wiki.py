# api_wiki.py

import requests

def get_wikipedia_summary(title, lang='en'):
    base_url = 'https://{lang}.wikipedia.org/w/api.php'.format(lang=lang)
    params = {
        'action': 'query',
        'format': 'json',
        'prop': 'extracts',
        'exintro': True,
        'titles': title,
    }

    response = requests.get(base_url, params=params)
    data = response.json()

    pages = data['query']['pages']
    page_id = next(iter(pages))
    if 'extract' in pages[page_id]:
        return pages[page_id]['extract']
    else:
        return "No information found."
