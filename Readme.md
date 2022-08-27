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


events:
system/load etc
track/load etc track/userinactive

system-----> sensor ----track----->reporter(queued/realtime)


Business model:
* measure user metrics, use either our backend or external (google analytics)
* test new code against all with a/b test
* test new integrations with a/b test

* detect banners metrics
* detect slow code
* detect code produces shifts
* detect performance issues for region, browser etc

get all loaded js, store landscape as state for current load


what exactly to get:
I would like to get avg load on pages with google analytics
I would like to get most loaded page on site
I would like to get page with most inactive user behaviour


tracking:
datetime,            user_session, cpuload, memload, libs[],        path,       domain, activity level.
2022-10-10 10:10:10, xxxx,         50%,     30%,     [jquery, ga],  '/s.html',  s.com , 50% 
