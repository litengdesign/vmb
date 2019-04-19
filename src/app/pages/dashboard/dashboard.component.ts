import { Component, OnInit } from '@angular/core';
import { loadModules } from 'esri-loader';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  constructor() { }
  ngOnInit() {
    // first, we use Dojo's loader to require the map class
    loadModules(['esri/views/MapView', 'esri/WebMap', "esri/widgets/BasemapToggle",
      "esri/widgets/BasemapGallery", "esri/widgets/Locate"])
      .then(([MapView, WebMap, BasemapToggle, BasemapGallery, Locate]) => {
        var webmap = new WebMap({
          portalItem: {
            // autocasts as new PortalItem()
            id: "f2e9b762544945f390ca4ac3671cfa72"
          }
        });
        var locate = new Locate({
          view: view,
          useHeadingEnabled: false,
          goToOverride: function (view, options) {
            options.target.scale = 1500;
            return view.goTo(options.target);
          }
        });
        var view = new MapView({
          map: webmap,
          container: "viewDiv"
        });
        var basemapGallery = new BasemapGallery({
          view: view,
          source: {
            portal: {
              url: "http://www.arcgis.com",
              useVectorBasemaps: true, // Load vector tile basemap group
            },
          }
        });

        view.ui.add(basemapGallery, "top-right"); // Add to the view
        view.ui.add(locate, "top-left");

      })
      .catch(err => {
        // handle any errors
        console.error(err);
      });
  }
}
