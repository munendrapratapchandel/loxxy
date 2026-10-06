import zlib
import struct
import os

def create_png(width, height, rgba_data, output_path):
    # PNG signature
    png = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png += struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # IDAT chunk (scanlines with filter byte 0)
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # filter type 0: None
        for x in range(width):
            idx = (y * width + x) * 4
            raw_data.extend(rgba_data[idx:idx+4])
            
    compressed = zlib.compress(bytes(raw_data))
    idat_crc = zlib.crc32(b'IDAT' + compressed)
    png += struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND')
    png += struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'wb') as f:
        f.write(png)
    print(f"Generated skin: {output_path}")

def make_skin_pixels(theme_primary, theme_secondary, theme_dark, skin_tone=(215, 170, 130)):
    # 64x64 RGBA buffer
    pixels = bytearray([0] * (64 * 64 * 4))
    
    def set_pixel(x, y, r, g, b, a=255):
        if 0 <= x < 64 and 0 <= y < 64:
            idx = (y * 64 + x) * 4
            pixels[idx] = r
            pixels[idx+1] = g
            pixels[idx+2] = b
            pixels[idx+3] = a
            
    def fill_rect(x1, y1, w, h, r, g, b, a=255):
        for y in range(y1, y1 + h):
            for x in range(x1, x1 + w):
                set_pixel(x, y, r, g, b, a)

    # Standard Minecraft 1.8 64x64 skin layout:
    # Head: (8..16, 0..8) top/bot; (0..32, 8..16) face/sides
    # Head Front: x=8..15, y=8..15
    fill_rect(8, 8, 8, 8, *skin_tone)
    # Hair / Helmet
    fill_rect(8, 8, 8, 3, *theme_dark)
    fill_rect(8, 8, 2, 8, *theme_dark)
    fill_rect(14, 8, 2, 8, *theme_dark)
    # Glowing Eyes
    set_pixel(10, 12, *theme_secondary)
    set_pixel(13, 12, *theme_secondary)
    
    # Head Top: x=8..15, y=0..7
    fill_rect(8, 0, 8, 8, *theme_dark)
    # Head Back: x=24..31, y=8..15
    fill_rect(24, 8, 8, 8, *theme_dark)
    # Head Right: x=0..7, y=8..15
    fill_rect(0, 8, 8, 8, *theme_dark)
    # Head Left: x=16..23, y=8..15
    fill_rect(16, 8, 8, 8, *theme_dark)

    # Torso Front: x=20..27, y=20..31
    fill_rect(20, 20, 8, 12, *theme_primary)
    # Neon core/cross on chest
    fill_rect(23, 22, 2, 6, *theme_secondary)
    fill_rect(21, 24, 6, 2, *theme_secondary)
    # Belt:
    fill_rect(20, 30, 8, 2, *theme_dark)
    
    # Torso Back: x=32..39, y=20..31
    fill_rect(32, 20, 8, 12, *theme_primary)
    fill_rect(34, 23, 4, 6, *theme_secondary)
    
    # Right Arm: Front x=44..47, y=20..31
    fill_rect(44, 20, 4, 7, *theme_primary)
    fill_rect(44, 27, 4, 5, *theme_dark)
    # Right Arm Sides & Back
    fill_rect(40, 20, 16, 12, *theme_primary)

    # Left Arm: Front x=36..39, y=52..63
    fill_rect(36, 52, 4, 7, *theme_primary)
    fill_rect(36, 59, 4, 5, *theme_dark)
    # Left Arm All
    fill_rect(32, 52, 16, 12, *theme_primary)

    # Right Leg: Front x=4..7, y=20..31
    fill_rect(4, 20, 4, 7, *theme_dark)
    fill_rect(4, 27, 4, 5, *theme_secondary)
    fill_rect(0, 20, 16, 12, *theme_dark)

    # Left Leg: Front x=20..23, y=52..63
    fill_rect(20, 52, 4, 7, *theme_dark)
    fill_rect(20, 59, 4, 5, *theme_secondary)
    fill_rect(16, 52, 16, 12, *theme_dark)
    
    return bytes(pixels)

if __name__ == '__main__':
    # Professorx: Purple, Cyan, Obsidian
    px = make_skin_pixels((139, 92, 246), (0, 245, 255), (20, 22, 35))
    create_png(64, 64, px, 'public/skins/professorx.png')

    # Valkyrie: Crimson Pink, Gold, Midnight
    valk = make_skin_pixels((236, 72, 153), (251, 191, 36), (18, 12, 28))
    create_png(64, 64, valk, 'public/skins/valkyrie.png')

    # Zephyr: Cyan, Emerald, Slate
    zeph = make_skin_pixels((14, 165, 233), (16, 185, 129), (15, 23, 42))
    create_png(64, 64, zeph, 'public/skins/zephyr.png')

    # Classic Steve / Adventurer
    steve = make_skin_pixels((3, 105, 161), (14, 165, 233), (67, 56, 202), (219, 172, 120))
    create_png(64, 64, steve, 'public/skins/steve.png')
