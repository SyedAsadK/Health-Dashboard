import joblib
from flask import Flask, jsonify, request

app = Flask(__name__)

# This loads your model once when the app starts.
# Make sure to replace 'your_model.pkl' with the actual file name.
try:
    joblib.dump("outbreakpredict.ipynb", "model.pkl")
    model = joblib.load("model.pkl")
    print("ML model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None


@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.get_json(force=True)

    # Assuming your model takes an array of features.
    # Adjust this to match the exact input format your model expects.
    features = data["features"]
    prediction = model.predict([features])

    # Convert prediction to a standard Python type
    prediction_result = int(prediction[0])

    return jsonify(
        {
            "prediction": prediction_result,
            "outbreak_risk": "high" if prediction_result > 0.5 else "low",
        }
    )


if __name__ == "__main__":
    app.run(port=5001, debug=True)
