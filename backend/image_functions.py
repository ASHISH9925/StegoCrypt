import cv2
import numpy as np

def image_to_bits(image_path, output_txt_file):
    img = cv2.imread(image_path)
    
    # Get image dimensions
    if len(img.shape) == 3:
        h, w, c = img.shape
    else:
        h, w = img.shape
        c = 1  # Grayscale
    
    # Convert image to 1D array of bytes
    byte_array = img.flatten()
    
    # Convert bytes to binary string (8 bits per byte)
    bin_str = ''.join(format(byte, '08b') for byte in byte_array)
    
    # Save dimensions and binary string to file
    with open(output_txt_file, 'w') as f:
        f.write(f"{h},{w},{c}\n")
        f.write(bin_str)

def bits_to_image(input_txt_file, output_image_path):
    # Read data from file
    with open(input_txt_file, 'r') as f:
        lines = f.readlines()
    
    # Get image dimensions from first line
    h, w, c = map(int, lines[0].strip().split(','))
    
    # Get binary string from second line
    bin_str = lines[1].strip()
    
    # Convert binary string to byte array
    byte_array = np.array([int(bin_str[i:i+8], 2) for i in range(0, len(bin_str), 8)], dtype=np.uint8)
    
    # Reshape to original dimensions
    if c == 1:
        img = byte_array.reshape(h, w)
    else:
        img = byte_array.reshape(h, w, c)

    # Save reconstructed image
    cv2.imwrite(output_image_path, img)
