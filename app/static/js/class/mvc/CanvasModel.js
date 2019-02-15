define([
  "jquery",
  "ResourceLoader",
  "terrainLayer",
  "canvasData",
  "networkCallMap",
  "CityLayer",
  "FacilityLayer",
  "EventEmitter"
], function ($, ResourceLoader, terrainLayer, canvasData, networkCallMap, CityLayer, FacilityLayer, EventEmitter) {

  return (
    class CanvasModel extends EventEmitter {
      constructor() {
        super();
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
            let facilityLayer = new FacilityLayer(
              resources[canvasData.facilitySpriteConfig.name].data,
              canvasData.facilitySpriteConfig,
              canvasData.terrainImageConfig,
              canvasData.terrainSpriteConfig,
              resources[networkCallMap.facilityTable.name].data.facilities
            );
            resolve(facilityLayer.createTileMap());
          });
        });
      }

      testFunction() {
        console.log("testFunction");
      }

      getCityInformationHTML(id) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.viewCity.path + id)
          loaded.then((results) => {
            resolve(results);
          });
        });
      }

      getFacilityInformationHTML(id) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.viewFacility.path + id)
          loaded.then((results) => {
            resolve(results);
          });
        });
      }
    });
});
