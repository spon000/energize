define([
  "jquery",
  "ResourceLoader",
  "terrainLayer",
  "canvasData",
  "networkCallMap",
  "CityLayer",
  "FacilityLayer",
  "MarkerLayer",
], function ($, ResourceLoader, terrainLayer, canvasData, networkCallMap, CityLayer, FacilityLayer, MarkerLayer) {

  return (
    class CanvasModel {
      constructor() {
        this._facilityLayer = null;
        this._cityLayer = null;
        this._playerMarkerLayer = null;
        this._facility_types = null;
        this._generator_types = null;
        this._resource_types = null;
      }

      // Getters...
      get facilityLayer() {
        return this._facilityLayer;
      }

      get cityLayer() {
        return this._cityLayer;
      }

      get playerMarkerLayer() {
        return this._playerMarkerLayer;
      }

      // Public methods
      getFacilityTypes(refresh = false) {
        if (this._facility_types && !refresh) {
        }

        return new Promise(resolve => {
          const loaded = ResourceLoader.loadResources([
            { name: networkCallMap.facilityTypesTable.name, type: "ajax", path: networkCallMap.facilityTypesTable.path },
            { name: networkCallMap.generatorTypesTable.name, type: "ajax", path: networkCallMap.generatorTypesTable.path },
            { name: networkCallMap.powerTypesTable.name, type: "ajax", path: networkCallMap.powerTypesTable.path }
          ]);

          loaded.then((results) => {
            let resources = ResourceLoader.resourcesToObject(results);
            resolve(resources);
          });
        });
      }

      getGeneratorTypes(refresh = false) {
        if (this._generator_types && !refresh) {
        }
      }

      getResourceTypes(refresh = false) {
        if (this._resource_types && !refresh) {
        }

      }

      getAllTypes(refresh = false) {
        return new Promise(resolve => {
          const loaded = ResourceLoader.loadResources([
            { name: networkCallMap.facilityTypesTable.name, type: "ajax", path: networkCallMap.facilityTypesTable.path },
            { name: networkCallMap.generatorTypesTable.name, type: "ajax", path: networkCallMap.generatorTypesTable.path },
            { name: networkCallMap.powerTypesTable.name, type: "ajax", path: networkCallMap.powerTypesTable.path }
          ]);

          loaded.then((results) => {
            let resources = ResourceLoader.resourcesToObject(results);
            resolve(resources);
          });
        });
      }

      getPlayerFacility(facilityId) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.playerFacility.path + facilityId)
          loaded.then((results) => {
            // console.log("results = ", results)
            resolve(results);
          });

          // const loaded = ResourceLoader.loadResources([
          //   { name: networkCallMap.playerFacility.name, type: "ajax", path: networkCallMap.playerFacility.path + facilityId }
          // ]);

          // loaded.then((results) => {
          //   console.log("results = ", results)
          // });
        });
      }

      getFacilityGenerators(facilityId) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.facilityGenerators.path + facilityId)
          loaded.then((results) => {
            resolve(results)
          });
        });
      }

      savePlayerFacility(facilityData) {

      }

      getPlayerFacilities(companyId) {

      }

      createTerrainTileMap() {
        return new Promise(resolve => {
          const loaded = ResourceLoader.loadResources([
            { name: canvasData.terrainImageConfig.name, type: "img", path: canvasData.terrainImageConfig.path },
            { name: canvasData.terrainSpriteConfig.name, type: "img", path: canvasData.terrainSpriteConfig.path }
          ]);

          loaded.then((results) => {
            // Convert results array into an object for easier access to data.
            let resources = ResourceLoader.resourcesToObject(results);
            let terrainTileMap = terrainLayer(
              resources[canvasData.terrainImageConfig.name].data,
              resources[canvasData.terrainSpriteConfig.name].data,
              canvasData.terrainImageConfig,
              canvasData.terrainSpriteConfig
            );
            // console.log("terrainTileMap = ", terrainTileMap);
            resolve(terrainTileMap);
          });
        });
      }

      createCityTileMap() {
        return new Promise(resolve => {
          const loaded = ResourceLoader.loadResources([
            { name: canvasData.citySpriteConfig.name, type: "img", path: canvasData.citySpriteConfig.path },
            { name: networkCallMap.cityTable.name, type: "ajax", path: networkCallMap.cityTable.path },
          ]);

          loaded.then((results) => {
            let resources = ResourceLoader.resourcesToObject(results);
            let cityLayer = new CityLayer(
              resources[canvasData.citySpriteConfig.name].data,
              canvasData.citySpriteConfig,
              canvasData.terrainImageConfig,
              canvasData.terrainSpriteConfig,
              resources[networkCallMap.cityTable.name].data.cities
            );
            this._cityLayer = cityLayer;
            resolve(cityLayer.createTileMap());
          })

        });
      }

      createFacilityTileMap() {
        return new Promise(resolve => {
          const loaded = ResourceLoader.loadResources([
            { name: canvasData.facilitySpriteConfig.name, type: "img", path: canvasData.facilitySpriteConfig.path },
            { name: networkCallMap.facilityTable.name, type: "ajax", path: networkCallMap.facilityTable.path }
          ]);

          loaded.then((results) => {
            let resources = ResourceLoader.resourcesToObject(results);
            let facilities = resources[networkCallMap.facilityTable.name].data.facilities;
            let facilityLayer = new FacilityLayer(
              resources[canvasData.facilitySpriteConfig.name].data,
              canvasData.facilitySpriteConfig,
              canvasData.terrainImageConfig,
              canvasData.terrainSpriteConfig
            );
            this._facilityLayer = facilityLayer;
            this._facilityLayer.createFacilityTiles(facilities);
            resolve(facilityLayer.tileMap);
          });
        });
      }

      createPlayerMarkerTileMap() {
        return new Promise(resolve => {
          const loaded = ResourceLoader.loadResources([
            { name: canvasData.playerMarkerConfig.name, type: "img", path: canvasData.playerMarkerConfig.path },
            { name: networkCallMap.playerFacilities.name, type: "ajax", path: networkCallMap.playerFacilities.path }
          ]);

          loaded.then((results) => {
            let resources = ResourceLoader.resourcesToObject(results);
            let facilities = resources[networkCallMap.playerFacilities.name].data.facilities;
            // console.log("facilities = ", facilities);

            let playerMarkerLayer = new MarkerLayer(
              resources[canvasData.playerMarkerConfig.name].data,
              canvasData.playerMarkerConfig,
              canvasData.terrainImageConfig,
              canvasData.terrainSpriteConfig
            );
            this._playerMarkerLayer = playerMarkerLayer;
            this._playerMarkerLayer.createMarkerTiles(facilities);
            resolve(playerMarkerLayer.tileMap);
          });
        });
      }

      getCompanyData() {
        return new Promise(resolve => {
          const loaded = ResourceLoader.loadResources([
            { name: networkCallMap.companyTable.name, type: "ajax", path: networkCallMap.companyTable.path }
          ]);
          loaded.then((results) => {
            let resultsObj = ResourceLoader.resourcesToObject(results);
            resolve(resultsObj.companyTable.data.player_company);
          });
        });
      }

      getCityInformationHTML(id) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.viewCity.path + "cid=" + id)
          loaded.then((results) => {
            resolve(results);
          });
        });
      }

      getFacilityInformationHTML(id) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.viewFacility.path + "fid=" + id)
          loaded.then((results) => {
            resolve(results);
          });
        });
      }
    });
});
