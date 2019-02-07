define([
  "jquery"
], function ($) {

  class ResourceLoader {
    constructor() { }

    loadResources(resources) {
      const checkResouceType = resource => {
        switch (resource.type) {
          case "img":
            return this._loadImageResource(resource);
          case "ajax":
            return this._loadAJAXResource(resource);
          default:
            return null;
        }
      }
      return Promise.all(resources.map(checkResouceType));
    }

    resourcesToObject(resources) {
      let resourcesObject = {};
      resources.forEach(resource => {
        resourcesObject[resource.name] = {
          type: resource.type,
          data: resource.data
        }
      });
      return resourcesObject;
    }


    _loadImageResource(resource) {
      return (new Promise(resolve => {
        const img = new Image();
        //console.log("new Image()");
        img.onload = (evt) => {
          //console.log("img.onload!!");
          resolve({
            name: resource.name,
            type: resource.type,
            data: evt.target
          });
        }
        img.onerror = () => {
          //console.log("img.onerror!!");
          resolve({ URI: resource.path, status: "error" });
        }
        img.src = resource.path;
      }));
    }

    _loadAJAXResource(resource) {
      return $.get(resource.path).promise().then(results => ({
        name: resource.name,
        type: resource.type,
        data: results
      }));
    }
  };

  return new ResourceLoader();
});