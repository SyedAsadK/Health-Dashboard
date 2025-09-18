import base64
from io import BytesIO

import joblib

# Set matplotlib to a non-interactive backend
import matplotlib
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import xgboost as xgb
from flask import Flask, jsonify, request

matplotlib.use("Agg")

app = Flask(__name__)

try:
    model = xgb.XGBClassifier()
    model.load_model("sihmodel.json")
    print("ML model (sihmodel.json) loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

features_list = [
    "Latitude",
    "Longitude",
    "_24d",
    "_as",
    "_do",
    "aldrin",
    "alk_phen",
    "alk_tot",
    "b",
    "barium",
    "bhc",
    "bod",
    "bod3_27",
    "ca",
    "carbon_14",
    "cd",
    "chlf_a",
    "cl",
    "cn",
    "co3",
    "cocci",
    "cod",
    "cr",
    "cu",
    "ddt",
    "dieldrin",
    "do_sat_",
    "ec_fld",
    "ec_gen",
    "endos",
    "f",
    "fcol_mpn",
    "fe",
    "har_ca",
    "har_mg",
    "har_total",
    "hco3",
    "hg",
    "k",
    "mg",
    "na",
    "na_",
    "nh3_n",
    "ni",
    "no2_n",
    "no2_no3",
    "no3_n",
    "o_po4_p",
    "org_n",
    "p_tot",
    "pah",
    "pb",
    "ph_fld",
    "ph_gen",
    "rsc",
    "sar",
    "secchi",
    "sio2",
    "sio3",
    "so4",
    "ss",
    "tcol_mpn",
    "tds",
    "temp",
    "toc",
    "ts",
    "turb",
    "zn",
    "_401",
    "ag",
    "al",
    "colour_cod",
    "d_o",
    "d_o_",
    "mn",
    "odour_code",
    "oxygen_18",
    "pcb",
    "ph",
    "phenols",
    "radon",
    "se",
    "strontium",
    "tritium",
    "uranium",
    "no2__n",
    "caco3",
    "mgcaco3",
]


def create_feature_importance_plot(model, feature_names):
    """Generates and returns a feature importance plot as a Base64 string."""
    fig, ax = plt.subplots(figsize=(10, 8))
    importances = model.feature_importances_
    indices = importances.argsort()[-10:]  # Top 10 features
    ax.barh(range(len(indices)), importances[indices], align="center")
    ax.set_yticks(range(len(indices)))
    ax.set_yticklabels([feature_names[i] for i in indices])
    ax.set_xlabel("Importance")
    ax.set_title("Top 10 Feature Importance")
    plt.tight_layout()

    buf = BytesIO()
    fig.savefig(buf, format="png", dpi=80)
    plt.close(fig)
    return base64.b64encode(buf.getvalue()).decode("utf-8")


def create_confusion_matrix_plot():
    """Generates and returns a sample confusion matrix plot as a Base64 string."""
    # Using sample data as we don't have a live test set here
    cm_data = [[700, 58], [15, 70]]
    fig, ax = plt.subplots(figsize=(6, 5))
    sns.heatmap(
        cm_data,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=["Safe", "Outbreak"],
        yticklabels=["Safe", "Outbreak"],
        ax=ax,
    )
    ax.set_title("Sample Confusion Matrix")
    ax.set_xlabel("Predicted")
    ax.set_ylabel("Actual")
    plt.tight_layout()

    buf = BytesIO()
    fig.savefig(buf, format="png", dpi=80)
    plt.close(fig)
    return base64.b64encode(buf.getvalue()).decode("utf-8")


@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.get_json(force=True)
    input_df = pd.DataFrame([data["features"]]).reindex(
        columns=features_list).fillna(0)

    prediction_prob = model.predict_proba(input_df)[:, 1]
    risk_probability = float(prediction_prob[0])

    # Generate plots
    feature_importance_img = create_feature_importance_plot(
        model, features_list)
    confusion_matrix_img = create_confusion_matrix_plot()

    return jsonify(
        {
            "prediction": risk_probability,
            "outbreak_risk": "high" if risk_probability > 0.3 else "low",
            "feature_importance_plot": feature_importance_img,
            "confusion_matrix_plot": confusion_matrix_img,
        }
    )


if __name__ == "__main__":
    app.run(port=5001, debug=True)
