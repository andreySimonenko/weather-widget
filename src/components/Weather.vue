<template>
  <div class="weather-container">
    <div
      v-if="errorMsg"
      class="weather-container__message error"
    >
      {{ errorMsg }}
    </div>
    <div
      v-else-if="statusMsg"
      class="weather-container__message status"
    >
      {{ statusMsg }}
    </div>
    <div
      v-else-if="currentData"
      class="weather-widget weather-container__widget"
    >
      <div class="header weather-widget__header">
        <h1 class="header__title">{{ location }}</h1>
        <button
          class="header__location-btn"
          @click="loadWeatherByGeo"
        >
          <img src="../assets/geo.svg">
        </button>
      </div>

      <div class="weather-widget__weekday">{{ weekday }}</div>
      <div class="weather-widget__desc">{{ desc }}</div>
      <div class="weather-info weather-widget__info">
        <img class="weather-info__icon" :src="iconUrl" />
        <div class="weather-info__temp">
          <span class="weather-info__temp-value">{{ temp }}</span>
          <button
            class="weather-info__temp-metric-btn"
            :class="{active: isMetric}"
            @click="setIsMetric(true)"
          >°C</button>
          <span>|</span>
          <button
            class="weather-info__temp-metric-btn"
            :class="{active: !isMetric}"
            @click="setIsMetric(false)"
          >°F</button>
        </div>
        <div class="weather-info__indicators">
          <div>Ощущается как: {{ feelsLikeTemp }} °C</div>
          <div>Влажность: {{ humidity }}</div>
          <div>Давление: {{ pressure }}</div>
          <div>Ветер: {{ wind }}</div>
        </div>
      </div>

      <div class="weather-daily weather-widget__daily">
        <div
          v-for="dayWeather in dailyWeather"
          :key="dayWeather.dt"
          class="weather-daily__item"
          :class="{active: dayWeather.d === currentData}"
          @click="setCurrentData(dayWeather.d)"
        >
          <div class="weather-daily__title">{{ dayWeather.weekday }}</div>
          <div class="weather-daily__icon">
            <img class="weather-info__icon" :src="dayWeather.iconUrl" />
          </div>
          <div class="weather-daily__temp">
            <span>{{ dayWeather.dayTemp }}</span>
            <span>{{ dayWeather.nightTemp }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { OpenweathermapService } from '@/api/openweathermap.service'
import { GeoLocationService } from '@/api/geolocation.service'
import { DadataService } from '@/api/dadata.service'

@Component
export default class HelloWorld extends Vue {
  private statusMsg = ''
  private errorMsg = ''
  private isMetric = true
  private location = ''
  private currentData: any = null
  private dailyData: any = []

  get weekday (): string {
    return (new Date(this.currentData.dt * 1000)).toLocaleDateString('ru-RU', { weekday: 'long' })
  }

  get temp (): number | string {
    return this.getTemp(this.currentData.temp)
  }

  get feelsLikeTemp (): number | string {
    return this.getTemp(this.currentData.feels_like)
  }

  get humidity (): number | string {
    return `${this.currentData.humidity} %` || ''
  }

  get pressure (): number | string {
    return `${this.currentData.pressure} гПа` || ''
  }

  get wind (): number | string {
    return `${this.currentData.wind_speed} м/c` || ''
  }

  get weather (): any {
    if (Array.isArray(this.currentData.weather) && this.currentData.weather.length) {
      return this.currentData.weather[0]
    }
    return {}
  }

  get desc (): number {
    return this.weather.description
  }

  get iconUrl (): string {
    return this.weather.icon ? `//openweathermap.org/img/wn/${this.weather.icon}@2x.png` : ''
  }

  get dailyWeather (): Array<any> {
    return this.dailyData.map((d: any) => ({
      d: d,
      dt: d.dt,
      weekday: (new Date(d.dt * 1000)).toLocaleDateString('ru-RU', { weekday: 'short' }),
      iconUrl: Array.isArray(d.weather) && d.weather.length ? `//openweathermap.org/img/wn/${d.weather[0].icon}@2x.png` : '',
      dayTemp: d.temp.day ? `${this.getTemp(d.temp.day)}°` : '',
      nightTemp: d.temp.day ? `${this.getTemp(d.temp.night)}°` : ''
    }))
  }

  async mounted () {
    this.loadWeatherByGeo()
  }

  async loadWeatherByGeo (): Promise<void> {
    try {
      this.statusMsg = await GeoLocationService.isAllowLocation()
        ? 'Определение местоположения.'
        : 'Для получения прогноза погоды, требуется разрешить доступ на определение Вашего местоположения.'
      const coords = await GeoLocationService.getBrowserLocation()
      this.location = await DadataService.getLocationByCoords(coords.latitude, coords.longitude)

      this.statusMsg = 'Получаем прогноз погоды.'
      const data = await OpenweathermapService.getByCoords(coords.latitude, coords.longitude)
      this.currentData = data.current
      this.dailyData = data.daily

      this.statusMsg = ''
    } catch (error) {
      this.errorMsg = error
    }
  }

  setCurrentData (data: any): void {
    this.currentData = data
  }

  setIsMetric (value: boolean): void {
    this.isMetric = value
  }

  getTemp (data: any): number {
    let temp = 0
    if (typeof data === 'number') {
      temp = data
    } else if (typeof data === 'object') {
      temp = data.day
    }
    if (!this.isMetric) {
      temp = temp * 9 / 5 + 32
    }
    return Math.round(temp)
  }
}
</script>

<style scoped lang="scss">

.weather-container {}

.weather-container__message {
  border: 2px solid #b44444;
  padding: 15px;
  border-radius: 10px;

  &.error {
    background-color: #ffb5b5;
    border-color: #b44444;
  }

  &.status {
    background-color: #8efca1;
    border-color: #37a64f;
  }
}

.weather-container__widget {
  max-width: 900px;
}

.weather-widget {
  border: 1px solid #c5c8cd;
  border-radius: 10px;
  color: #878787;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
}

.header__title {
  margin: 0;
  font-weight: 400;
}

.header__location-btn {
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  width: 40px;
}

.weather-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  max-width: 450px;
}

.weather-info__temp {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.weather-info__temp-value {
  font-size: 55px;
  line-height: 50px;
}

.weather-info__temp-metric-btn {
  background: none;
  border: none;
  color: #c2c4d4;
  cursor: pointer;
  font-size: 18px;
  outline: none;
  &.active {
    color: #4f515d;
  }
}

.weather-info__indicators {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.weather-daily {
  display: flex;
  overflow-x: auto;
}

.weather-widget__daily {
  margin-top: 45px;
}

.weather-daily__item {
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  padding: 5px;
  text-align: center;

  &.active {
    border-color: #d4d4d4;
  }
}

.weather-daily__temp {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
}

</style>
