# from flask import Flask, request, jsonify
# import tensorflow as tf
# import numpy as np
# from PIL import Image
# import io

# app = Flask(__name__)
# model = tf.keras.models.load_model("model.h5")  # Load model

# @app.route("/predict", methods=["POST"])
# def predict():
#     file = request.files["image"]
#     image = Image.open(io.BytesIO(file.read())).resize((224, 224))  # Resize image
#     image = np.array(image) / 255.0  # Normalize
#     image = np.expand_dims(image, axis=0)
    
#     prediction = model.predict(image)
#     return jsonify({"prediction": prediction.tolist()})

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000)
