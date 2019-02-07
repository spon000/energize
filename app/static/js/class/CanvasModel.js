define([
  "jquery",
  "ResourceLoader",
  "terrainLayer",
  "canvasData",
  "networkCallMap",
  "CityLayer",
], function ($, ResourceLoader, terrainLayer, canvasData, networkCallMap, CityLayer) {

  return (
    class CanvasModel {
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
            console.log("CityLayer resource = ", resources);
            resolve(cityLayer.createTileMap());
          })

        });
      }
    })
});
