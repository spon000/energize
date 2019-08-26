facility_types = [
  {'maintype': "nuclear",     'subtype': "",       'name': "Nuclear",            'build_time': 40, 'minimum_area': 7.00e+06,  'fixed_cost_build': 2120,     'fixed_cost_operate': 36.41,  'marginal_cost_build': 0, 'marginal_cost_operate': 0.34, 'decomission_cost': 0,  'description': ""},
  {'maintype': "nuclear",     'subtype': "SMR",    'name': "Nuclear SMR",        'build_time': 28, 'minimum_area': 100,       'fixed_cost_build': 3333.33,  'fixed_cost_operate': 36.41,  'marginal_cost_build': 0, 'marginal_cost_operate': 0.34, 'decomission_cost': 0,  'description': ""},
  {'maintype': "wind",        'subtype': "",       'name': "Wind",               'build_time': 12, 'minimum_area': 100,       'fixed_cost_build': 101.50,   'fixed_cost_operate': 1.59,   'marginal_cost_build': 0, 'marginal_cost_operate': 0.38, 'decomission_cost': 0,  'description': ""},
  {'maintype': "solar",       'subtype': "",       'name': "Solar",              'build_time': 12, 'minimum_area': 100,       'fixed_cost_build': 227.50,   'fixed_cost_operate': 1.50,   'marginal_cost_build': 0, 'marginal_cost_operate': 0,    'decomission_cost': 0,  'description': ""},  
  {'maintype': "natural gas", 'subtype': "peaker", 'name': "Natural Gas Peaker", 'build_time': 12, 'minimum_area': 2.00E+05,  'fixed_cost_build': 68.25,    'fixed_cost_operate': 1.05,   'marginal_cost_build': 0, 'marginal_cost_operate': 0.31, 'decomission_cost': 0,  'description': ""},  
  {'maintype': "natural gas", 'subtype': "",       'name': "Natural Gas",        'build_time': 12, 'minimum_area': 2.00E+05,  'fixed_cost_build': 83.25,    'fixed_cost_operate': 0.88,   'marginal_cost_build': 0, 'marginal_cost_operate': 0.22, 'decomission_cost': 0,  'description': ""},
  {'maintype': "coal",        'subtype': "",       'name': "Coal",               'build_time': 12, 'minimum_area': 1.25E+06,  'fixed_cost_build': 600,      'fixed_cost_operate': 6.42,   'marginal_cost_build': 0, 'marginal_cost_operate': 1.02, 'decomission_cost': 0,  'description': ""},
  {'maintype': "hydro",       'subtype': "",       'name': "Hydro",              'build_time': 24, 'minimum_area': 4.65E+03,  'fixed_cost_build': 1632,     'fixed_cost_operate': 11.88,  'marginal_cost_build': 0, 'marginal_cost_operate': 1.97, 'decomission_cost': 0,  'description': ""},
  {'maintype': "new",         'subtype': "",       'name': "Undefined",          'build_time': 0,  'minimum_area': 0,         'fixed_cost_build': 0,        'fixed_cost_operate': 0,      'marginal_cost_build': 0, 'marginal_cost_operate': 0,    'decomission_cost': 0,  'description': ""}
]     

generator_types = [
  {'id_facility_type': 1, 'id_power_type': 1, 'id_resource_type': 4, 'build_time': 40,  'nameplate_capacity': 1000, 'maximum_capacity': 4000, 'heat_rate': 133740, 'continuous': True, 'lifespan': 240, 'fixed_cost_build': 3180, 'fixed_cost_operate': 36, 'variable_cost_operate': 0.22,  'decomission_cost': 620000},
  {'id_facility_type': 1, 'id_power_type': 2, 'id_resource_type': 4, 'build_time': 40,  'nameplate_capacity': 1000, 'maximum_capacity': 4000, 'heat_rate': 133740, 'continuous': True, 'lifespan': 240, 'fixed_cost_build': 3180, 'fixed_cost_operate': 36, 'variable_cost_operate': 0.22,  'decomission_cost': 620000},
  {'id_facility_type': 2, 'id_power_type': 3, 'id_resource_type': 4, 'build_time': 40,  'nameplate_capacity': 100,  'maximum_capacity': 720,  'heat_rate': 133740, 'continuous': True, 'lifespan': 240, 'fixed_cost_build': 3180, 'fixed_cost_operate': 36, 'variable_cost_operate': 12.05, 'decomission_cost': 620000},
  {'id_facility_type': 3, 'id_power_type': 7, 'id_resource_type': 5, 'build_time': 12,  'nameplate_capacity': 15,   'maximum_capacity': 210,  'heat_rate': 1,      'continuous': True, 'lifespan': 100, 'fixed_cost_build': 1929, 'fixed_cost_operate': 30, 'variable_cost_operate': 7.28,  'decomission_cost': 50000},
  {'id_facility_type': 3, 'id_power_type': 7, 'id_resource_type': 5, 'build_time': 12,  'nameplate_capacity': 30,   'maximum_capacity': 210,  'heat_rate': 1,      'continuous': True, 'lifespan': 100, 'fixed_cost_build': 1929, 'fixed_cost_operate': 30, 'variable_cost_operate': 7.28,  'decomission_cost': 50000},
  {'id_facility_type': 4, 'id_power_type': 9, 'id_resource_type': 6, 'build_time': 12,  'nameplate_capacity': 1,    'maximum_capacity': 180,  'heat_rate': 0.2,    'continuous': True, 'lifespan': 160, 'fixed_cost_build': 4323, 'fixed_cost_operate': 29, 'variable_cost_operate': 0,     'decomission_cost': 90000},
  {'id_facility_type': 4, 'id_power_type': 9, 'id_resource_type': 6, 'build_time': 12,  'nameplate_capacity': 3,    'maximum_capacity': 180,  'heat_rate': 0.2,    'continuous': True, 'lifespan': 160, 'fixed_cost_build': 4323, 'fixed_cost_operate': 29, 'variable_cost_operate': 0,     'decomission_cost': 90000},
  {'id_facility_type': 5, 'id_power_type': 5, 'id_resource_type': 2, 'build_time': 8,   'nameplate_capacity': 10,   'maximum_capacity': 60,   'heat_rate': 0.0652, 'continuous': True, 'lifespan': 120, 'fixed_cost_build': 842,  'fixed_cost_operate': 13, 'variable_cost_operate': 3.86,  'decomission_cost': 17000},
  {'id_facility_type': 5, 'id_power_type': 5, 'id_resource_type': 2, 'build_time': 8,   'nameplate_capacity': 30,   'maximum_capacity': 60,   'heat_rate': 0.0652, 'continuous': True, 'lifespan': 120, 'fixed_cost_build': 842,  'fixed_cost_operate': 13, 'variable_cost_operate': 3.86,  'decomission_cost': 17000},  
  {'id_facility_type': 6, 'id_power_type': 4, 'id_resource_type': 2, 'build_time': 8,   'nameplate_capacity': 100,  'maximum_capacity': 1400, 'heat_rate': 0.0652, 'continuous': True, 'lifespan': 120, 'fixed_cost_build': 1027, 'fixed_cost_operate': 11, 'variable_cost_operate': 2.75,  'decomission_cost': 17000},
  {'id_facility_type': 6, 'id_power_type': 4, 'id_resource_type': 2, 'build_time': 8,   'nameplate_capacity': 350,  'maximum_capacity': 1400, 'heat_rate': 0.0652, 'continuous': True, 'lifespan': 120, 'fixed_cost_build': 1027, 'fixed_cost_operate': 11, 'variable_cost_operate': 2.75,  'decomission_cost': 17000},
  {'id_facility_type': 6, 'id_power_type': 4, 'id_resource_type': 2, 'build_time': 8,   'nameplate_capacity': 500,  'maximum_capacity': 1400, 'heat_rate': 0.0652, 'continuous': True, 'lifespan': 120, 'fixed_cost_build': 1027, 'fixed_cost_operate': 11, 'variable_cost_operate': 2.75,  'decomission_cost': 17000},               
  {'id_facility_type': 7, 'id_power_type': 6, 'id_resource_type': 1, 'build_time': 8,   'nameplate_capacity': 500,  'maximum_capacity': 1500, 'heat_rate': 0.8066, 'continuous': True, 'lifespan': 120, 'fixed_cost_build': 3044, 'fixed_cost_operate': 36, 'variable_cost_operate': 3.79,  'decomission_cost': 150000},
  {'id_facility_type': 7, 'id_power_type': 6, 'id_resource_type': 1, 'build_time': 8,   'nameplate_capacity': 1000, 'maximum_capacity': 1500, 'heat_rate': 0.8066, 'continuous': True, 'lifespan': 120, 'fixed_cost_build': 3044, 'fixed_cost_operate': 36, 'variable_cost_operate': 3.79,  'decomission_cost': 150000},
  {'id_facility_type': 7, 'id_power_type': 6, 'id_resource_type': 1, 'build_time': 8,   'nameplate_capacity': 2000, 'maximum_capacity': 1500, 'heat_rate': 0.8066, 'continuous': True, 'lifespan': 120, 'fixed_cost_build': 3044, 'fixed_cost_operate': 36, 'variable_cost_operate': 3.79,  'decomission_cost': 150000},
  {'id_facility_type': 8, 'id_power_type': 8, 'id_resource_type': 3, 'build_time': 16,  'nameplate_capacity': 100,  'maximum_capacity': 1600, 'heat_rate': 1,      'continuous': True, 'lifespan': 400, 'fixed_cost_build': 408,  'fixed_cost_operate': 3,  'variable_cost_operate': 0.49,  'decomission_cost': 0},
  {'id_facility_type': 8, 'id_power_type': 8, 'id_resource_type': 3, 'build_time': 16,  'nameplate_capacity': 200,  'maximum_capacity': 1600, 'heat_rate': 1,      'continuous': True, 'lifespan': 400, 'fixed_cost_build': 408,  'fixed_cost_operate': 3,  'variable_cost_operate': 0.49,  'decomission_cost': 0},
  {'id_facility_type': 8, 'id_power_type': 8, 'id_resource_type': 3, 'build_time': 16,  'nameplate_capacity': 300,  'maximum_capacity': 1600, 'heat_rate': 1,      'continuous': True, 'lifespan': 400, 'fixed_cost_build': 408,  'fixed_cost_operate': 3,  'variable_cost_operate': 0.49,  'decomission_cost': 0} 
]



power_types = [
  {'maintype': "BWR",     'description': ""},
  {'maintype': "PWR",     'description': ""},
  {'maintype': "SMR",     'description': ""},
  {'maintype': "Large",   'description': ""},
  {'maintype': "Peaker",  'description': ""},
  {'maintype': "Coal",    'description': ""},
  {'maintype': "Wind",    'description': ""},
  {'maintype': "Hydro",   'description': ""},
  {'maintype': "Solar",   'description': ""}
]

resource_types = [
  {'name': "coal",                  'unit': "lb",   'available': True, 'average_price': 47.87,  'energy_content': 1},
  {'name': "natural gas",           'unit': "ft^3", 'available': True, 'average_price': 0.004,  'energy_content': 1},
  {'name': "water",                 'unit': "ft^3", 'available': True, 'average_price': 0,      'energy_content': 1},
  {'name': "uranium dioxide (UO2)", 'unit': "lb",   'available': True, 'average_price': 1390,   'energy_content': 1},
  {'name': "wind",                  'unit': "na",   'available': True, 'average_price': 0,      'energy_content': 1},
  {'name': "sun",                   'unit': "na",   'available': True, 'average_price': 0,      'energy_content': 1}
]

facility_modification_types = [
  {'id_facility_type':  1,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_facility_type':  2,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_facility_type':  3,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_facility_type':  4,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_facility_type':  5,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_facility_type':  6,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_facility_type':  7,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_facility_type':  8,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_facility_type':  9,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
]

generator_modification_types = [
  {'id_generator_type':  1,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_generator_type':  2,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_generator_type':  3,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_generator_type':  4,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_generator_type':  5,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_generator_type':  6,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_generator_type':  7,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_generator_type':  8,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_generator_type':  9,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_generator_type':  10, 'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_generator_type':  11, 'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_generator_type':  12, 'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_generator_type':  13, 'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_generator_type':  14, 'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_generator_type':  15, 'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_generator_type':  16, 'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_generator_type':  17, 'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_generator_type':  18, 'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},                     
]


prompt_type = [
  {'title': 'Blizzard', 'description': 'Blizzard is coming!'}
]

