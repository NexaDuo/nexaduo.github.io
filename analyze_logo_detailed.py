#!/usr/bin/env python3

from PIL import Image
from collections import Counter

def rgb_to_hex(rgb):
    """Convert RGB tuple to hex color code"""
    return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

def analyze_logo_colors_expanded(image_path):
    """Analyze all colors in the logo with less filtering"""
    
    # Open the image
    img = Image.open(image_path)
    
    # Convert to RGBA to handle transparency
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Get all pixels
    pixels = list(img.getdata())
    
    print(f"Total pixels: {len(pixels)}")
    
    # Filter out fully transparent pixels
    non_transparent = [p for p in pixels if p[3] > 128]  # Alpha > 128
    print(f"Non-transparent pixels: {len(non_transparent)}")
    
    # Convert back to RGB
    rgb_pixels = [(p[0], p[1], p[2]) for p in non_transparent]
    
    # Filter out near-white pixels (background)
    non_white = [p for p in rgb_pixels if not (p[0] > 250 and p[1] > 250 and p[2] > 250)]
    print(f"Non-white pixels: {len(non_white)}")
    
    # Count color frequencies
    color_counts = Counter(non_white)
    
    # Get the most common colors
    most_common = color_counts.most_common(20)
    
    print("\nTop 20 colors found in the logo:")
    print("=" * 60)
    
    colors_info = []
    for i, (color, count) in enumerate(most_common):
        hex_color = rgb_to_hex(color)
        percentage = (count / len(non_white)) * 100
        print(f"{i+1:2d}. RGB{color} -> {hex_color} ({percentage:5.1f}%) [{count:6d} pixels]")
        colors_info.append({
            'rgb': color,
            'hex': hex_color,
            'count': count,
            'percentage': percentage
        })
    
    # Look for distinct color families
    print("\nAnalyzing color families:")
    print("=" * 60)
    
    blues = [c for c in colors_info if c['rgb'][2] > c['rgb'][0] and c['rgb'][2] > c['rgb'][1]]
    purples = [c for c in colors_info if c['rgb'][0] > c['rgb'][1] and c['rgb'][2] > c['rgb'][1]]
    greens = [c for c in colors_info if c['rgb'][1] > c['rgb'][0] and c['rgb'][1] > c['rgb'][2]]
    
    print(f"Blue-ish colors: {len(blues)}")
    print(f"Purple-ish colors: {len(purples)}")
    print(f"Green-ish colors: {len(greens)}")
    
    return colors_info

if __name__ == "__main__":
    logo_path = "assets/NexaDuo.png"
    
    print("Analyzing NexaDuo logo colors (expanded analysis)...")
    print("=" * 60)
    
    colors = analyze_logo_colors_expanded(logo_path)
