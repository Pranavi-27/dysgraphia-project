import matplotlib.pyplot as plt
import numpy as np

# Model names
models = ['DTGM-GCN + LSTM', 'CNN + LSTM']

# Metrics for each model
Precision = [0.82, 0.97]
Recall = [0.84, 0.96]
F1 = [0.87, 0.95]
accuracy = [84.24, 92.31]  # percentages

# Scale accuracy to 0-1
accuracy_scaled = [a / 100 for a in accuracy]

# Set height of bars
bar_height = 0.1

# Set position of bars on Y axis
r1 = np.arange(len(models))
r2 = [y + bar_height for y in r1]
r3 = [y + bar_height*2 for y in r1]
r4 = [y + bar_height*3 for y in r1]

# Create horizontal bar plot
plt.figure(figsize=(12,8))
plt.barh(r1, Precision, color='skyblue', height=bar_height, edgecolor='grey', label='Precision')
plt.barh(r2, Recall, color='lightgreen', height=bar_height, edgecolor='grey', label='Recall')
plt.barh(r3, F1, color='salmon', height=bar_height, edgecolor='grey', label='F1-Score')
plt.barh(r4, accuracy_scaled, color='orange', height=bar_height, edgecolor='grey', label='Accuracy')

# Add labels and title
plt.ylabel('Models', fontweight='bold', fontsize=12)
plt.xlabel('Score', fontweight='bold', fontsize=12)
plt.title('Comparison of Hybrid Models Performance', fontsize=14)
plt.yticks([r + bar_height*1.5 for r in range(len(models))], models)

plt.xlim(0, 1.1)  # Scale for 0-1

plt.legend()
plt.tight_layout()
plt.show()
