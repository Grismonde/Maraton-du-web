
var map = L.map('map');
map.setView([46.63728, 2.3382623], 6);

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
            {
                attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href = "https://carto.com/attributions"> CARTO</a>', //paramètre pour ajouter le nom du fournisseur des tuiles
                zmaxZoom: 17, //rester aux alentours de vue
                minZoom: 5,
                zoomControl: false
            }) 
            .addTo(map);
    $.ajax({
    url: "resources/data/vilaine.geojson",
    dataType: "json",
    success: function (vilaine) {
        
        L.geoJson(vilaine,{
            style: function (feature) {
                return {
                    color: "#999999", //Couleur de la bordure du polygone(ici rouge)
                    weight: 1, //Epaisseur de la bordure(ici rouge)
                    fillColor: d3.interpolateYlOrRd(feature.properties.densite / 150.94), //Couleur de l’intérieur du polygone(ici rouge)
                    fillOpacity: 0.6 //Opacité de l’intérieur du polygone
                };
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup( "<strong>" + feature.properties.nom + "</strong><br/>" + "Niveau de densité : " + feature.properties.densite );
            }
        }).addTo(map);
    }
});

$.ajax({
    url: "resources/data/collectivites.geojson", //Nom du fichier à charger.
    dataType: "json", //Type du fichier à charger.
    success: function (collectivites) {
        
        var siegeIcon = L.icon({
            iconUrl: 'resources/data/siege.png', //Image de l’icône
            iconSize: [30,30] //Taille de l’icône en pixels
        });
        
        var siegeLayer = L.geoJson(collectivites, {
            pointToLayer: function (feature, latlng) {
                var marker = L.marker(latlng, { icon: siegeIcon });
                marker.bindPopup('<h4>' + feature.properties.collectivite + 
                                            "</h4><p> Nombre d'habitant : " + feature.properties.nbhabitant +
                                            "<br/> Typologie d'habitation : " + feature.properties.typologie +
                                            "<br/> Nombre d'habitant concerné : " + feature.properties.habitantconcerne +
                                            "<br/> Quantité biodéchets (kg/an/H) : " + feature.properties.biodechets + '</p>');
                return marker;
            }
        }).addTo(map);
        
        function populateSiege () {
            console.log(collectivites);
            const ul = document.querySelector('.liste');
            collectivites.features.forEach((collectivite) => {
                const li = document.createElement('li');
                const div = document.createElement('div');
                const a = document.createElement('a');
                a.addEventListener('click',() => {
                    flyToCollectivite(collectivite);
                });
                div.classList.add('collectivite-item');
                a.innerText = collectivite.properties.collectivite;
                a.href = '#';

                div.appendChild(a);
                li.appendChild(div);
                ul.appendChild(li);
            });
        }
        populateSiege();

        function flyToCollectivite(siege) {
            const lat = siege.geometry.coordinates[1];
            const lng = siege.geometry.coordinates[0];
            map.flyTo([lat, lng], 10, {
                duration:3
            });
            setTimeout(() => {
                L.popup({offset : L.point(0,-8)})
                .setLatLng([lat,lng])
                .setContent('<h4>' + siege.properties.collectivite + 
                "</h4><p> Nombre d'habitant : " + siege.properties.nbhabitant +
                "<br/> Typologie d'habitation : " + siege.properties.typologie +
                "<br/> Nombre d'habitant concerné : " + siege.properties.habitantconcerne +
                "<br/> Quantité biodéchets (kg/an/H) : " + siege.properties.biodechets + '</p>')
                .openOn(map);
            }, 3000);
        }
    }
});
        