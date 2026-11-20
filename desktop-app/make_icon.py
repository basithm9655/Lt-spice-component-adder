from PIL import Image, ImageDraw

def create_icon():
    # Create a 256x256 transparent image
    img = Image.new('RGBA', (256, 256), color=(0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw dark blue rounded background
    draw.rounded_rectangle([16, 16, 240, 240], radius=40, fill="#0a0a18", outline="#1d4ed8", width=8)
    
    # Draw lightning bolt in bright blue
    bolt_points = [135, 50, 170, 140, 140, 140, 155, 210, 85, 120, 120, 120]
    draw.polygon(bolt_points, fill="#38bdf8")
    
    # Draw some circuit nodes
    draw.ellipse([50, 50, 80, 80], fill="#1e3a8a", outline="#60a5fa", width=4)
    draw.ellipse([180, 180, 210, 210], fill="#1e3a8a", outline="#60a5fa", width=4)
    draw.line([65, 65, 120, 120], fill="#60a5fa", width=8)
    
    # Save as ICO
    img.save("icon.ico", format="ICO", sizes=[(256, 256), (128, 128), (64, 64), (32, 32), (16, 16)])
    print("icon.ico created successfully.")

if __name__ == "__main__":
    create_icon()
