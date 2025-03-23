import numpy as np
import cv2

def logistic_map(x, r=3.9):
    return r * x * (1 - x)

def generate_chaotic_sequence(rows, cols, r=3.9, x0=0.5):
    sequence = []
    x = x0
    for _ in range(rows * cols):
        x = logistic_map(x, r)
        sequence.append(x)
    return np.array(sequence)

def scramble_image(image_path, output_path, scramble_order_path, r=3.9, x0=0.5):
    img = cv2.imread(image_path)
    rows, cols, channels = img.shape

    flat_sequence = generate_chaotic_sequence(rows, cols, r, x0)
    flat_img = img.reshape(-1, channels)
    scramble_order = np.argsort(flat_sequence)
    scrambled_img = flat_img[scramble_order].reshape(rows, cols, channels)

    cv2.imwrite(output_path, scrambled_img)
    np.savetxt(scramble_order_path, scramble_order, fmt='%d')
    return scramble_order_path

def decrypt_image(scrambled_image_path, scramble_order_path, output_path, r=3.9, x0=0.5):
    scrambled_img = cv2.imread(scrambled_image_path)
    rows, cols, channels = scrambled_img.shape

    scramble_order = np.loadtxt(scramble_order_path, dtype=int)
    flat_scrambled_img = scrambled_img.reshape(-1, channels)
    decrypt_order = np.argsort(scramble_order)
    decrypted_img = flat_scrambled_img[decrypt_order].reshape(rows, cols, channels)

    cv2.imwrite(output_path, decrypted_img)