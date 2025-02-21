import torch
from torchvision import models
from torchvision import transforms
from torchvision.transforms import ToTensor
from timeit import default_timer as timer
from typing import Tuple, Dict
import random
from pathlib import Path
import matplotlib.pyplot as plt
from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader
from torchvision.models import efficientnet_b0
import gradio as gr
from flask import Flask, render_template, Response
import cv2
from PIL import Image
device ='cuda' if torch.cuda.is_available() else 'cpu'

val_transforms = transforms.Compose([
    transforms.Resize((224, 224)),  # Resize images to 224x224
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

class_names=['Battery', 'Keyboard', 'Microwave', 'Mobile', 'Mouse', 'PCB', 'Player', 'Printer', 'Television', 'Washing Machine']

def preprocess_image(image_path=None, image_file=None):
    """
    Preprocesses an image for EfficientNet model evaluation.

    Args:
        image_path (str, optional): Path to the image file.
        image_file (PIL.Image, optional): Image file loaded using PIL.

    Returns:
        torch.Tensor: Preprocessed image tensor of shape (1, 3, 224, 224).
    """
    # Ensure either image_path or image_file is provided
    if image_path is None and image_file is None:
        raise ValueError("Either image_path or image_file must be provided.")

    # Load the image
    if image_path:
        image = Image.open(image_path).convert("RGB")  # Ensure image is in RGB format
    else:
        image = image_file.convert("RGB")  # Ensure image is in RGB format

    # Define the validation transforms
    val_transforms = transforms.Compose([
        transforms.Resize((224, 224)),  # Resize to EfficientNet input size
        transforms.ToTensor(),  # Convert to tensor
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])  # Normalize
    ])

    # Apply the transforms
    image_tensor = val_transforms(image)

    # Add a batch dimension (1, 3, 224, 224)
    image_tensor = image_tensor.unsqueeze(0)

    return image_tensor
# Step 1: Define the model architecture
num_classes = 10  # Replace with the number of classes in your dataset
model = efficientnet_b0(pretrained=False)  # Same architecture as used during training
model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, num_classes)
tr_model = torch.jit.load("traced_effnet.pt")
tr_model.eval()
app = Flask(__name__)

def gen_frames():
    cap = cv2.VideoCapture(0)
    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            # Preprocess frame
            img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            tensor_img = ToTensor()(img).unsqueeze(0)
            prediction = tr_model(tensor_img)
            class_name = prediction.argmax(1).item()
            # pred_labels_and_probs = {class_names[i]: float(prediction.argmax(1).item()) for i in range(len(class_names))}
            # Display the class name on the frame
            cv2.putText(frame, str(class_names[class_name]), (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            # Encode and yield the frame
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/cam/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(debug=True)