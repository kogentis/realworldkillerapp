    Ext.application({
        name: 'Sencha',
        launch: function() {
            // defines a store object with needed fields
            Ext.create('Ext.data.Store', {
                storeId: 'DroneStore',
                fields: ['bij_summary_short','lat','lon','country','town','location','deaths','civilians','children',{
                	name: 'date',
                	type: 'date',
                	//dateFormat: 'd-m-Y g:i A',
                    defaultValue: true
                }],
                autoLoad :true,
                // executes an ajax call and parses the data into data store         
                proxy: {                	
                    type: 'jsonp',
                    url: 'http://api.dronestre.am/data',
                    reader: {
                        type: 'json',
                        rootProperty: 'strike'
                    }
                }
            });        
            Ext.create("Ext.tab.Panel", {
                fullscreen: true,
                tabBarPosition: 'bottom',

                items: [
                    {
                        title: 'Home',
                        iconCls: 'home',
                        cls: 'home',
                        styleHtmlContent: true,
                        html: [
                            '<fieldset>',
                            '<legend>Sencha Touch 2 App</legend>',
                            '<center><img width="10%" hight="10%" src="http://media.tumblr.com/a8b15dba3823a857d050998d3dbcebe4/tumblr_inline_mlb5ccYc8V1qz4rgp.png" /></center>',
                            '<h1>real world killer app</h1>',
                            '<p align="justify">This app demonstrates Sencha Touch 2 visualisations for parsed json data.</p>',
                            '<ul>',
                            '	<li>polls via ajax json data from the API at dronestre.am</li>',
                            '	<li>parse it into a Sencha Ext JS data store object</li>',
                            '	<li>shows the content of the data store in a Ext JS List DataView</li>',
                            '	<li>embeds a Ext JS Map to show a Google Map</li>',
                            '	<li>parses the geo data from store into a GMap marker object</li>	',
                            '	<li>creates for each strike a marker at the Google Map</li>	',
                            '</ul>',
                            '<p align="justify">powered by Sencha Touch / data stream by dronestre.am </p>',
                            '</fieldset>'
                        ].join("")
                    },
                    {
                        xtype: 'list',
                        title: 'Kills',
                        iconCls: 'delete',
                        store: 'DroneStore',
                        itemTpl: '<div class="contact">{bij_summary_short}</div><br><div class="location">location: <strong> {town} in {location}</strong></div> <br> <div class="deaths">deaths: <strong>{deaths} on {date:date("d.m.Y");} </strong></div><br> <div class="civilians">killed civilians: <strong>{civilians} / killed children {children} </strong></div>'

                    },
                    {
                    	title: 'Map',
                    	iconCls: 'maps',
                        xtype: 'map',
                        id:'map',
                        mapOptions: {                        	
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            center: new google.maps.LatLng(52.734375,20.277656),
                            //center: new google.maps.LatLng(45.322755,15.47467),
                            zoom: 4
                        },
                        useCurrentLocation: false,
                        listeners: {
                     	
                        	
                        	maprender : function(comp, map) {

                            //console.log('listener -> maprender');
                            
                            var store = Ext.getStore('DroneStore');

                            var position = '';
                            var message = '';
                          
                            store.on('load',function(store, records, successful){
	                            
                            	store.each(function(record,id){

	                            	position = new google.maps.LatLng(record.get('lat'),record.get('lon'));
	                            	message = record.get('bij_summary_short') + ' Date: '  + Ext.Date.format(record.get('date'), "d.m.Y") + ' Location: ' + record.get('location') ;
	                                
	                            	var contentString = '<div id="bodyContent">' +
	                            						record.get('bij_summary_short') + 
	                            						' Date: '  + Ext.Date.format(record.get('date'), "d.m.Y") + 
	                            						' Location: ' + record.get('location') + '</div>';

	                            	
	                            	var infowindow = new google.maps.InfoWindow({
	                            	      content: contentString
	                            	});
	                            	
	                            	marker = new google.maps.Marker({
	                                    position: position,
	                                    title: message,
	                                    map: map,
	                        	        draggable: false,
	                        	        animation: google.maps.Animation.DROP,
	                                    visible: true
	                                });
	                            	
	                            	google.maps.event.addListener(marker, 'click', (function(marker) {
	                                        return function() {
	                                        	infowindow.setContent(contentString);
	                                        	infowindow.open(map,marker);
	                                       }
	                            	})(marker));
	                            }); //store each
                            }, this);
                        	}
                        }
                    	
                    },
                    {
                        title: 'Info',
                        iconCls: 'info',
                        cls: 'info',
                        styleHtmlContent: true,
                        html: [
                            '<p align="justify">This app demonstrates Sencha Touch 2 visualisations for parsed json data.</p>',
                            '<ul>',
                            '	<li>coded by Michael Schratz / kogentis@googlemail.com</li>',                            
                            '	<li>for Web Engineering II: Developing Mobile HTML5 App</li>', 
                            '	<li>source available on <a href="https://github.com/kogentis/realworldkillerapp">github</a></li>',
                            '</ul>',
                            '<p align="justify">powered by Sencha Touch / data stream by dronestre.am </p>'

                        ].join("")
                    },
                    {
                        title: 'Contact',
                        iconCls: 'user',
                        xtype: 'formpanel',
                        url: 'contact.php',
                        layout: 'vbox',

                        items: [
                            {
                                xtype: 'fieldset',
                                title: 'Contact me',
                                instructions: '(email address is optional)',
                                height: 285,
                                items: [
                                    {
                                        xtype: 'textfield',
                                        label: 'Name'
                                    },
                                    {
                                        xtype: 'emailfield',
                                        label: 'Email'
                                    },
                                    {
                                        xtype: 'textareafield',
                                        label: 'Message'
                                    }
                                ]
                            },
                            {
                                xtype: 'button',
                                text: 'Send',
                                ui: 'confirm',
                                handler: function() {
                                    this.up('formpanel').submit();
                                }
                            }
                        ]
                    }


                ]
           
            });
        }
    });