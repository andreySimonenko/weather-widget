const isAllowLocation = async (): Promise<boolean> => {
  if ('permissions' in navigator) {
    const status = await navigator.permissions.query({ name: 'geolocation' })
    return status.state === 'granted'
  }
  return true
}

const getBrowserLocation = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: Infinity
      }
      const success = async (pos: any): Promise<void> => {
        resolve(pos.coords)
      }
      const error = (err: any): void => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            reject(new Error('Определение местоположения запрещенно. Необходимо разрешить его в настройках браузера.'))
            break

          case err.POSITION_UNAVAILABLE:
            reject(new Error('Не удалось определить местоположение. Воспользуйтесь другим браузером.'))
            break

          case err.TIMEOUT:
            reject(new Error('Не удалось определить местоположение. Повторите попытку позже.'))
            break
        }
      }
      navigator.geolocation.getCurrentPosition(success, error, options)
    } else {
      reject(new Error('Не удалось определить местоположение. Воспользуйтесь другим браузером.'))
    }
  })
}

export const GeoLocationService = {
  isAllowLocation,
  getBrowserLocation
}
