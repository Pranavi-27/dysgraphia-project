import cv2
import numpy as np
from skimage.morphology import skeletonize
from skimage.measure import regionprops, label
from skimage.feature import hog
from collections import OrderedDict

def preprocess_image(img_path):
    """Load, grayscale, resize, binarize, and clean image."""
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return None
    img = cv2.resize(img, (512, 512), interpolation=cv2.INTER_AREA)
    _, binary = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    binary = cv2.medianBlur(binary, 3)
    return binary

def extract_features(binary):
    """Extract handwriting features from binarized image."""
    features = OrderedDict()

    ys, xs = np.where(binary > 0)
    if len(xs) == 0 or len(ys) == 0:
        return None

    # --- Bounding box ---
    height = ys.max() - ys.min()
    width = xs.max() - xs.min()
    features["VerticalSize"] = height
    features["HorizontalSize"] = width
    features["AbsoluteSize"] = height * width
    features["AspectRatio"] = width / (height + 1e-5)
    features["BoundingBoxArea"] = height * width

    # --- Skeletonization ---
    skeleton = skeletonize(binary > 0)
    road_length = skeleton.sum()
    features["Roadlength"] = road_length

    # --- Stroke features ---
    labeled = label(binary > 0)
    props = regionprops(labeled)
    features["NumOfStrokes"] = len(props)
    stroke_lengths = [prop.area for prop in props]
    features["MaxStrokeLength"] = max(stroke_lengths) if stroke_lengths else 0
    features["AverageStrokeLength"] = np.mean(stroke_lengths) if stroke_lengths else 0
    features["StrokeLengthStd"] = np.std(stroke_lengths) if stroke_lengths else 0

    # --- Stroke thickness & Ink density ---
    features["StrokeThickness"] = binary.sum() / (road_length + 1e-5)
    features["InkDensity"] = binary.sum() / (binary.shape[0] * binary.shape[1])
    features["InkPerStroke"] = features["InkDensity"] / (features["NumOfStrokes"] + 1e-5)

    # --- Baseline deviation ---
    baseline_y = [np.where(binary[:, col] > 0)[0].max() for col in range(binary.shape[1]) if np.any(binary[:, col])]
    features["BaselineDeviation"] = np.std(baseline_y) if baseline_y else 0

    # --- Loops & Contours ---
    contours, hierarchy = cv2.findContours(binary, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
    loop_count = sum(1 for i in range(len(hierarchy[0])) if hierarchy[0][i][3] != -1) if hierarchy is not None else 0
    features["LoopSurface"] = loop_count
    features["ContourCount"] = len(contours)

    # --- Shape descriptors ---
    if props:
        largest = max(props, key=lambda r: r.area)
        features["Eccentricity"] = largest.eccentricity
        features["Solidity"] = largest.solidity
        perimeter = largest.perimeter if largest.perimeter > 0 else 1
        features["Circularity"] = (4 * np.pi * largest.area) / (perimeter ** 2)
        features["Compactness"] = (largest.perimeter ** 2) / (largest.area + 1e-5)
    else:
        features.update({"Eccentricity": 0, "Solidity": 0, "Circularity": 0, "Compactness": 0})

    # --- Slant estimation ---
    fd, _ = hog(binary, orientations=9, pixels_per_cell=(16, 16), cells_per_block=(2, 2),
                visualize=True, feature_vector=True)
    features["Slant"] = np.mean(fd)

    # --- Straightness Error ---
    coords = np.column_stack(np.where(skeleton > 0))
    if len(coords) > 1:
        x, y = coords[:, 1], coords[:, 0]
        y_pred = np.polyval(np.polyfit(x, y, 1), x)
        features["StraightnessError"] = np.mean((y - y_pred) ** 2)
    else:
        features["StraightnessError"] = 0

    # --- Symmetry ---
    h, w = binary.shape
    left, right = binary[:, :w//2].sum(), binary[:, w//2:].sum()
    top, bottom = binary[:h//2, :].sum(), binary[h//2:, :].sum()
    features["VerticalSymmetry"] = abs(left - right) / (left + right + 1e-5)
    top, bottom = float(top), float(bottom)
    features["HorizontalSymmetry"] = abs(top - bottom) / (top + bottom + 1e-5)


    # --- Pressure proxy ---
    features["AveragePenPressure"] = np.mean(binary[binary > 0]) if binary.sum() > 0 else 0

    return features

def extract_features_from_image(img_path):
    """Wrapper to preprocess image and extract features."""
    binary = preprocess_image(img_path)
    if binary is None:
        return None
    return extract_features(binary)
