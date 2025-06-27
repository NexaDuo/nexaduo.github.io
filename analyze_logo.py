#!/usr/bin/env python3

from PIL import Image
from collections import Counter

def rgb_to_hex(rgb):
    """Convert RGB tuple to hex color code"""
    return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

def analyze_logo_colors(image_path):
    """Analyze the main colors in the logo"""
    
    # Open the image
    img = Image.open(image_path)
    
    # Convert to RGB if necessary
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Get all pixels
    pixels = list(img.getdata())
    
    # Remove transparent/white background pixels (assuming white/near-white background)
    # Filter out pixels that are too close to white
    non_bg_pixels = [p for p in pixels if not (p[0] > 240 and p[1] > 240 and p[2] > 240)]
    
    # Filter out pixels that are too close to black (if any)
    non_bg_pixels = [p for p in non_bg_pixels if not (p[0] < 15 and p[1] < 15 and p[2] < 15)]
    
    if len(non_bg_pixels) == 0:
        print("No significant colors found")
        return []
    
    # Count color frequencies
    color_counts = Counter(non_bg_pixels)
    
    # Get the most common colors
    most_common = color_counts.most_common(10)
    
    print("Top colors found in the logo:")
    print("=" * 50)
    
    colors_info = []
    for i, (color, count) in enumerate(most_common):
        hex_color = rgb_to_hex(color)
        percentage = (count / len(non_bg_pixels)) * 100
        print(f"{i+1}. RGB{color} -> {hex_color} ({percentage:.1f}%)")
        colors_info.append({
            'rgb': color,
            'hex': hex_color,
            'count': count,
            'percentage': percentage
        })
    
    return colors_info

def group_similar_colors(colors_info, threshold=30):
    """Group similar colors together"""
    grouped = []
    used = set()
    
    for i, color_info in enumerate(colors_info):
        if i in used:
            continue
            
        rgb = color_info['rgb']
        group = [color_info]
        used.add(i)
        
        # Find similar colors
        for j, other_color_info in enumerate(colors_info[i+1:], i+1):
            if j in used:
                continue
                
            other_rgb = other_color_info['rgb']
            
            # Calculate color distance
            distance = sum((a - b) ** 2 for a, b in zip(rgb, other_rgb)) ** 0.5
            
            if distance < threshold:
                group.append(other_color_info)
                used.add(j)
        
        # Merge the group
        total_count = sum(c['count'] for c in group)
        total_percentage = sum(c['percentage'] for c in group)
        
        # Use the most common color in the group as representative
        representative = max(group, key=lambda x: x['count'])
        
        grouped.append({
            'rgb': representative['rgb'],
            'hex': representative['hex'],
            'total_count': total_count,
            'total_percentage': total_percentage,
            'group_size': len(group)
        })
    
    return grouped

if __name__ == "__main__":
    logo_path = "assets/NexaDuo.png"
    
    print("Analyzing NexaDuo logo colors...")
    print("=" * 50)
    
    colors = analyze_logo_colors(logo_path)
    
    if colors:
        print("\nGrouping similar colors:")
        print("=" * 50)
        
        grouped = group_similar_colors(colors)
        
        print("\nMain color groups:")
        for i, group in enumerate(grouped[:5]):  # Top 5 groups
            print(f"{i+1}. {group['hex']} (RGB{group['rgb']}) - {group['total_percentage']:.1f}% - {group['group_size']} similar colors")
        
        print("\nSuggested CSS color variables:")
        print("=" * 50)
        for i, group in enumerate(grouped[:3]):  # Top 3 for CSS
            var_name = ['primary', 'secondary', 'accent'][i] if i < 3 else f'color{i+1}'
            print(f"--{var_name}-color: {group['hex']};")
