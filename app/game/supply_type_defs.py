facility_types = [
  {'maintype': "nuclear",     'subtype': "",       'name': "Nuclear",            'build_time': 10, 'minimum_area': 100, 'fixed_cost_build': 100, 'fixed_cost_operate': 100, 'marginal_cost_build': 100, 'marginal_cost_operate': 100, 'description': ""},
  {'maintype': "nuclear",     'subtype': "SMR",    'name': "Nuclear SMR",        'build_time': 10, 'minimum_area': 100, 'fixed_cost_build': 100, 'fixed_cost_operate': 100, 'marginal_cost_build': 100, 'marginal_cost_operate': 100, 'description': ""},
  {'maintype': "wind",        'subtype': "",       'name': "Wind",               'build_time': 10, 'minimum_area': 100, 'fixed_cost_build': 100, 'fixed_cost_operate': 100, 'marginal_cost_build': 100, 'marginal_cost_operate': 100, 'description': ""},
  {'maintype': "solar",       'subtype': "",       'name': "Solar",              'build_time': 10, 'minimum_area': 100, 'fixed_cost_build': 100, 'fixed_cost_operate': 100, 'marginal_cost_build': 100, 'marginal_cost_operate': 100, 'description': ""},  
  {'maintype': "natural gas", 'subtype': "peaker", 'name': "Natural Gas Peaker", 'build_time': 10, 'minimum_area': 100, 'fixed_cost_build': 100, 'fixed_cost_operate': 100, 'marginal_cost_build': 100, 'marginal_cost_operate': 100, 'description': ""},  
  {'maintype': "natural gas", 'subtype': "",       'name': "Natural Gas",        'build_time': 10, 'minimum_area': 100, 'fixed_cost_build': 100, 'fixed_cost_operate': 100, 'marginal_cost_build': 100, 'marginal_cost_operate': 100, 'description': ""},
  {'maintype': "coal",        'subtype': "",       'name': "Coal",               'build_time': 10, 'minimum_area': 100, 'fixed_cost_build': 100, 'fixed_cost_operate': 100, 'marginal_cost_build': 100, 'marginal_cost_operate': 100, 'description': ""},
  {'maintype': "hydro",       'subtype': "",       'name': "Hydro",              'build_time': 10, 'minimum_area': 100, 'fixed_cost_build': 100, 'fixed_cost_operate': 100, 'marginal_cost_build': 100, 'marginal_cost_operate': 100, 'description': ""}
]

generator_types = [
  {'id_facility_type': 1, 'id_power_type': 1, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 500,  'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 1, 'id_power_type': 1, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 1000, 'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 1, 'id_power_type': 1, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 1500, 'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 1, 'id_power_type': 2, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 500,  'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 1, 'id_power_type': 2, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 1000, 'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 1, 'id_power_type': 2, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 1500, 'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 2, 'id_power_type': 3, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 20,  'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 2, 'id_power_type': 3, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 30,  'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 2, 'id_power_type': 3, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 50,  'efficiency': 100, 'continuous': True, 'lifespan': 30},               
  {'id_facility_type': 3, 'id_power_type': 7, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 10,   'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 3, 'id_power_type': 7, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 15,   'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 3, 'id_power_type': 7, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 20,   'efficiency': 100, 'continuous': True, 'lifespan': 30},               
  {'id_facility_type': 4, 'id_power_type': 9, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 10,   'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 4, 'id_power_type': 9, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 15,   'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 4, 'id_power_type': 9, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 20,   'efficiency': 100, 'continuous': True, 'lifespan': 30},               
  {'id_facility_type': 5, 'id_power_type': 5, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 10,   'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 5, 'id_power_type': 5, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 20,   'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 5, 'id_power_type': 5, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 50,   'efficiency': 100, 'continuous': True, 'lifespan': 30},  
  {'id_facility_type': 6, 'id_power_type': 4, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 100,  'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 6, 'id_power_type': 4, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 350,  'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 6, 'id_power_type': 4, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 500,  'efficiency': 100, 'continuous': True, 'lifespan': 30},               
  {'id_facility_type': 7, 'id_power_type': 6, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 500,  'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 7, 'id_power_type': 6, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 1000, 'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 7, 'id_power_type': 6, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 2000, 'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 8, 'id_power_type': 8, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 100,  'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 8, 'id_power_type': 8, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 200,  'efficiency': 100, 'continuous': True, 'lifespan': 30},
  {'id_facility_type': 8, 'id_power_type': 8, 'id_resource_type': 1, 'build_time': 10, 'nameplate_capacity': 250,  'efficiency': 100, 'continuous': True, 'lifespan': 30}         
]

power_types = [
  {'maintype': "BWR", 'description': ""},
  {'maintype': "PWR", 'description': ""},
  {'maintype': "SMR", 'description': ""},
  {'maintype': "Large", 'description': ""},
  {'maintype': "Peaker", 'description': ""},
  {'maintype': "Coal", 'description': ""},
  {'maintype': "Wind", 'description': ""},
  {'maintype': "Hydro", 'description': ""},
  {'maintype': "Solar", 'description': ""}
]

resource_types = [
  {'name': "", 'unit': "", 'available': True}
]


