from flask import Flask, make_response, request, jsonify, send_from_directory, send_file
from backend.aes_image import encrypt_image as aes_encrypt, decrypt_image as aes_decrypt
from backend.triple_des import encrypt_image as des_encrypt, decrypt_image as des_decrypt
from backend.lsb_stegno import encode_image as lsb_encode, decode_image as lsb_decode
from backend.chaos_based_image import scramble_image, decrypt_image
import os
import numpy as np
import zipfile
from io import BytesIO
from flask_cors import CORS

app = Flask(__name__, static_folder="frontend/dist", static_url_path="/")
CORS(app)  # Enable Flask-CORS for general usage

@app.route("/")
def serve_frontend():
    print("recieved cat")
    return send_from_directory("frontend/dist", "index.html")

@app.route("/<path:path>")
def serve_static_files(path):
    return send_from_directory("frontend/dist", path)

@app.route('/static/<path:filename>')
def download_file(filename):
    return send_from_directory('static', filename, as_attachment=True)

@app.route('/encrypt/aes', methods=['POST'])
def encrypt_aes():
    try:
        file = request.files['image']
        file_path = os.path.join('static', file.filename)
        file.save(file_path)
        
        result = aes_encrypt(file_path)
        os.remove(file_path)
        
        return jsonify({
            "output_file": f"/static/{os.path.basename(result['output_file'])}",
            "key": result["key"].hex()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/decrypt/aes', methods=['POST'])
def decrypt_aes():
    try:
        key = bytes.fromhex(request.form['key'])
        encrypted_file = request.files['encrypted_file']
        static_dir = 'static'
        
        # Ensure the static directory exists
        if not os.path.exists(static_dir):
            os.makedirs(static_dir)
        
        encrypted_file_path = os.path.join(static_dir, encrypted_file.filename)
        encrypted_file.save(encrypted_file_path)
        
        result = aes_decrypt(encrypted_file_path, key)
        os.remove(encrypted_file_path)
        
        return send_file(result["reconstructed_image"], as_attachment=True, mimetype='image/jpeg')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/encrypt/des', methods=['POST'])
def encrypt_des():
    try:
        file = request.files['image']
        file_path = os.path.join('static', file.filename)
        file.save(file_path)
        
        result = des_encrypt(file_path)
        os.remove(file_path)
        
        return jsonify({
            "output_file": f"/static/{os.path.basename(result['output_file'])}",
            "key": result["key"].hex()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/decrypt/des', methods=['POST'])
def decrypt_des():
    try:
        key = bytes.fromhex(request.form['key'])
        encrypted_file = request.files['encrypted_file']
        static_dir = 'static'
        
        # Ensure the static directory exists
        if not os.path.exists(static_dir):
            os.makedirs(static_dir)
        
        encrypted_file_path = os.path.join(static_dir, encrypted_file.filename)
        encrypted_file.save(encrypted_file_path)
        
        result = des_decrypt(encrypted_file_path, key)
        os.remove(encrypted_file_path)
        
        return send_file(result["reconstructed_image"], as_attachment=True, mimetype='image/jpeg')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/encode/lsb', methods=['POST'])
def encode_lsb():
    try:
        file = request.files['image']
        file_path = os.path.join('static', file.filename)
        file.save(file_path)
        
        message = request.form['message']
        password = request.form['password']
        output_path = os.path.join('static', 'encoded_image.png')
        
        lsb_encode(password, file_path, message, output_path)
        os.remove(file_path)
        
        return jsonify({"output_file": f"/static/{os.path.basename(output_path)}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/decode/lsb', methods=['POST'])
def decode_lsb():
    try:
        file = request.files['image']
        file_path = os.path.join('static', file.filename)
        file.save(file_path)
        
        password = request.form['password']
        message = lsb_decode(password, file_path)
        os.remove(file_path)
        
        return jsonify({"message": message})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/scramble/chaos', methods=['POST'])
def scramble_chaos():
    try:
        file = request.files['image']
        file_path = os.path.join('static', file.filename)
        file.save(file_path)
        
        output_path = os.path.join('static', 'scrambled_image.png')
        scramble_order_path = os.path.join('static', 'scramble_order.txt')
        scramble_image(file_path, output_path, scramble_order_path)
        os.remove(file_path)
        
        # Create a ZIP file containing both the scrambled image and the scramble order file
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
            zip_file.write(output_path, os.path.basename(output_path))
            zip_file.write(scramble_order_path, os.path.basename(scramble_order_path))
        
        os.remove(output_path)
        os.remove(scramble_order_path)
        
        zip_buffer.seek(0)
        return send_file(zip_buffer,
                         as_attachment=True,
                         download_name='scrambled_image_and_order.zip',
                         mimetype='application/zip')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/decrypt/chaos', methods=['POST'])
def decrypt_chaos():
    try:
        file = request.files['image']
        file_path = os.path.join('static', file.filename)
        file.save(file_path)
        
        scramble_order_file = request.files['scramble_order_file']
        scramble_order_path = os.path.join('static', scramble_order_file.filename)
        scramble_order_file.save(scramble_order_path)
        
        output_path = os.path.join('static', 'decrypted_image.png')
        decrypt_image(file_path, scramble_order_path, output_path)
        os.remove(file_path)
        os.remove(scramble_order_path)
        
        return send_file(output_path, as_attachment=True, mimetype='image/png')
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
