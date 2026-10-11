"""Demo web API for the Home Credit scoring project.

Run locally:
    python app.py
Then POST JSON to /predict, for example:
    {"SK_ID_CURR": 100001, "explain": true}
"""
from flask import Flask, jsonify, request
from predict_model import get_predictor

app = Flask(__name__)
predictor = get_predictor()


@app.get('/health')
def health():
    return jsonify({'status': 'ok', 'models_loaded': len(predictor.models)})


@app.get('/applicants')
def applicants():
    ids = predictor.applicants['SK_ID_CURR'].astype(int).head(100).tolist()
    return jsonify({'applicants': ids})


@app.post('/predict')
def predict():
    body = request.get_json(silent=True) or {}
    if 'SK_ID_CURR' not in body:
        return jsonify({'error': 'SK_ID_CURR is required for this demo deployment.'}), 400

    try:
        result = predictor.predict(int(body['SK_ID_CURR']), explain=bool(body.get('explain', True)))
        return jsonify(result)
    except Exception as exc:
        return jsonify({'error': str(exc)}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
