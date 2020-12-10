const API_URL = '//api.openweathermap.org/data'
const API_VERSION = '2.5'
const API_KEY = 'da72101f3dc39e9fe060e061d52fb04e'
const API_LANG = 'ru'

const getByCoords = async (lat: number, lon: number): Promise<any> => {
  const weatherUrl = `${API_URL}/${API_VERSION}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&lang=${API_LANG}&appid=${API_KEY}`
  const response = await fetch(weatherUrl)
  if (!response.ok) {
    throw new Error('Не удалось получить информацию о погоде.')
  }
  return response.json()
}

export const OpenweathermapService = {
  getByCoords
}
