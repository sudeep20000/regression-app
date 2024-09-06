# import sys
# import json

# def calculate_cp(tip_speed_ratio, pitch_angle, x2_power, best_c):
#     x1_power = 8

#     # Generate basis functions for x1 and x2
#     basis_functions_x1 = [lambda x1, n=n: x1**n for n in range(x1_power + 1)]
#     basis_functions_x2 = [lambda x2, n=n: x2**n for n in range(x2_power + 1)]

#     # Combine the basis functions
#     combined_basis_functions = []
#     for i in range(len(basis_functions_x1)):
#         for j in range(len(basis_functions_x2)):
#             combined_basis_functions.append((basis_functions_x1[i], basis_functions_x2[j]))

#     # Calculate cp for the single point
#     cp = 0
#     for j, (f_x1, f_x2) in enumerate(combined_basis_functions):
#         cp += best_c[j] * f_x1(tip_speed_ratio) * f_x2(pitch_angle)

#     return cp

# # Example usage
# if __name__ == "__main__":
#     tip_speed_ratio = float(sys.argv[1])
#     pitch_angle = float(sys.argv[2])
#     x2_power= int(sys.argv[3])
#     best_c = json.loads(sys.argv[4])

#     cp = calculate_cp(tip_speed_ratio, pitch_angle, x2_power, best_c)
#     print(cp)

import sys
import json

def calculate_cp_singleData(tip_speed_ratio, pitch_angle, x2_power, best_c):
    x1_power = 8

    # Generate basis functions for x1 and x2
    basis_functions_x1 = [lambda x1, n=n: x1**n for n in range(x1_power + 1)]
    basis_functions_x2 = [lambda x2, n=n: x2**n for n in range(x2_power + 1)]

    # Combine the basis functions
    combined_basis_functions = []
    for i in range(len(basis_functions_x1)):
        for j in range(len(basis_functions_x2)):
            combined_basis_functions.append((f"x1^{i} * x2^{j}", basis_functions_x1[i], basis_functions_x2[j]))

    # Calculate cp for the single point
    cp = 0
    for j, (func_str, f_x1, f_x2) in enumerate(combined_basis_functions):
        cp += best_c[j] * f_x1(tip_speed_ratio) * f_x2(pitch_angle)

    # Create a list of combined basis function strings
    basis_function_strings = [func_str for func_str, _, _ in combined_basis_functions]

    return cp, basis_function_strings

# Example usage
if __name__ == "__main__":
    tip_speed_ratio = float(sys.argv[1])
    pitch_angle = float(sys.argv[2])
    x2_power = int(sys.argv[3])
    best_c = json.loads(sys.argv[4])

    cp_value, basis_functions = calculate_cp_singleData(tip_speed_ratio, pitch_angle, x2_power, best_c)
    
    # Create a dictionary with the results
    result = {
        "cp_value": cp_value,
        "basis_functions": basis_functions
    }
    
    # Print the result as a JSON string
    print(json.dumps(result))