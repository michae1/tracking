## Concept
This is proof-of-concept of modular event tracking library.

### Goal

A multipurpose dynamically built frontend tracking library. 

### Structure (parts)

1. Sensors: multiple entities, plugandplay (detect events, timings, performanse) to be a list which could be loaded, all implementing single interface

2. Accumulator: entity to collect data events by size, time, performance possibility or relese immediately

3. Reporters: entity to send data via transport (xhr, image, websockets) implementing interface

4. Other handly things like enrichers (data from user agent, ip, 3rd party services, geo, consent, envirement), transformers, agregators etc.

### Configuration
Library shold be able to be configured and build (maybe custom parts were injected in build time)

Sample config: 
```json
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
```

### DI

Currently simple implementation to handle build time injection.


### Events
Events should be easily extended by adding new sensor.
Sample events:
*system/load etc
*track/load etc track/userinactive
*viewability/user actions etc



### Workflow
environment/user action/timing -----> sensor ----> accumulator -----> reporter