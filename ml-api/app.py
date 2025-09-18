import joblib
import pandas as pd
import xgboost as xgb  # Import the xgboost library
from flask import Flask, jsonify, request

app = Flask(__name__)

# This is the new way to load your model from the JSON file
try:
    # Instantiate a new XGBClassifier object first
    model = xgb.XGBClassifier()
    # Load the model from the JSON file
    model.load_model("sihmodel.json")
    print("ML model (sihmodel.json) loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# The rest of your app.py file remains the same...

features_list = [
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
    "data_gov_update_date",
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


@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.get_json(force=True)

    # This part remains the same
    input_df = pd.DataFrame([data["features"]]).reindex(columns=features_list).fillna(0)

    prediction_prob = model.predict_proba(input_df)[:, 1]
    risk_probability = prediction_prob[0]

    return jsonify(
        {
            "prediction": risk_probability,
            "outbreak_risk": "high" if risk_probability > 0.3 else "low",
        }
    )


if __name__ == "__main__":
    app.run(port=5001, debug=True)
