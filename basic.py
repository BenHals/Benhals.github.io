import urllib.request
import json
import math
import datetime
def get_data(city):
	try:
		r = urllib.request.urlopen('http://api.openweathermap.org/data/2.5/weather?q=' + city)

		data = json.loads(r.readall().decode('utf-8'))
		date = datetime.datetime.fromtimestamp(data['dt']).strftime('%Y-%m-%d %H:%M:%S')
		print(' \n City: {0} in {5} as of {4}\n Average Temperature: {1} \n Weather: {2}, {3}'.format(data['name'], int(round(data['main']['temp'] - 272.15)), data['weather'][0]['main'], data['weather'][0]['description'], date, data['sys']['country']))
	except:
		print('\n Error - No cities with that name')
	else:
		pass
	user_response = input('Enter anouther location or nothing to exit: ')
	if user_response != '':
		get_data(user_response)

get_data('Auckland')