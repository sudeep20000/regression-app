import sys
import json
import math
import pandas as pd
import traceback
import logging

logging.basicConfig(filename='script_log.txt', level=logging.INFO)

def calculate_cp_multiData(jsonDataPath, x2_power, best_c):
    try:
        # # Read the JSON data into a pandas DataFrame
        # data = pd.read_json(jsonDataPath)

        # # Convert the DataFrame back to a list of objects
        # data_list = data.to_dict(orient='records')

        # x1_power = 8

        # # Generate all the basis function values once
        # basis_functions_x1 = [lambda x1, n=n: x1**n for n in range(x1_power + 1)]
        # basis_functions_x2 = [lambda x2, n=n: x2**n for n in range(x2_power + 1)]

        # # Combine the basis functions
        # combined_basis_functions = []
        # for i in range(len(basis_functions_x1)):
        #     for j in range(len(basis_functions_x2)):
        #         combined_basis_functions.append((basis_functions_x1[i], basis_functions_x2[j]))

        # airDensity = 1.225
        # for point in data_list:
        #     # Precompute values for this data point
        #     tip_speed_ratio = point["angulerSpeed"] * point["rotorRadius"] / point["windVelocity"]
        #     pitch_angle = point["pitch_angle"]

        #     cp = 0
        #     for j, (f_x1, f_x2) in enumerate(combined_basis_functions):
        #         cp += best_c[j] * f_x1(tip_speed_ratio) * f_x2(pitch_angle)

        #     # Compute power
        #     point['cp'] = cp
        #     point['power'] = (1 / 2) * airDensity * math.pi * point["rotorRadius"] ** 2 * point["windVelocity"] ** 3 * cp

        # Read the JSON data into a pandas DataFrame
        data = pd.read_json(jsonDataPath)

        # Extract relevant columns as NumPy arrays
        tip_speed_ratio = data['angulerSpeed'] * data['rotorRadius'] / data['windVelocity']
        pitch_angle = data['pitch_angle']

        # Generate basis function values for all data points at once
        x1_power = 8
        x2_power = 8  # Assuming x2_power is also 8, adjust if different
        x1_basis = np.array([tip_speed_ratio**n for n in range(x1_power + 1)]).T
        x2_basis = np.array([pitch_angle**n for n in range(x2_power + 1)]).T

        # Create a 2D array of all combinations of basis function values
        combined_basis = np.einsum('ij,ik->ijk', x1_basis, x2_basis)

        # Reshape combined_basis to 2D array
        combined_basis_2d = combined_basis.reshape(len(data), -1)

        # Compute cp values for all data points at once
        cp = np.dot(combined_basis_2d, best_c)

        # Add cp to the DataFrame
        data['cp'] = cp

        # Compute power
        airDensity = 1.225
        data['power'] = 0.5 * airDensity * np.pi * data['rotorRadius']**2 * data['windVelocity']**3 * cp

        data_list = data.to_dict(orient='records')
        # Save the updated data back to the same JSON file
        with open(jsonDataPath, 'w') as f:
            f.write(json.dumps(data_list, indent=2))

    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
        logging.error(traceback.format_exc())
        sys.exit(1)


if __name__ == "__main__":
    jsonDataPath = sys.argv[1]
    x2_power = int(sys.argv[2])
    best_c = json.loads(sys.argv[3])

    calculate_cp_multiData(jsonDataPath, x2_power, best_c)