from Crypto.Cipher import DES3
from Crypto.Util.Padding import pad, unpad
import secrets
from .image_functions import image_to_bits, bits_to_image
import os

def perform_3des(data, key):
    cipher = DES3.new(key, DES3.MODE_CBC)
    ciphertext = cipher.encrypt(pad(data, DES3.block_size))
    iv = cipher.iv
    return iv + ciphertext

def encrypt_image(input_image):
    image_to_bits(input_image, "static/image_bits.txt")
    input_binImage = "static/image_bits.txt"
    output_encrypted_path = "static/encrypted.bin"
    
    key = secrets.token_bytes(24)
    
    with open(input_binImage, "rb") as image, open(output_encrypted_path, "wb") as encrypted:
        dimensions = image.readline()
        encrypted.write(dimensions)
        
        data = image.read()
        encrypted_data = perform_3des(data, key)
        encrypted.write(encrypted_data)
        
    if os.path.exists("static/image_bits.txt"):
        os.remove("static/image_bits.txt")
    
    return {"output_file": output_encrypted_path, "key": key}

def decrypt_image(input_encrypted_path, key):
    output_decrypted_path = "static/decrypted.txt"

    with open(input_encrypted_path, "rb") as encrypted, open(output_decrypted_path, "wb") as decrypted:
        dimensions = encrypted.readline()
        decrypted.write(dimensions)
        
        encrypted_data = encrypted.read()
        iv = encrypted_data[:8]
        ciphertext = encrypted_data[8:]
        
        cipher = DES3.new(key, DES3.MODE_CBC, iv)
        decrypted_data = unpad(cipher.decrypt(ciphertext), DES3.block_size)
        decrypted.write(decrypted_data)
        
        bits_to_image(output_decrypted_path, "static/reconstructed_image.jpg")
        
    return {"reconstructed_image": "static/reconstructed_image.jpg"}