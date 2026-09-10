import os, gc, json, pickle
import numpy as np
import pandas as pd
import train_model as tm

DATA_DIRECTORY = tm.DATA_DIRECTORY
ARTIFACTS_DIR = 'artifacts'


def build_features():
    print('Building post-training demo feature cache...')
    df = tm.get_train_test(DATA_DIRECTORY, num_rows=None)

    bureau = tm.get_bureau(DATA_DIRECTORY, num_rows=None)
    df = pd.merge(df, bureau, on='SK_ID_CURR', how='left')
    del bureau; gc.collect()

    prev = tm.get_previous_applications(DATA_DIRECTORY, num_rows=None)
    df = pd.merge(df, prev, on='SK_ID_CURR', how='left')
    del prev; gc.collect()

    pos = tm.get_pos_cash(DATA_DIRECTORY, num_rows=None)
    df = pd.merge(df, pos, on='SK_ID_CURR', how='left')
    del pos; gc.collect()

    ins = tm.get_installment_payments(DATA_DIRECTORY, num_rows=None)
    df = pd.merge(df, ins, on='SK_ID_CURR', how='left')
    del ins; gc.collect()

    cc = tm.get_credit_card(DATA_DIRECTORY, num_rows=None)
    df = pd.merge(df, cc, on='SK_ID_CURR', how='left')
    del cc; gc.collect()

    df = tm.add_ratios_features(df)
    df = tm.reduce_memory(df)

    # Match the exact training-side feature selection and safe names.
    df = tm.sanitize_feature_names(df)
    test = df[df['TARGET'].isnull()].copy()

    del_features = ['TARGET', 'SK_ID_CURR', 'SK_ID_BUREAU', 'SK_ID_PREV', 'index', 'level_0']
    original_predictors = [c for c in test.columns if c not in del_features]
    safe_predictors = [f'feature_{i}' for i in range(len(original_predictors))]

    X_test = test[original_predictors].copy()
    X_test.columns = safe_predictors

    # This mirrors the training code's categorical handling. Because get_train_test
    # already combines train + test before factorization, the integer codes match training.
    # Any remaining object/category columns are converted using the test values.
    for col in safe_predictors:
        if X_test[col].dtype == 'object' or str(X_test[col].dtype) == 'category':
            X_test[col] = pd.factorize(X_test[col])[0].astype('int32')

    X_test = X_test.replace([np.inf, -np.inf], np.nan)

    os.makedirs(ARTIFACTS_DIR, exist_ok=True)

    # Save only the test-side engineered features needed for fast demo predictions.
    with open(os.path.join(ARTIFACTS_DIR, 'demo_features.pkl'), 'wb') as f:
        pickle.dump(X_test, f, protocol=pickle.HIGHEST_PROTOCOL)

    with open(os.path.join(ARTIFACTS_DIR, 'feature_columns.pkl'), 'wb') as f:
        pickle.dump(safe_predictors, f, protocol=pickle.HIGHEST_PROTOCOL)

    mapping = dict(zip(safe_predictors, original_predictors))
    with open(os.path.join(ARTIFACTS_DIR, 'feature_name_map.json'), 'w', encoding='utf-8') as f:
        json.dump(mapping, f, indent=2, ensure_ascii=False)

    # Keep the original application fields for a friendly demo UI.
    app_cols = [c for c in tm.get_train_test(DATA_DIRECTORY, num_rows=1).columns if c in test.columns]
    app = test[[c for c in app_cols if c != 'TARGET']].copy()
    app.to_csv(os.path.join(ARTIFACTS_DIR, 'demo_applicants.csv'), index=False)

    print('Saved: artifacts/demo_features.pkl')
    print('Saved: artifacts/feature_columns.pkl')
    print('Saved: artifacts/feature_name_map.json')
    print('Saved: artifacts/demo_applicants.csv')
    print('Demo rows:', len(X_test))
    print('Demo features:', len(X_test.columns))


if __name__ == '__main__':
    build_features()
