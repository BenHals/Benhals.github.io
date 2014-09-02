#!/usr/bin/python
import urllib2
import json
import math
import datetime
import cgi

def get_data(city):
	try:
	
		r = urllib2.urlopen('http://api.openweathermap.org/data/2.5/weather?q=' + city)
		data = json.load(r)
		date = datetime.datetime.fromtimestamp(data['dt']).strftime('%Y-%m-%d %H:%M:%S')
		print "content-type: text/html \n\n"
		print ' \n City: {0} in {5} as of {4}\n Average Temperature: {1} \n Weather: {2}, {3}'.format(data['name'], int(round(data['main']['temp'] - 272.15)), data['weather'][0]['main'], data['weather'][0]['description'], date, data['sys']['country'])
	except:
		print '\n Error - No cities with that name'
		
def get_json_weather(city):
	try:
		r = urllib2.urlopen('http://api.openweathermap.org/data/2.5/weather?q=' + city)
		data = json.load(r)
	except:
		data = None
	return data

form = cgi.FieldStorage()

print form["cityInput"]