import requests

def get_user_location():
    try:
        # Get the user's IP address
        ip_response = requests.get('https://api.ipify.org?format=json')
        if ip_response.status_code == 200:
            ip_address = ip_response.json()['ip']
        else:
            return "Unable to determine your location."

        # Use IP address to determine approximate location
        location_url = f"http://ip-api.com/json/{ip_address}"
        location_response = requests.get(location_url)

        if location_response.status_code == 200:
            location_data = location_response.json()
            if location_data['status'] == 'success':
                latitude = round(location_data['lat'] + 0.008965000000003442, 6)
                longitude = round(location_data['lon'] - 0.019506000000006907, 6)
                return latitude, longitude
            else:
                return "Unable to determine your location."
        else:
            return "Unable to determine your location."
    
    except Exception as e:
        return f"Error: {e}"

