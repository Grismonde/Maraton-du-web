
var baseLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
            {
                attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href = "https://carto.com/attributions"> CARTO</a>', //paramètre pour ajouter le nom du fournisseur des tuiles
                zmaxZoom: 17, //rester aux alentours de vue
                minZoom: 5
            });
            
var map = L.map('map', {
    zoomControl : false,
    layers : [baseLayer]
});
map.setView([46.63728, 2.3382623], 6);

var info = L.control();
info.onAdd = function (map){
    this._div = L.DomUtil.create('div','info');
    this.update();
    return this._div;
};
info.update = function (props) {
    this._div.innerHTML = '<h2>Quantité de biodéchets</h2>' + (props ?
        '<br/><b>' + props.nom + '</b><br/>' + props.biodechets : '<br/> Sélectionner un région ou une collectivité');
};

info.addTo(map);

var legend = L.control({position : 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    var grades = [0, 20,40,60,80,100];
    var labels = [];
    var from, to;

    for (var i = 0; i< grades.length; i++) {
        from = grades[i];
        to =grades[i+1];
        console.log(getColor(to));

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"> </i>'+
            from + (to ? '&ndash;' + to + 'kg/an/H' : ' + kg/an/H')
        );
    }
    div.innerHTML = labels.join('<br>');
    return div;
}

legend.addTo(map);

function getColor(d) {
    return d > 100 ? '#993404' :
            d > 80 ? '#d95f0e' :
            d > 60 ? '#fe9929' :
            d > 40 ? '#fec44f' :
            d > 20 ? '#fee391' :
            '#ffffd4';
}

function style(feature) {
    return {
        color: "grey", //Couleur de la bordure du polygone(ici rouge)
        weight: 1, //Epaisseur de la bordure(ici rouge)
        opacity: 1,
        dashArray: '',
        fillColor: getColor(feature.properties.biodechets), //Couleur de l’intérieur du polygone(ici rouge)
        fillOpacity: 0.9 
    };
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: hightlightFeature,
        mouseout: resetHighlight,
        click:zoomToFeature
    });
    layer.bindPopup( "<strong>" + feature.properties.nom + "</strong><br/>" + "Quantité de biodéchets :  " + feature.properties.biodechets);
}

function hightlightFeature(e){
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    //info.update(layer.feauture.properties);
}


function resetHighlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: 'grey',
        dashArray: '',
        fillOpacity: 0.9
    });
}

function zoomToFeature(e){
    map.fitBounds(e.target.getBounds());
}
$.ajax({
    url: "resources/data/carte-chaleur.geojson",
    dataType: "json",
    success: function (vilaine) {
        
        var geojson = L.geoJson(vilaine,{
            style: style,
            onEachFeature: onEachFeature 
                //layer.bindPopup( "<strong>" + feature.properties.nom + "</strong><br/>" + "Quantité de biodéchets :  " + feature.properties.biodechets);
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
        