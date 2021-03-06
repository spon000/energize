
facility_types = [
  #                                                                                  turns            turns            turns               KW                                                                             per KW                          per KW-yr                 per KW                       per MWh
  {'maintype': "nuclear",     'subtype': "",       'name': "Nuclear",            'build_time': 24, 'decom_time':20, 'lifespan': 240, 'maximum_capacity': 4000, 'maximum_generators': 0, 'minimum_area': 7.00e+06,  'fixed_cost_build': 2120,     'fixed_cost_operate': 36.41,  'marginal_cost_build': 0, 'marginal_cost_operate': 0.34, 'decomission_cost': 0,  'description': ""},
  {'maintype': "nuclear",     'subtype': "SMR",    'name': "Nuclear SMR",        'build_time': 12, 'decom_time':10, 'lifespan': 240, 'maximum_capacity': 720,  'maximum_generators': 0, 'minimum_area': 1.82e+04,  'fixed_cost_build': 3333.33,  'fixed_cost_operate': 36.41,  'marginal_cost_build': 0, 'marginal_cost_operate': 0.34, 'decomission_cost': 0,  'description': ""},
  {'maintype': "wind",        'subtype': "",       'name': "Wind",               'build_time': 12, 'decom_time':6, 'lifespan': 100, 'maximum_capacity': 210,  'maximum_generators': 0, 'minimum_area': 3.00e+03,  'fixed_cost_build': 101.50,   'fixed_cost_operate': 1.59,   'marginal_cost_build': 0, 'marginal_cost_operate': 0.38, 'decomission_cost': 0,  'description': ""},
  {'maintype': "solar",       'subtype': "",       'name': "Solar",              'build_time': 8, 'decom_time':2, 'lifespan': 160, 'maximum_capacity': 180,  'maximum_generators': 0, 'minimum_area': 2.95e+04,  'fixed_cost_build': 227.50,   'fixed_cost_operate': 1.50,   'marginal_cost_build': 0, 'marginal_cost_operate': 0,    'decomission_cost': 0,  'description': ""},  
  {'maintype': "natural gas", 'subtype': "peaker", 'name': "Natural Gas Peaker", 'build_time': 6, 'decom_time':4, 'lifespan': 120, 'maximum_capacity': 60,   'maximum_generators': 0, 'minimum_area': 2.00E+05,  'fixed_cost_build': 68.25,    'fixed_cost_operate': 1.05,   'marginal_cost_build': 0, 'marginal_cost_operate': 0.31, 'decomission_cost': 0,  'description': ""},  
  {'maintype': "natural gas", 'subtype': "",       'name': "Natural Gas",        'build_time': 12, 'decom_time':8, 'lifespan': 120, 'maximum_capacity': 1400, 'maximum_generators': 0, 'minimum_area': 2.00E+05,  'fixed_cost_build': 83.25,    'fixed_cost_operate': 0.88,   'marginal_cost_build': 0, 'marginal_cost_operate': 0.22, 'decomission_cost': 0,  'description': ""},
  {'maintype': "coal",        'subtype': "",       'name': "Coal",               'build_time': 16, 'decom_time':10, 'lifespan': 120, 'maximum_capacity': 1500, 'maximum_generators': 0, 'minimum_area': 1.25E+06,  'fixed_cost_build': 600,      'fixed_cost_operate': 6.42,   'marginal_cost_build': 0, 'marginal_cost_operate': 1.02, 'decomission_cost': 0,  'description': ""},
  {'maintype': "hydro",       'subtype': "",       'name': "Hydro",              'build_time': 40, 'decom_time':20, 'lifespan': 400, 'maximum_capacity': 1600, 'maximum_generators': 0, 'minimum_area': 4.65E+03,  'fixed_cost_build': 1632,     'fixed_cost_operate': 11.88,  'marginal_cost_build': 0, 'marginal_cost_operate': 1.97, 'decomission_cost': 0,  'description': ""},
  {'maintype': "new",         'subtype': "",       'name': "Undefined",          'build_time': 0,  'decom_time':0,  'lifespan': 0 ,  'maximum_capacity': 0,    'maximum_generators': 0,  'minimum_area': 0,         'fixed_cost_build': 0,        'fixed_cost_operate': 0,      'marginal_cost_build': 0, 'marginal_cost_operate': 0,    'decomission_cost': 0,  'description': ""}
]    

generator_types = [
  #                                                                     turns               turns               KW                      BTU/kWh                                    turns               per KW                 per kW-yr                 per MWh                           per MW
  {'id_facility_type': 1, 'id_power_type': 1, 'id_resource_type': 4, 'build_time': 24, 'decom_time': 32, 'nameplate_capacity': 1000, 'heat_rate': 10459.0, 'continuous': True, 'lifespan': 240, 'fixed_cost_build': 3180, 'fixed_cost_operate': 36, 'variable_cost_operate': 0.22,  'decomission_cost': 620000},
  {'id_facility_type': 1, 'id_power_type': 2, 'id_resource_type': 4, 'build_time': 24, 'decom_time': 32, 'nameplate_capacity': 1000, 'heat_rate': 10459.0, 'continuous': True, 'lifespan': 240, 'fixed_cost_build': 3180, 'fixed_cost_operate': 36, 'variable_cost_operate': 0.22,  'decomission_cost': 620000},
  {'id_facility_type': 2, 'id_power_type': 3, 'id_resource_type': 4, 'build_time': 16, 'decom_time': 4, 'nameplate_capacity': 60,   'heat_rate': 10459.0, 'continuous': True, 'lifespan': 240, 'fixed_cost_build': 3180, 'fixed_cost_operate': 36, 'variable_cost_operate': 12.05, 'decomission_cost': 620000},
  {'id_facility_type': 3, 'id_power_type': 7, 'id_resource_type': 5, 'build_time': 12, 'decom_time': 1, 'nameplate_capacity': 15,   'heat_rate': 1,       'continuous': True, 'lifespan': 100, 'fixed_cost_build': 1929, 'fixed_cost_operate': 30, 'variable_cost_operate': 7.28,  'decomission_cost': 50000},
  {'id_facility_type': 3, 'id_power_type': 7, 'id_resource_type': 5, 'build_time': 12, 'decom_time': 2, 'nameplate_capacity': 30,   'heat_rate': 1,       'continuous': True, 'lifespan': 100, 'fixed_cost_build': 1929, 'fixed_cost_operate': 30, 'variable_cost_operate': 7.28,  'decomission_cost': 50000},
  {'id_facility_type': 4, 'id_power_type': 9, 'id_resource_type': 6, 'build_time': 1, 'decom_time': 2, 'nameplate_capacity': 1,    'heat_rate': 0.2,     'continuous': True, 'lifespan': 160, 'fixed_cost_build': 4323, 'fixed_cost_operate': 29, 'variable_cost_operate': 0,     'decomission_cost': 90000},
  {'id_facility_type': 4, 'id_power_type': 9, 'id_resource_type': 6, 'build_time': 2, 'decom_time': 4, 'nameplate_capacity': 3,    'heat_rate': 0.2,     'continuous': True, 'lifespan': 160, 'fixed_cost_build': 4323, 'fixed_cost_operate': 29, 'variable_cost_operate': 0,     'decomission_cost': 90000},
  {'id_facility_type': 5, 'id_power_type': 5, 'id_resource_type': 2, 'build_time': 6,  'decom_time': 1, 'nameplate_capacity': 10,   'heat_rate': 7812.0,  'continuous': True, 'lifespan': 120, 'fixed_cost_build': 842,  'fixed_cost_operate': 13, 'variable_cost_operate': 3.86,  'decomission_cost': 17000},
  {'id_facility_type': 5, 'id_power_type': 5, 'id_resource_type': 2, 'build_time': 6,  'decom_time': 1, 'nameplate_capacity': 30,   'heat_rate': 7812.0,  'continuous': True, 'lifespan': 120, 'fixed_cost_build': 842,  'fixed_cost_operate': 13, 'variable_cost_operate': 3.86,  'decomission_cost': 17000},  
  {'id_facility_type': 6, 'id_power_type': 4, 'id_resource_type': 2, 'build_time': 8,  'decom_time': 6, 'nameplate_capacity': 100,  'heat_rate': 7812.0,  'continuous': True, 'lifespan': 120, 'fixed_cost_build': 1027, 'fixed_cost_operate': 11, 'variable_cost_operate': 2.75,  'decomission_cost': 17000},
  {'id_facility_type': 6, 'id_power_type': 4, 'id_resource_type': 2, 'build_time': 8,  'decom_time': 6, 'nameplate_capacity': 350,  'heat_rate': 7812.0,  'continuous': True, 'lifespan': 120, 'fixed_cost_build': 1027, 'fixed_cost_operate': 11, 'variable_cost_operate': 2.75,  'decomission_cost': 17000},
  {'id_facility_type': 6, 'id_power_type': 4, 'id_resource_type': 2, 'build_time': 8,  'decom_time': 6, 'nameplate_capacity': 500,  'heat_rate': 7812.0,  'continuous': True, 'lifespan': 120, 'fixed_cost_build': 1027, 'fixed_cost_operate': 11, 'variable_cost_operate': 2.75,  'decomission_cost': 17000},               
  {'id_facility_type': 7, 'id_power_type': 6, 'id_resource_type': 1, 'build_time': 16,  'decom_time': 7, 'nameplate_capacity': 500,  'heat_rate': 10465.0, 'continuous': True, 'lifespan': 120, 'fixed_cost_build': 3044, 'fixed_cost_operate': 36, 'variable_cost_operate': 3.79,  'decomission_cost': 75000},
  {'id_facility_type': 7, 'id_power_type': 6, 'id_resource_type': 1, 'build_time': 16,  'decom_time': 7, 'nameplate_capacity': 1000, 'heat_rate': 10465.0, 'continuous': True, 'lifespan': 120, 'fixed_cost_build': 3044, 'fixed_cost_operate': 36, 'variable_cost_operate': 3.79,  'decomission_cost': 75000},
  {'id_facility_type': 7, 'id_power_type': 6, 'id_resource_type': 1, 'build_time': 16,  'decom_time': 7, 'nameplate_capacity': 2000, 'heat_rate': 10465.0, 'continuous': True, 'lifespan': 120, 'fixed_cost_build': 3044, 'fixed_cost_operate': 36, 'variable_cost_operate': 3.79,  'decomission_cost': 75000},
  {'id_facility_type': 8, 'id_power_type': 8, 'id_resource_type': 3, 'build_time': 40, 'decom_time': 20, 'nameplate_capacity': 100,  'heat_rate': 1,       'continuous': True, 'lifespan': 400, 'fixed_cost_build': 408,  'fixed_cost_operate': 3,  'variable_cost_operate': 0.49,  'decomission_cost': 50000},
  {'id_facility_type': 8, 'id_power_type': 8, 'id_resource_type': 3, 'build_time': 40, 'decom_time': 20, 'nameplate_capacity': 200,  'heat_rate': 1,       'continuous': True, 'lifespan': 400, 'fixed_cost_build': 408,  'fixed_cost_operate': 3,  'variable_cost_operate': 0.49,  'decomission_cost': 50000},
  {'id_facility_type': 8, 'id_power_type': 8, 'id_resource_type': 3, 'build_time': 40, 'decom_time': 20, 'nameplate_capacity': 300,  'heat_rate': 1,       'continuous': True, 'lifespan': 400, 'fixed_cost_build': 408,  'fixed_cost_operate': 3,  'variable_cost_operate': 0.49,  'decomission_cost': 50000} 
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
  {'name': "coal",                  'unit': "lb",   'available': True, 'average_price': 0.024,  'energy_content': 10075},
  {'name': "natural gas",           'unit': "ft^3", 'available': True, 'average_price': 0.004,  'energy_content': 1036},
  {'name': "water",                 'unit': "ft^3", 'available': True, 'average_price': 0,      'energy_content': 0},
  {'name': "uranium dioxide (UO2)", 'unit': "lb",   'available': True, 'average_price': 1390,   'energy_content': 2.15e8},
  {'name': "wind",                  'unit': "na",   'available': True, 'average_price': 0,      'energy_content': 0},
  {'name': "sun",                   'unit': "na",   'available': True, 'average_price': 0,      'energy_content': 0}
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
]

generator_modification_types = [
  {'id_facility_type':  1,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_facility_type':  2,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_facility_type':  3,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_facility_type':  4,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_facility_type':  5,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_facility_type':  6,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_facility_type':  7,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
  {'id_facility_type':  8,  'name': 'weatherize', 'value': 0, 'marginal_cost_build': 0, 'marginal_cost_operate': 0, 'marginal_area': 0},
]

prompt_types = [
  {
    'title' : 'welcome',
    'category': 'Company Memo', 
    'image': 'default.png', 
    'priority': 'information', 
    'scope': 'company',
    'short_description' : 'Welcome to the family!',
    'long_description' : 'We\'d like to congratulate you on your new appointment as CEO of {}. We have confidence that you will help this company prosper within the coming years.',
  },
  {
    'title' : 'facility-active',
    'category': 'Company Memo', 
    'image': 'default.png', 
    'priority': 'information', 
    'scope': 'facility',
    'short_description' : 'Facility is back online.',
    'long_description' : 'The power facility, {}, has come back online and is available to provide electrical power to the masses.',
  },
  {
    'title' : 'facility-inactive',
    'category': 'Company Memo', 
    'image': 'default.png', 
    'priority': 'danger', 
    'scope': 'facility',
    'short_description' : 'Facility has become unavailable.',
    'long_description' : 'The power facility, {}, is now unavailable to produce electrical power',
  },
  {
    'title': 'generator-condition-bad',
    'category': 'Company Memo',
    'image': 'default.png', 
    'priority': 'warning', 
    'scope': 'generator',
    'short_description' : 'A generator has been made unavailable.',
    'long_description' : 'A generator within facility, {}, has degraded to a condition which makes it inefficient to run. It has been made unavailable to the facility.',
  },
  {
    'title': 'generator-built',
    'category': 'Company Memo',
    'image': 'default.png', 
    'priority': 'information', 
    'scope': 'generator',
    'short_description' : 'A new generator has been built.',
    'long_description' : 'A new generator has finished building and is now available for use in facility, {}.',
  },
  {
    'title' : 'heatwave',
    'category': 'News Brief', 
    'image': 'default.png', 
    'priority': 'warning', 
    'scope': 'company',
    'short_description' : 'Hot out here.',
    'long_description' : 'A heatwave has struck and is expected to last for {} days, increasing energy demand by as much as {} percent.',
  },
  {
    'title' : 'hurricane-affected',
    'category': 'Company Memo', 
    'image': 'default.png', 
    'priority': 'danger', 
    'scope': 'company',
    'short_description' : 'Hurricane making landfall!',
    'long_description' : 'A hurricane has struck, and {} of your facilities are expected to be offline for {} days.',
  },
  {
    'title' : 'hurricane-unaffected',
    'category': 'Company Memo', 
    'image': 'default.png', 
    'priority': 'warning', 
    'scope': 'company',
    'short_description' : 'Swirly clouds coming ashore.',
    'long_description' : 'A hurricane has struck, none of your facilities were directly affected.',
  },  
  {
    'title' : 'blizzard-affected',
    'category': 'Company Memo', 
    'image': 'default.png', 
    'priority': 'danger', 
    'scope': 'company',
    'short_description' : 'Lots of snowfall!',
    'long_description' : 'A blizzard has struck, and {} of your facilities were offline for {} days.',
  },
  {
    'title' : 'blizzard-unaffected',
    'category': 'News Brief', 
    'image': 'default.png', 
    'priority': 'information', 
    'scope': 'company',
    'short_description' : 'Lots of snowfall',
    'long_description' : 'A blizzard has struck but none of your facilities were affected.',
                                                                    #Sum of the nameplate capacity of all generators unavailable during the blizzard event.
  },    
]

