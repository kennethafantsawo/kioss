#!/usr/bin/env python3
"""
Génère une image Open Graph 1200x630 pour le partage social.
"""
from PIL import Image, ImageDraw, ImageFont

# Dimensions standard Open Graph
WIDTH, HEIGHT = 1200, 630

# Couleurs (cohérentes avec le thème emerald)
BG_TOP = (4, 120, 87)        # emerald-700
BG_BOTTOM = (15, 118, 110)   # teal-800
WHITE = (255, 255, 255)
AMBER = (251, 191, 36)       # amber-400

# Créer le dégradé
img = Image.new('RGB', (WIDTH, HEIGHT), BG_TOP)
draw = ImageDraw.Draw(img)

# Dégradé vertical
for y in range(HEIGHT):
    ratio = y / HEIGHT
    r = int(BG_TOP[0] + (BG_BOTTOM[0] - BG_TOP[0]) * ratio)
    g = int(BG_TOP[1] + (BG_BOTTOM[1] - BG_TOP[1]) * ratio)
    b = int(BG_TOP[2] + (BG_BOTTOM[2] - BG_TOP[2]) * ratio)
    draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

# Cercles décoratifs (effet bubble)
draw.ellipse([850, -150, 1250, 250], fill=(255, 255, 255, 30))
draw.ellipse([100, 400, 350, 700], fill=(255, 255, 255, 30))
draw.ellipse([900, 350, 1100, 550], fill=(255, 255, 255, 30))

# Charger une police grasse
font_paths = [
    '/usr/share/fonts/truetype/chinese/NotoSansSC-Regular.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
]
font_bold_path = next((p for p in font_paths if __import__('os').path.exists(p)), None)

font_title = ImageFont.truetype(font_bold_path, 88) if font_bold_path else ImageFont.load_default()
font_subtitle = ImageFont.truetype(font_bold_path, 44) if font_bold_path else ImageFont.load_default()
font_badge = ImageFont.truetype(font_bold_path, 32) if font_bold_path else ImageFont.load_default()

# Badge "24h/24 · 7j/7"
badge_text = "24h/24 · 7j/7"
bbox = draw.textbbox((0, 0), badge_text, font=font_badge)
badge_w = bbox[2] - bbox[0] + 40
badge_h = bbox[3] - bbox[1] + 24
badge_x = 80
badge_y = 80
draw.rounded_rectangle(
    [badge_x, badge_y, badge_x + badge_w, badge_y + badge_h],
    radius=badge_h // 2,
    fill=AMBER,
)
draw.text(
    (badge_x + 20, badge_y + 8),
    badge_text,
    fill=BG_TOP,
    font=font_badge,
)

# Titre principal
title_y = 220
draw.text((80, title_y), "Pharmacies", fill=WHITE, font=font_title)
draw.text((80, title_y + 100), "de Garde", fill=WHITE, font=font_title)

# Sous-titre
draw.text((80, title_y + 240), "Togo · 48 pharmacies répertoriées", fill=AMBER, font=font_subtitle)

# Icône croix de pharmacie stylisée à droite
cx, cy = 950, 315
# Cadre blanc
draw.rounded_rectangle(
    [cx - 110, cy - 110, cx + 110, cy + 110],
    radius=30,
    fill=WHITE,
)
# Croix verte
cross_w = 40
cross_h = 160
draw.rectangle(
    [cx - cross_w // 2, cy - cross_h // 2, cx + cross_w // 2, cy + cross_h // 2],
    fill=BG_TOP,
)
draw.rectangle(
    [cx - cross_h // 2, cy - cross_w // 2, cx + cross_h // 2, cy + cross_w // 2],
    fill=BG_TOP,
)

# Pied de page
footer_text = "Appel · SMS · WhatsApp · Google Maps"
bbox = draw.textbbox((0, 0), footer_text, font=font_subtitle)
footer_w = bbox[2] - bbox[0]
draw.text(((WIDTH - footer_w) // 2, HEIGHT - 80), footer_text, fill=WHITE, font=font_subtitle)

# Sauvegarder
output_path = '/home/z/my-project/public/icons/og-image.png'
img.save(output_path, 'PNG', optimize=True)
print(f"✓ OG image saved: {output_path}")
print(f"  Dimensions: {WIDTH}x{HEIGHT}")
