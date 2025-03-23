import cv2

def xor_cipher(data: bytes, password: str) -> bytes:
    """Encrypts or decrypts data using a simple repeating-key XOR cipher."""
    password_bytes = password.encode('utf-8')
    result = bytearray()
    for i in range(len(data)):
        result.append(data[i] ^ password_bytes[i % len(password_bytes)])
    return bytes(result)

def encode_image(password: str, image_path: str, message: str, output_path: str):
    """
    Hides an encrypted message inside the image using LSB steganography.
    """
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Error: Image not found or unable to read.")
    
    message_bytes = message.encode('utf-8')
    encrypted_message = xor_cipher(message_bytes, password)
    
    header = "STEGO".encode('utf-8')
    msg_length_bytes = len(encrypted_message).to_bytes(4, byteorder='big')
    
    data_to_hide = header + msg_length_bytes + encrypted_message

    bit_data = []
    for byte in data_to_hide:
        for i in range(7, -1, -1):
            bit_data.append((byte >> i) & 1)
    
    flat_image = image.flatten()
    if len(bit_data) > flat_image.size:
        raise ValueError("Error: The image is too small to hold the secret message.")
    
    for i, bit in enumerate(bit_data):
        flat_image[i] = (flat_image[i] & 0xFE) | bit
    
    encoded_image = flat_image.reshape(image.shape)
    cv2.imwrite(output_path, encoded_image)

def decode_image(password: str, image_path: str) -> str:
    """
    Extracts and decrypts the hidden message from an image.
    """
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Error: Image not found or unable to read.")
    
    flat_image = image.flatten()
    
    def extract_bytes(start_bit: int, num_bytes: int) -> bytes:
        bits = []
        for i in range(start_bit, start_bit + num_bytes * 8):
            bits.append(flat_image[i] & 1)
        bytes_out = bytearray()
        for i in range(0, len(bits), 8):
            byte = 0
            for j in range(8):
                byte = (byte << 1) | bits[i+j]
            bytes_out.append(byte)
        return bytes(bytes_out)
    
    extracted_header = extract_bytes(0, 5)
    if extracted_header.decode('utf-8') != "STEGO":
        raise ValueError("Error: No hidden message found (header mismatch).")
    
    length_bytes = extract_bytes(5 * 8, 4)
    msg_length = int.from_bytes(length_bytes, byteorder='big')
    
    encrypted_message = extract_bytes((5 + 4) * 8, msg_length)
    
    decrypted_bytes = xor_cipher(encrypted_message, password)
    try:
        message = decrypted_bytes.decode('utf-8')
    except UnicodeDecodeError:
        message = "<Unable to decode message. Possibly the wrong password.>"
    
    return message