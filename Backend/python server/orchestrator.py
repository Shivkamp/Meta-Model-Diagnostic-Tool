import numpy as np
import tensorflow as tf
import joblib
from tensorflow.keras.models import load_model
from PIL import Image
import pandas as pd

# --- Preprocessing functions ---
def preprocess_image(path):
    img = Image.open(path).convert('RGB')
    img = img.resize((64, 64))
    img = np.array(img) / 255.0
    return img.reshape(1, 64, 64, 3)

def preprocess_tabular(input_array):
    input_array = np.array(input_array).astype(np.float32)
    return input_array.reshape(1, 17)  # Assuming 17 features

# --- Load models ---
orchestrator_model = load_model("models/orchestrator_model.h5")
# vgg_model = load_model("VGG_model.h5")
# heart_disease_model = joblib.load("heart_disease.pkl")

image_input = preprocess_image("models/brain tumour/44no.jpg")       
tabular_input = preprocess_tabular([0, 60, 1, 10, 0, 0, 1, 0, 225, 150, 95, 29, 65, 103, 0, 0, 0])              

# --- Step 1: Orchestrator decides the route ---
decision = orchestrator_model.predict([image_input, tabular_input])[0][0]
print(f"Orchestrator Prediction: {decision:.2f}")

# --- Step 2: Forward to correct model ---
if decision > 0.5:
    # Brain Tumor prediction
    print("Routing to Brain Tumor model (VGG)...")
    # brain_pred = vgg_model.predict(image_input)[0][0]
    # label = "Yes Tumor" if brain_pred > 0.5 else "No Tumor"
    # print(f"VGG_model Prediction: {label} ({brain_pred:.2f})")

else:
    # Heart Disease prediction
    print("Routing to Heart Disease model (ML)...")
    # heart_pred = heart_disease_model.predict(tabular_input)[0]
    # print(f"Heart Disease Prediction: {'Yes' if heart_pred == 1 else 'No'} ({heart_pred})")
