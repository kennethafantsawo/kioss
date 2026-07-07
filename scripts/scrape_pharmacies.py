#!/usr/bin/env python3
"""
Scraping des pharmacies de garde au Togo depuis annuairestogo.com
Utilise le CLI z-ai (page_reader) pour contourner la protection DDoS.

Usage:
  python3 scrape_pharmacies.py
"""

import json
import re
import subprocess
import sys
from pathlib import Path

URL = "https://www.annuairestogo.com/liste-pharmacie-de-garde"
OUTPUT = Path("/home/z/my-project/src/server/data/scraped-pharmacies.json")
RAW_HTML = Path("/tmp/annuaire_raw.html")


def fetch_page() -> str:
    """Récupère le HTML via z-ai page_reader."""
    print(f"→ Fetching {URL} via z-ai page_reader...")
    result = subprocess.run(
        [
            "z-ai", "function",
            "-n", "page_reader",
            "-a", json.dumps({"url": URL}),
            "-o", "/tmp/annuaire_zai.json",
        ],
        capture_output=True,
        text=True,
        timeout=60,
    )
    if result.returncode != 0:
        print(f"❌ z-ai failed: {result.stderr}", file=sys.stderr)
        sys.exit(1)

    data = json.load(open("/tmp/annuaire_zai.json"))
    html = data["data"]["html"]
    RAW_HTML.write_text(html)
    print(f"✓ HTML saved ({len(html)} bytes)")
    return html


def extract_pharmacies(html: str) -> list[dict]:
    """
    Extrait les pharmacies depuis le HTML.

    Structure cible (répétée pour chaque pharmacie) :
      <div class="card">
        <h4 class="font-weight-bold">Pharmacie BON SECOURS</h4>
        <p class="text-muted mt-4"><i class="fa fa-home..."></i>Rue du Grand Collège...</p>
        <h6>...(+228) <b>70 45 76 74</b>...</h6>
      </div>

    Certains numéros ont 2 téléphones (séparés par / ou autre).
    """
    pharmacies = []

    # Regex pour trouver chaque carte : on cherche les <h4 class="font-weight-bold">[Pp]harmacie XXX</h4>
    # (insensible à la casse pour attraper "PHARMACIE 2000", "PHARMACIE SAG'BIBA", etc.)
    # Puis on capture l'adresse et le téléphone
    card_pattern = re.compile(
        r'<h4 class="font-weight-bold">((?:Pharmacie|PHARMACIE)[^<]+)</h4>\s*'
        r'<p class="text-muted[^"]*">\s*<i class="fa fa-home[^"]*"></i>\s*([^<]+?)\s*</p>'
        r'.*?'
        r'\(\+228\)\s*<b>([^<]+)</b>',
        re.DOTALL | re.IGNORECASE,
    )

    for match in card_pattern.finditer(html):
        name = match.group(1).strip()
        address = match.group(2).strip()
        phone_raw = match.group(3).strip()

        # Splitter les numéros multiples (séparateurs: / , ; ou espace double)
        # D'abord extraire tous les patterns XX XX XX XX
        phones = re.findall(r'\d{2}\s*\d{2}\s*\d{2}\s*\d{2}', phone_raw)
        # Normaliser les espaces
        phones = [' '.join(p.split()) for p in phones]

        # Slug ID
        slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

        pharmacies.append({
            "id": slug,
            "name": name,
            "address": address,
            "phones": phones,
            "url": f"https://www.annuairestogo.com/sante/pharmacies/{slug}",
        })

    return pharmacies


def main():
    html = fetch_page()
    pharmacies = extract_pharmacies(html)

    print(f"\n✓ {len(pharmacies)} pharmacies extraites:")
    for p in pharmacies:
        print(f"  • {p['name']}")
        print(f"    📍 {p['address']}")
        print(f"    📞 {', '.join(p['phones'])}")
        print()

    # Écrire le fichier JSON
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(pharmacies, f, ensure_ascii=False, indent=2)
    print(f"✓ Fichier écrit: {OUTPUT}")


if __name__ == "__main__":
    main()
