import numpy as np
from scipy import interpolate
import os


clear = lambda: os.system('cls')
clear()


er = np.array([[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5]])
ar = np.array([[1,1,1,1,1,1],[1,1,1,1,1,1],[1,1,1,1,1,1],[1,1,1,1,1,1],[1,1,1,1,1,1]])
y2 = np.array([10,10,11])


er[:,1:4] =  er[:,1:4] * y2
print(f"er = \n{er} \n\n")
ar[:,1:4] =  ar[:,1:4] * y2
print(f"ar = \n{ar} \n\n")


# cons_hours_per_day = 24
# cons_days_per_quarter = 90
# cons_hours_per_quarter = 2160
# game_turn_number = 3

# dur_days = 4 + np.random.randint(9)
# print(f"dur_days \t\t= {dur_days}")

# dur_hours = dur_days * cons_hours_per_day
# print(f"dur_hours \t\t= {dur_hours}")

# # Starting day and hour
# start_day = np.random.randint(cons_days_per_quarter - 15)
# print(f"start_day \t\t= {start_day}")

# start_hour = (game_turn_number * cons_hours_per_quarter) + (start_day * cons_hours_per_day)
# print(f"start_hour \t\t= {start_hour}")

# end_hour = start_hour + dur_hours
# print(f"end_hour \t\t= {end_hour}")

# # End day
# end_day = start_day + dur_days
# print(f"end_day \t\t= {end_day}")

# #
# peak = np.random.uniform(0.10, 0.25)
# print(f"peak     \t\t= {peak}")

# # Create random percentage to see if heatwave occurs
# # check = np.random.uniform(0, 1)


# # create randomly fluctuating timeseries to represent increase in energy demand due to heat
# x1 = np.linspace(0, 14, 6)
# print(f"x1        \t\t= {x1}")

# y1 = np.random.uniform(0.2, 0.5, 6)
# print(f"y1(before) \t\t= {y1}")

# y1[0] = 0
# y1[-1] = 0
# y1 = y1 * (1.0 / (1 + np.exp(-10 * (x1 - 1)))) * (1.0 - 1.0 / (1 + np.exp(-10 * (x1 - dur_days))))
# print(f"y1(after) \t\t= {y1}")

# x2  = np.linspace(0, 14, dur_hours)
# # print(f"x2 = {x2}")
# print(f"len(x22) \t\t= {len(x2)}")

# y2  = interpolate.interp1d(x1, y1, kind='cubic')(x2)
# # print(f"y2(start) = {y2}")

# y2 *= (1.0 / (1 + np.exp(-10 * (x2 - 1)))) * (1.0 - 1.0 / (1 + np.exp(-10 * (x2 - dur_days))))
# # print(f"y2(function) = {y2}")

# y2 /= np.max(y2)
# # print(f"y2(max) = {y2}")

# y2 *= peak
# # print(f"y2(peak) = {y2}")

# y2 += 1.0
# print(f"y2(end) \t\t= {y2}")

# print(f"len(y2) \t\t= {len(y2)}")



