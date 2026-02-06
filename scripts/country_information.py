import requests
import json

response = requests.get("https://restcountries.com/v3.1/all")
data = response.json()

countries = []
seen = set()
for country in data:
    name = country['translations']['kor']['common'] if 'kor' in country['translations'] else country['name']['common']
    flag_url = country['flags']['png']
    code = country.get('cca2', '')
    unique_key = f"{name}_{code}"
    if unique_key not in seen and code:
        countries.append({
            "name": name,
            "flag": flag_url,
            "code": code
        })
        seen.add(unique_key)

with open("countries.json", "w", encoding="utf-8") as f:
    json.dump(countries, f, ensure_ascii=False, indent=2)