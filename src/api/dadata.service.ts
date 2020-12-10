const API_URL = 'https://suggestions.dadata.ru/suggestions/api'
const API_VERSION = '4_1'
const API_KEY = '8b5db846819b47f78300037311cb1d59a9c68d2c'

const getLocationByCoords = async (lat: number, lon: number): Promise<string> => {
  const options = {
    method: 'POST',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Token ' + API_KEY
    },
    body: JSON.stringify({ lat, lon })
  }
  const url = `${API_URL}/${API_VERSION}/rs/geolocate/address`
  const response = await fetch(url, options)
  if (!response.ok) {
    return 'Не удалось получить информацию об адресе.'
  }
  const data: any = await response.json()
  if (Array.isArray(data.suggestions) && data.suggestions.length) {
    return data.suggestions[0].data.city + ', ' + data.suggestions[0].data.region_with_type
  }
  return ''
}

export const DadataService = {
  getLocationByCoords
}
