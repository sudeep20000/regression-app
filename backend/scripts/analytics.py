import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Function to create a directory if it doesn't exist
def create_directory(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

# Read the Excel file
df = pd.read_excel('your_excel_file.xlsx')

# Filter data for January
january_data = df[df['month'] == 'january']

# Create a directory to store the images
image_directory = 'data_visualization_images'
create_directory(image_directory)

# Generate individual plots for January data points
for index, row in january_data.iterrows():
    plt.figure(figsize=(10, 6))
    plt.plot(row['power'], marker='o')
    plt.title(f'Power for January - Data Point {index}')
    plt.xlabel('Data Point')
    plt.ylabel('Power')
    plt.grid(True)
    plt.savefig(os.path.join(image_directory, f'january_power_plot_{index}.png'))
    plt.close()

# Create a heatmap for the overall data
plt.figure(figsize=(12, 8))
sns.heatmap(df.pivot(index='month', columns='data_point', values='power'), cmap='YlOrRd', annot=True)
plt.title('Overall Power Heatmap')
plt.xlabel('Data Point')
plt.ylabel('Month')
plt.savefig(os.path.join(image_directory, 'overall_power_heatmap.png'))
plt.close()

print(f"All images have been saved in the '{image_directory}' folder.")