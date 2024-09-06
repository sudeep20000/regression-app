import os
import sys
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import seaborn as sns
from sklearn.metrics import mean_squared_error, r2_score

def main(excel_path, independent_vars, dependent_var):
    file_path = excel_path
    try:
        data = pd.read_excel(file_path)
        data.columns = data.columns.str.strip()
    except Exception as e:
        print(f"Error reading the Excel file: {e}")
        exit()

    # Get unique image groups
    unique_images = data[independent_vars[1]].unique()
    colors = sns.color_palette('tab10', len(unique_images))
    color_map = dict(zip(unique_images, colors))

    # 3D Plot with Voltage vs. Time
    fig = plt.figure(figsize=(10, 6))
    ax = fig.add_subplot(111, projection='3d')

    output_folder="outputs"
    os.makedirs(output_folder, exist_ok=True)

    # Plot each image group with a different color
    for image in unique_images:
        subset = data[data[independent_vars[1]] == image]
        ax.scatter(
            subset[dependent_var], 
            subset[independent_vars[0]], 
            subset[independent_vars[1]], 
            color=color_map[image],  label=image,
            marker='o'
        )

    ax.set_title(f'3D Plot: {dependent_var} vs. {independent_vars[0]} vs. {independent_vars[1]}')
    ax.set_xlabel(dependent_var)
    ax.set_ylabel(independent_vars[0])
    ax.set_zlabel(independent_vars[1])
    ax.legend()
    os.makedirs(output_folder, exist_ok=True)
    plot3d_path = os.path.join(output_folder, '3d_plot.png')
    plt.savefig(plot3d_path)
    plt.close(fig) 

    # Define the basis functions as a list of lambda functions
    x1_power = 8
    x2_power_range = range(x1_power + 1) 

    # Creating basis functions for x1
    basis_functions_x1 = [lambda x1, n=n: x1**n for n in range(x1_power + 1)]

    # Filter data
    filtered_data = data

    # Extract values
    X1 = filtered_data[independent_vars[0]].values[:]
    X2 = filtered_data[independent_vars[1]].values[:]
    Y = filtered_data[dependent_var].values[:]
    W = filtered_data['Weight'].values[:]
    N = len(X1)

    best_rmse = float('inf')
    best_r2 = float('-inf')
    best_mse = float('inf')
    best_x2_power = None
    best_C = None
    best_Y_pred = None

    metrics_per_degree = []
    
    # Save overall results to a text file
    resultTxt_path = os.path.join(output_folder, 'results.txt')
                
    # Loop over different x2 degrees
    for x2_power in x2_power_range:
        # Create basis functions for x2
        basis_functions_x2 = [lambda x2, n=n: x2**n for n in range(x2_power + 1)]

        # Combine the basis functions
        combined_basis_functions = []
        for i in range(len(basis_functions_x1)):
            for j in range(len(basis_functions_x2)):
                combined_basis_functions.append((basis_functions_x1[i], basis_functions_x2[j]))

        # with open("results.txt", 'w') as f:
        #     f.write("Basis functions for x1:\n")
        #     for i in range(len(basis_functions_x1)):
        #         f.write(f"f1{i+1}(x1) = x1^{i}\n")

        #     f.write("\nBasis functions for x2:\n")
        #     for i in range(len(basis_functions_x2)):
        #         f.write(f"f2{i+1}(x2) = x2^{i}\n")

        #     f.write("\nCombined basis functions:\n")
        #     count=0
        #     for i in range(len(basis_functions_x1)):
        #         for j in range(len(basis_functions_x2)):
        #             count+=1
        #             f.write(f"f{count}(x1, x2) = f1{i+1} * f2{j+1} = x1^{i} * x2^{j}\n")

        M = len(combined_basis_functions)

        # Generate matrix F
        F = np.zeros((N, M))

        for i in range(N):
            for j, (f_x1, f_x2) in enumerate(combined_basis_functions):
                F[i, j] = f_x1(X1[i]) * f_x2(X2[i])

        # Create the diagonal weighting matrix
        W_diag = np.diag(W)

        # Compute F^T * W
        FTW = np.dot(F.T, W_diag)

        # Compute F^T * W * F
        FTWF = np.dot(FTW, F)

        # Compute F^T * W * Y
        FTWY = np.dot(FTW, Y)

        # Solve for coefficients C
        C = np.linalg.solve(FTWF, FTWY)

        # Calculate predicted values Y_pred
        intermediate_predictions = np.zeros((N, M))

        for i in range(N):
            for j, (f_x1, f_x2) in enumerate(combined_basis_functions):
                intermediate_predictions[i, j] = C[j] * f_x1(X1[i]) * f_x2(X2[i])

        Y_pred = np.sum(intermediate_predictions, axis=1)

        # Evaluate the model
        mse = mean_squared_error(Y, Y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(Y, Y_pred)

        # Store metrics for current degree of x2
        metrics_per_degree.append((x2_power, mse, rmse, r2))

        # Update the best model if current model is better
        if rmse < best_rmse:
            best_rmse = rmse
            best_r2 = r2
            best_mse = mse
            best_x2_power = x2_power
            best_C = C
            best_Y_pred = Y_pred

    with open(resultTxt_path, 'w') as f:
        f.write("Metrics for each degree of x2:\n")
        for degree, mse, rmse, r2 in metrics_per_degree:
            f.write(f"Degree {degree}: MSE={mse}, RMSE={rmse}, R^2={r2}\n")

        f.write(f"\nBest degree for x2: {best_x2_power}\n")
        f.write(f"Best MSE: {best_mse}\n")
        f.write(f"Best RMSE: {best_rmse}\n")
        f.write(f"Best R^2: {best_r2}\n")
            
        f.write("\nCoefficients:\n")
        f.write(np.array2string(best_C, precision=6, separator=', ') + "\n\n")


    # Plot RMSE and R^2 vs. degree of x2
    degrees = [x[0] for x in metrics_per_degree]
    mses = [x[1] for x in metrics_per_degree]
    rmses = [x[2] for x in metrics_per_degree]
    r2s = [x[3] for x in metrics_per_degree]

    plt.figure(figsize=(12, 6))

    plt.subplot(2, 1, 1)
    plt.plot(degrees, rmses, marker='o')
    plt.title('RMSE vs. Degree of x2')
    plt.xlabel('Degree of x2')
    plt.ylabel('RMSE')
    plt.ylim(0.01, 0.2)

    plt.subplot(2, 1, 2)
    plt.plot(degrees, r2s, marker='o')
    plt.title('R^2 vs. Degree of x2')
    plt.xlabel('Degree of x2')
    plt.ylabel('R^2')
    plt.ylim(0, 1)
    plt.tight_layout()

    # Save the plot as an image file
    degree_vs_metrics_path = os.path.join(output_folder, 'degree_vs_metrics.png')
    plt.savefig(degree_vs_metrics_path)
    plt.close(fig) # Close the figure to free up memory

    # Unique curve combinations 
    unique_curves = filtered_data[independent_vars[1]].drop_duplicates()

    # Directory to save plots
    plot_folder = os.path.join(output_folder, 'plots')
    os.makedirs(plot_folder, exist_ok=True)

    # Plot actual vs. predicted values for each unique curve
    for curve in unique_curves:
        curve_filter = ((filtered_data[independent_vars[1]] == curve))

        curve_data = filtered_data[curve_filter]

        X1_curve = curve_data[independent_vars[0]].values[:]
        X2_curve = curve_data[independent_vars[1]].values[:]
        Y_curve = curve_data[dependent_var].values[:]
        Y_pred_curve = best_Y_pred[curve_filter]
        residuals_curve = Y_curve - Y_pred_curve

        # Calculate MSE, RMSE, and R² for the current curve
        mse_curve = mean_squared_error(Y_curve, Y_pred_curve)
        rmse_curve = np.sqrt(mse_curve)
        r2_curve = r2_score(Y_curve, Y_pred_curve)

        # Calculate deviations for overfitting and underfitting
        overfitting_deviation = np.std(residuals_curve)
        underfitting_deviation = np.mean(np.abs(residuals_curve))

        # Find maximum overfitting and underfitting data points
        max_overfit_index = np.argmax(residuals_curve)
        max_underfit_index = np.argmin(residuals_curve)
        max_overfit_time = X1_curve[max_overfit_index]
        max_overfit_voltage = Y_curve[max_overfit_index]
        max_underfit_time = X1_curve[max_underfit_index]
        max_underfit_voltage = Y_curve[max_underfit_index]

        # Calculate percentage of overfitting and underfitting
        percentage_overfit = (residuals_curve[max_overfit_index] / Y_curve[max_overfit_index]) * 100
        percentage_underfit = (residuals_curve[max_underfit_index] / Y_curve[max_underfit_index]) * 100

        # Save curve-specific results to the output file
        with open(resultTxt_path, 'a') as f:
            f.write(f"\nResults for Angle {curve} :\n")

            f.write(f"X1 values {independent_vars[0]}:\n")
            f.write(np.array2string(X1_curve, precision=6, separator=', ') + "\n\n")

            f.write(f"X2 values {independent_vars[1]}:\n")
            f.write(np.array2string(X2_curve, precision=6, separator=', ') + "\n\n")

            f.write(f"Actual Y values {dependent_var}:\n")
            f.write(np.array2string(Y_curve, precision=6, separator=', ') + "\n\n")

            f.write(f"Predicted Y values {dependent_var}:\n")
            f.write(np.array2string(Y_pred_curve, precision=6, separator=', ') + "\n\n")

            f.write("Residuals:\n")
            f.write(np.array2string(residuals_curve, formatter={'float_kind': lambda x: f"{x:.6f}"}) + "\n\n")

            f.write(f"Mean Squared Error: {mse_curve}\n")
            f.write(f"Root Mean Squared Error: {rmse_curve}\n")
            f.write(f"R^2 Score: {r2_curve}\n")
            f.write(f"Overfitting Deviation (Std of Residuals): {overfitting_deviation:.6f} volts\n")
            f.write(f"Underfitting Deviation (Mean Abs of Residuals): {underfitting_deviation:.6f} volts\n")
            f.write(f"Max Overfitting Point (Voltage, Time): ({max_overfit_voltage}, {max_overfit_time})\n")
            f.write(f"Max Underfitting Point (Voltage, Time): ({max_underfit_voltage}, {max_underfit_time})\n")
            f.write(f"Percentage Overfitting: {percentage_overfit:.2f}%\n")
            f.write(f"Percentage Underfitting: {percentage_underfit:.2f}%\n")

        # Plot actual vs. predicted values for the current curve
        plt.figure(figsize=(10, 5))
        plt.scatter(X1_curve, Y_curve, color='blue', label='Actual')
        plt.plot(X1_curve, Y_pred_curve, color='red', label='Predicted')
        plt.xlabel(independent_vars[0])
        plt.ylabel(dependent_var)
        plt.title(f'Actual vs Predicted for Angle_{curve} ')
        plt.legend()

        # Annotate plot with metrics, x2 degree, and deviations
        plt.annotate(f"Degree of x2: {best_x2_power}", xy=(0.05, 0.30), xycoords='axes fraction', fontsize=10, verticalalignment='bottom')
        plt.annotate(f"MSE: {mse_curve:.6f}", xy=(0.05, 0.25), xycoords='axes fraction', fontsize=10, verticalalignment='bottom')
        plt.annotate(f"RMSE: {rmse_curve:.6f}", xy=(0.05, 0.20), xycoords='axes fraction', fontsize=10, verticalalignment='bottom')
        plt.annotate(f"R^2: {r2_curve:.6f}", xy=(0.05, 0.15), xycoords='axes fraction', fontsize=10, verticalalignment='bottom')
        plt.annotate(f"Overfitting Deviation (Std of Residuals): {overfitting_deviation:.6f} volts ({percentage_overfit:.2f}%)", xy=(0.05, 0.10), xycoords='axes fraction', fontsize=10, verticalalignment='bottom')
        plt.annotate(f"Underfitting Deviation (Mean Abs of Residuals): {underfitting_deviation:.6f} volts ({percentage_underfit:.2f}%)", xy=(0.05, 0.05), xycoords='axes fraction', fontsize=10, verticalalignment='bottom')

        plot_filename = os.path.join(plot_folder, f"Angle_{curve}.png")
        plt.savefig(plot_filename, bbox_inches='tight')
        plt.close()

    results = {
        "best_x2_power": best_x2_power,
        "best_coefficients": best_C.tolist()  
    }

    return json.dumps(results)    

if __name__ == "__main__":
    excel_path = sys.argv[1]
    independent_vars = json.loads(sys.argv[2])
    dependent_var = sys.argv[3]

    json_results = main(excel_path, independent_vars, dependent_var)

    print(json_results)