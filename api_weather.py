import requests

def get_weather(api_key, location, days=1, aqi='no', alerts='no'):
    base_url = 'http://api.weatherapi.com/v1/forecast.json'
    params = {
        'key': api_key,
        'q': location,
        'days': days,
        'aqi': aqi,
        'alerts': alerts
    }

    response = requests.get(base_url, params=params)
    data = response.json()

    if response.status_code == 200:
        current_condition = data['current']['condition']['text']
        temperature_celsius = data['current']['temp_c']

        return f"The current weather in {location} is {temperature_celsius}°C with {current_condition}."
    else:
        return f"Error: {data['error']['message']}"

api_key = 'b546710a0aec466dbc150610231212'
location = 'Ulan_bator'
weather_info = get_weather(api_key, location)
print(weather_info)
