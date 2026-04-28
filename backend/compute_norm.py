import numpy as np
import glob
import os
from feature_extractor import extract_features_from_image

dataset_dir = r"D:\Downloads\Desktop\dataset\Dys"

# Look for multiple extensions
image_paths = []
for ext in ("*.png", "*.jpg", "*.jpeg"):
    image_paths.extend(glob.glob(os.path.join(dataset_dir, "Dysgraphia", ext)))
    image_paths.extend(glob.glob(os.path.join(dataset_dir, "Non-Dysgraphia", ext)))

print(f"[INFO] Found {len(image_paths)} images.")

feature_list = []
for img_path in image_paths:
    features_dict = extract_features_from_image(img_path)
    if features_dict is not None:
        feature_list.append(list(features_dict.values()))
    else:
        print(f"[WARN] No features extracted for {img_path}")

if len(feature_list) == 0:
    print("[ERROR] No features extracted from any image! Check dataset paths and image format.")
    exit()

feature_array = np.array(feature_list, dtype=np.float32)

feature_mean = feature_array.mean(axis=0)
feature_std = feature_array.std(axis=0)

np.save("feature_mean.npy", feature_mean)
np.save("feature_std.npy", feature_std)

print("[INFO] Saved feature_mean.npy and feature_std.npy")
print("[INFO] Total images processed:", len(feature_list))
print("[INFO] Mean (first 5):", feature_mean[:5])
print("[INFO] Std (first 5):", feature_std[:5])
print("[INFO] Shape:", feature_array.shape)
