import sys
import json
import math
import pandas as pd

def calculate_cp_multiData(jsonDataPath, x2_power, best_c):
    # Read the JSON data into a pandas DataFrame
    data = pd.read_json(jsonDataPath)

    # Convert the DataFrame back to a list of objects
    data_list = data.to_dict(orient='records')

    x1_power = 8

    # Generate all the basis function values once
    basis_functions_x1 = [lambda x1, n=n: x1**n for n in range(x1_power + 1)]
    basis_functions_x2 = [lambda x2, n=n: x2**n for n in range(x2_power + 1)]

    # Precompute combined basis function indices
    combined_basis_indices = [(i, j) for i in range(len(basis_functions_x1)) for j in range(len(basis_functions_x2))]

    airDensity = 1.225
    for point in data_list:
        # Precompute values for this data point
        tip_speed_ratio = point.angulerSpeed * point.rotorRadius / point.windSpeed
        pitch_angle = point.pitch_angle

        # Precompute basis function values for this point
        basis_x1_values = [f_x1(tip_speed_ratio) for f_x1 in basis_functions_x1]
        basis_x2_values = [f_x2(pitch_angle) for f_x2 in basis_functions_x2]

        # Calculate cp using precomputed values
        cp = sum(best_c[j] * basis_x1_values[i] * basis_x2_values[j] for i, j in combined_basis_indices)

        # Compute power
        point['cp'] = cp
        point['power'] = (1 / 2) * airDensity * math.pi * point.rotorRadius ** 2 * point.windSpeed ** 3 * cp

    # Save the updated data back to the same JSON file
    with open(jsonDataPath, 'w') as f:
        f.write(json.dumps(data_list, indent=2))

if __name__ == "__main__":
    jsonDataPath = sys.argv[1]
    x2_power = int(sys.argv[2])
    best_c = json.loads(sys.argv[3])

    calculate_cp_multiData(jsonDataPath, x2_power, best_c)

# import sys
# import json
# import math
# import pandas as pd

# def calculate_cp_multiData(jsonDataPath, x2_power, best_c):
# 	# Read the JSON data into a pandas DataFrame
#     data = pd.read_json(jsonDataPath)

#     # Convert the DataFrame back to a list of objects
#     data_list = data.to_dict(orient='records')

#     x1_power = 8

#     # Generate basis functions for x1 and x2
#     basis_functions_x1 = [lambda x1, n=n: x1**n for n in range(x1_power + 1)]
#     basis_functions_x2 = [lambda x2, n=n: x2**n for n in range(x2_power + 1)]

#     # Combine the basis functions
#     combined_basis_functions = []
#     for i in range(len(basis_functions_x1)):
#         for j in range(len(basis_functions_x2)):
#             combined_basis_functions.append((basis_functions_x1[i], basis_functions_x2[j]))

#     airDensity = 1.225
#     for point in data_list:
#         tip_speed_ratio = point.angulerSpeed * point.rotorRadius / point.windSpeed
#         pitch_angle = point.pitch_angle

#         cp = 0
#         for j, (f_x1, f_x2) in enumerate(combined_basis_functions):
#             cp += best_c[j] * f_x1(tip_speed_ratio) * f_x2(pitch_angle)

#         point['cp'] = cp
#         point['power'] = (1 / 2) * airDensity * math.pi * point.rotorRadius ** 2 * point.windSpeed ** 3 * cp;

#     # Save the updated data back to the same JSON file
#     with open(jsonDataPath, 'w') as f:
#         f.write(json.dumps(data_list, indent=2))

# if __name__ == "__main__":
#     jsonDataPath = sys.argv[1]
#     x2_power = int(sys.argv[2])
#     best_c = json.loads(sys.argv[3])

#     calculate_cp_multiData(jsonDataPath, x2_power, best_c)

# import sys
# import json
# import math
# import pandas as pd
# import numpy as np

# def calculate_cp(jsonDataPath, x2_power, best_c):
#     # Read the JSON data into a pandas DataFrame
#     data = pd.read_json(jsonDataPath)

#     # Convert to NumPy arrays for faster computation
#     tip_speed_ratios = data['tip_speed_ratio'].to_numpy()
#     pitch_angles = data['pitch_angle'].to_numpy()
#     wind_speeds = data['windSpeed'].to_numpy()
#     rotor_radii = data['rotorRadius'].to_numpy()

#     air_density = 1.225
#     pi = math.pi

#     # Precompute powers of tip_speed_ratio and pitch_angle
#     tip_speed_powers = np.array([tip_speed_ratios**n for n in range(9)])  # x1_power = 8
#     pitch_angle_powers = np.array([pitch_angles**n for n in range(x2_power + 1)])

#     # Compute cp using matrix multiplication (vectorized)
#     cp = np.zeros_like(tip_speed_ratios)
#     for j, c in enumerate(best_c):
#         i = j // (x2_power + 1)
#         k = j % (x2_power + 1)
#         cp += c * tip_speed_powers[i] * pitch_angle_powers[k]

#     # Calculate mechanical power
#     mechanical_power = (1 / 2) * air_density * pi * (rotor_radii ** 2) * (wind_speeds ** 3) * cp

#     # Update DataFrame with calculated values
#     data['cp'] = cp
#     data['mechanical_power'] = mechanical_power

#     # Save the updated data back to the same JSON file
#     data.to_json(jsonDataPath, orient='records', indent=2)

# if __name__ == "__main__":
#     jsonDataPath = sys.argv[1]
#     x2_power = int(sys.argv[2])
#     best_c = json.loads(sys.argv[3])

#     calculate_cp(jsonDataPath, x2_power, best_c)
