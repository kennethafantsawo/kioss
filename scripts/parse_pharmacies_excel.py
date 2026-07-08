#!/usr/bin/env python3
"""
Parse le fichier Excel officiel du tour de garde des pharmacies du Togo.
Le fichier contient une liste de pharmacies organisée par semaine de garde.

Source : Ministère de la Santé du Togo - Direction de la Pharmacie, du Médicament
         et des Laboratoires
Période : 06 juillet 2026 au 04 janvier 2027
"""

import json
import re
from pathlib import Path
import openpyxl

INPUT_FILE = "/home/z/my-project/upload/TDG Des Pharmacies Du 06 Juiellet 2026 Au 04 Janvier 2027.xlsx"
OUTPUT_JSON = "/home/z/my-project/src/server/data/scraped-pharmacies.json"


def parse_excel():
    wb = openpyxl.load_workbook(INPUT_FILE, data_only=True)
    ws = wb["F1 (3)"]

    # Pattern pour détecter un en-tête de semaine (ex: "06/07/2026 au 13/07/2026")
    week_pattern = re.compile(r"(\d{2}/\d{2}/\d{4})\s+au\s+(\d{2}/\d{2}/\d{4})")

    # Pattern pour détecter un numéro de téléphone (8 chiffres, espaces possibles)
    phone_pattern = re.compile(r"\b\d{2}\s*\d{2}\s*\d{2}\s*\d{2}\b")

    # Pattern pour ignorer les en-têtes et séparateurs
    skip_words = {
        "PHARMACIES", "EMPLACEMENTS", "TELEPHONES", "PHARMACIE",
        "REPUBLIQUE", "MINISTERE", "SECRETARIAT", "DIRECTION",
        "---------------", "TOUR", "TOGO",
    }

    pharmacies = []
    current_week_start = None
    current_week_end = None
    seen_names = set()  # Pour dédupliquer

    for row in ws.iter_rows(values_only=True):
        if not row:
            continue

        # Colonnes : [PHARMACIES, EMPLACEMENTS, TELEPHONE_1, TELEPHONE_2]
        col_a = str(row[0]).strip() if row[0] else ""
        col_b = str(row[1]).strip() if row[1] else ""
        col_c = str(row[2]).strip() if row[2] else ""
        col_d = str(row[3]).strip() if row[3] else ""

        # Détecter un en-tête de semaine
        week_match = week_pattern.search(col_b)
        if week_match:
            current_week_start = week_match.group(1)
            current_week_end = week_match.group(2)
            continue

        # Ignorer les en-têtes de colonnes et le texte administratif
        if col_a.upper() in skip_words:
            continue
        if not col_a or col_a.startswith("No"):
            continue
        # Ignorer les lignes de séparation et le titre
        if "TOUR DE GARDE" in col_a.upper() or "DU 06 JUILLET" in col_a.upper():
            continue

        # Une pharmacie valide a un nom + une adresse
        if not col_a or not col_b:
            continue

        name = col_a.strip()
        address = col_b.strip()

        # Ignorer si c'est encore du texte administratif
        if any(skip in name.upper() for skip in ["MINISTERE", "DIRECTION", "SECRETARIAT", "REPUBLIQUE"]):
            continue

        # Extraire les numéros de téléphone
        phones = []
        for col in [col_c, col_d]:
            # Filtrer les cellules vides ou contenant juste un espace
            if col and col.strip() and col.strip() != " ":
                matches = phone_pattern.findall(col)
                for m in matches:
                    # Normaliser : "22 21 00 97" -> "22 21 00 97"
                    normalized = " ".join(m.split())
                    if normalized not in phones:
                        phones.append(normalized)

        # Slug ID : minuscule + tirets
        slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")

        # Éviter les doublons (certaines pharmacies apparaissent sur plusieurs semaines)
        # On garde la première occurrence avec sa semaine de garde
        if slug in seen_names:
            continue
        seen_names.add(slug)

        pharmacies.append({
            "id": slug,
            "name": name,
            "address": address,
            "phones": phones,
            "url": f"https://www.annuairestogo.com/sante/pharmacies/{slug}",
            "gardeWeekStart": current_week_start,
            "gardeWeekEnd": current_week_end,
        })

    return pharmacies


def main():
    print("→ Parsing du fichier Excel officiel...")
    pharmacies = parse_excel()

    print(f"\n✓ {len(pharmacies)} pharmacies extraites")
    print("\n--- Aperçu (10 premières) ---")
    for p in pharmacies[:10]:
        print(f"  • {p['name']}")
        print(f"    📍 {p['address']}")
        print(f"    📞 {', '.join(p['phones'])}")
        if p['gardeWeekStart']:
            print(f"    📅 Semaine : {p['gardeWeekStart']} → {p['gardeWeekEnd']}")
        print()

    print("\n--- Aperçu (5 dernières) ---")
    for p in pharmacies[-5:]:
        print(f"  • {p['name']} — {p['phones']}")

    # Écrire le JSON
    output_path = Path(OUTPUT_JSON)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(pharmacies, f, ensure_ascii=False, indent=2)
    print(f"\n✓ Fichier écrit: {OUTPUT_JSON}")

    # Stats
    with_phones = sum(1 for p in pharmacies if p['phones'])
    with_week = sum(1 for p in pharmacies if p['gardeWeekStart'])
    multi_phones = sum(1 for p in pharmacies if len(p['phones']) > 1)
    print(f"\n--- Stats ---")
    print(f"  Total pharmacies: {len(pharmacies)}")
    print(f"  Avec téléphone: {with_phones}")
    print(f"  Avec 2+ téléphones: {multi_phones}")
    print(f"  Avec semaine de garde: {with_week}")


if __name__ == "__main__":
    main()
