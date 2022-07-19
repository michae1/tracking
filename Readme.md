Readme

Sensors multiple, plugandplay (detect events, timings, performanse) to be a list which could be loaded, all implementing interface

Accumulator one for this time (collect data events by size, time, performance possibility or send immediately)

Reporters one for this time send data via transport (xhr, image, websockets) same interface

Enrichers multiple get data from user agent, ip, 3rd party services, geo, consent

Config: 

{
	sensors: [x,y,z],
	accumulator: a
	reporter: {
		b,
		options: {
			url: 'xxx'
		}
	}

}

todo: change sensors from static classes to objects/instances