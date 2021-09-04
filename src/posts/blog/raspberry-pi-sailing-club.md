---
slug: "raspberry-pi-weather-station"
type: "blog"
example: false
showInList: false
date: "2017-07-01"
title: "Resin.io Weather Station on the Raspberry Pi"
---

My local sailing club, where I’ve been sailing for a long time, has had a Davis Vantage Vue for the last few years with its console in the Clubhouse. This is fantastic for those preparing to start a race, as they check the current wind speed and air temperature before setting sail. The trouble is that in Britain the wind isn’t always that predictable or reliable, so I’d always thought it would be nicer to be able to access that same weather information online, so I can decide whether it’s worth getting up in the morning to go sailing! BBC Weather is quite good in giving you a rough idea - but the club’s weather station, mounted in the bay at roughly the same height as the top of a sail, is far more useful to a sailor.

image
image

I started the project by attempting to build my own weather station, bodging together various components from Maplin and other suppliers and hooking them up to a Raspberry Pi but though I was able to get speed information up and running within minutes, using relay switches to determine the wind direction was a completely different kettle of fish, and one that proved beyond me and my small budget.

A few days of grumpiness later, and I’d found a forum posting by Rob Smith discussing his Clone Davis Datalogger. £50 and a few days later I had one of these shiny gizmos in my hand and was ready to hook it up to the Vantage Vue. But a blog post from Pi Towers stopped me in my tracks, and another £9.60 fell out of my pocket – as they’d announced the brand new Raspberry Pi Zero WiFi! This was perfect for this project, as the console for the weather station was a fair old way from the router in the clubhouse, so I was previously intending to rely on a 3rd party dongle to provide internet to the Pi Zero, which would have involved another micro USB to USB A dongle and therefore taken up more space.

image

Fast forward a few months, and I had hooked up the Pi to the weather station console, got it some power and used a spare 230v surface mount box and blanking plate as a rudimentary project box, mounted to the wall above a power socket with a USB output to power the Pi

image

Throughout the process a fair bit of effort had gone into writing the code to power the weather station - my aim was to upload a reading from the station every 20 seconds or so to my server and then to store it in an SQLite database, before displaying it on a static site that called my server through JQuery Ajax. For me the perfect solution was Resin.io. I’ve used them a fair few times before for various projects, and every Pi I own runs on their platform. The key advantage for me was that the Pi Zero W could run unattended for years at a time, with all updates and source code changes built remotely, and then downloaded by the device itself as appropriate, without any effort from me. Should anything go wrong (which sadly dealing with some archaic Davis transfer protocols meant it did) I could quickly git push to deploy, and rest easy knowing I’d never have to physically reboot the device in the event of a problem - working 200 miles away. 

The project runs using a Python script to interact with the serial link to the console, and communicate with the server over https based json requests, which are interpreted by a php7 script. The health of the system is monitored by sentry.io to whom all exceptions are automatically reported, and Uptime Robot, which monitors the health of the data coming from the Pi, and emails me accordingly. 

image

Finally, there’s more work to do - with caching of requests that can’t be sent due to internet issues at the clubhouse on the list, but also securing a more stable power supply for the Pi - so it isn’t taken down by power outages at the club as often. 

I can’t thank Resin.io & the Raspberry PI foundation enough for their awesome products, and to Rob for his cool little datalogger that made this whole project possible. 

*Update (23rd July 2017)*

Permanent power supply installed, and device moved to a more suitable location 