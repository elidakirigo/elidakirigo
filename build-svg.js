const WEATHER_API_KEY = process.env.WEATHER_API_KEY
const alternative_weather_api =
  'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m'

let fs = require('fs')
let got = require('got')
let qty = require('js-quantities')
let formatDistance = require('date-fns/formatDistance')

let WEATHER_DOMAIN = 'http://dataservice.accuweather.com'

const emojis = {
  1: '☀️',
  2: '☀️',
  3: '🌤',
  4: '🌤',
  5: '🌤',
  6: '🌥',
  7: '☁️',
  8: '☁️',
  11: '🌫',
  12: '🌧',
  13: '🌦',
  14: '🌦',
  15: '⛈',
  16: '⛈',
  17: '🌦',
  18: '🌧',
  19: '🌨',
  20: '🌨',
  21: '🌨',
  22: '❄️',
  23: '❄️',
  24: '🌧',
  25: '🌧',
  26: '🌧',
  29: '🌧',
  30: '🥵',
  31: '🥶',
  32: '💨',
}

// Cheap, janky way to have variable bubble width
dayBubbleWidths = {
  Monday: 235,
  Tuesday: 235,
  Wednesday: 260,
  Thursday: 245,
  Friday: 220,
  Weekend: 245,
  // Saturday: 245,
  // Sunday: 230,
}

// Time working at PlanetScale
const today = new Date()
let todayDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
  today
)

const time = new Intl.DateTimeFormat('en-GB', { timeStyle: 'long' })
  .format(today)
  .toString()
  .split(':')

todayDay =
  todayDay == 'Friday' && time[0] >= 20 ? (todayDay = 'Weekend') : todayDay

const psTime = formatDistance(new Date(2020, 12, 14), today, {
  addSuffix: false,
})

// Today's weather
// const locationKey = '318251'
// let url = `forecasts/v1/daily/1day/${locationKey}?apikey=${WEATHER_API_KEY}`
// console.log(url)
// got(url, { prefixUrl: alternative_weather_api })
got(alternative_weather_api)
  .then((response) => {
    // console.log(response.body)
    let json = JSON.parse(response.body)
    // console.log(json)
    const degF = Math.round(json.current_weather.Temperature)
    // const degC = Math.round(qty(`${degF} tempF`).to('tempC').scalar)
    // const icon = json.DailyForecasts[0].Day.Icon

    fs.readFile('template.svg', 'utf-8', (error, data) => {
      if (error) {
        return
      }

      data = data.replace('{degC}', degF)
      // data = data.replace('{weatherEmoji}', emojis[icon])
      data = data.replace('{psTime}', psTime)
      data = data.replace('{todayDay}', todayDay)
      data = data.replace('{dayBubbleWidth}', dayBubbleWidths[todayDay])

      data = fs.writeFile('chat.svg', data, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
    })
  })
  .catch((err) => {
    // TODO: something better
    console.log(err)
  })
