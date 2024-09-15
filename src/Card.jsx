/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import _ from 'lodash'
import { useState, useEffect } from 'react'
import { Combobox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import questionmark from '../src/assets/questionmark.jpg'
import weatherIcons from './weathericons.js'
import notfound from '../src/assets/notfound.jpg'

export default function Card() {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestionsList, setSuggestionsList] = useState([])
  const [weatherData, setWeatherData] = useState('initial')
  const [selectedCity, setSelectedCity] = useState('')
  const [displayedCity, setDisplayedCity] = useState('')

  const [weatherConditions, setWeatherConditions] = useState([])
  const [forecastDay, setForecastDay] = useState('current')
  const [forecastDate, setForecastDate] = useState(0)

  function getWeatherConditions(data) {
    setWeatherConditions([
      {
        condition: 'Temperature',
        units_primary: {
          display: true,
          value: _.get(_.get(data, forecastDay), 'temp_c'),
          symbol: '°C',
        },
        units_secondary: {
          display: false,
          value: _.get(_.get(data, forecastDay), 'temp_f'),
          symbol: 'F',
        },
      },
      {
        condition: 'Feels like',
        units_primary: {
          display: true,
          value: _.get(_.get(data, forecastDay), 'feelslike_c'),
          symbol: '°C',
        },
        units_secondary: {
          display: false,
          value: _.get(_.get(data, forecastDay), 'feelslike_f'),
          symbol: 'F',
        },
      },
      {
        condition: 'Wind speed',
        units_primary: {
          display: true,
          value: _.get(_.get(data, forecastDay), 'wind_kph'),
          symbol: 'km/h',
        },
        units_secondary: {
          display: false,
          value: _.get(_.get(data, forecastDay), 'wind_mph'),
          symbol: 'mph',
        },
      },
      {
        condition: 'Precipitation',

        units_primary: {
          display: true,
          value: _.get(_.get(data, forecastDay), 'precip_mm'),
          symbol: 'mm',
        },
        units_secondary: {
          display: false,
          value: _.get(_.get(data, forecastDay), 'precip_in'),
          symbol: 'in',
        },
      },
      {
        condition: 'Humidity',
        units_primary: {
          display: true,
          value: _.get(_.get(data, forecastDay), 'humidity'),
          symbol: '%',
        },
      },
    ])
  }

  useEffect(() => {
    if (searchQuery) {
      for (let i = 0; i < 1; i++) {
        handleCityAPI()
      }
    }
  }, [searchQuery])

  useEffect(() => {
    if (weatherData !== 'initial') {
      getWeatherConditions(weatherData)
    }
  }, [forecastDay, weatherData])

  async function handleWeatherAPI() {
    const apiKey = 'ae58c9330c1448dda6f194716240301'
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${selectedCity}&days=3`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      const data = await response.json()
      console.log('I am updating weatherData')
      if (!selectedCity) {
        setWeatherData(null)
      } else {
        setWeatherData(data)
        getWeatherConditions(data)
        console.log(
          console.log(`data is ${data.forecast.forecastday[1].hour[12]}`)
        )
      }
    } catch (error) {
      console.error(error)
      setWeatherData(null)
    }
  }

  async function handleCityAPI() {
    const apiUrl = `https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-500@public/records?select=geoname_id%2C%20name%2C%20country&where=%22${searchQuery}%22&limit=20`

    try {
      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      const data = await response.json()

      setSuggestionsList(data.results)
      if (data.results.length === 0) {
        setSelectedCity(null)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="flex flex-col gap-10 justify-start items-stretch font-['Poppins']">
      <div className="flex flex-row items-center justify-center gap-10 ">
        <SearchBar
          query={searchQuery}
          setQuery={(value) => setSearchQuery(value)}
          suggestions={suggestionsList}
          refreshSuggestions={handleCityAPI}
          getWeatherData={handleWeatherAPI}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
        <SearchButton
          getWeatherData={handleWeatherAPI}
          setDisplayedCity={setDisplayedCity}
          selectedCity={selectedCity}
          showCityAPI={handleCityAPI}
        />
      </div>
      <div className="flex justify-center items-center">
        <WeatherInfo
          cityName={displayedCity}
          weatherData={weatherData}
          weatherConditions={weatherConditions}
          setWeatherConditions={setWeatherConditions}
          setForecastDay={setForecastDay}
          forecastDay={forecastDay}
          getWeatherConditions={getWeatherConditions}
          setForecastDate={setForecastDate}
          forecastDate={forecastDate}
        />
      </div>
    </main>
  )
}

function SearchBar({
  query,
  setQuery,
  suggestions,
  refreshSuggestions,
  selectedCity,
  setSelectedCity,
}) {
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const filteredCities =
    query === ''
      ? suggestions
      : suggestions.filter((city) => {
          return city.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <div className="flex flex-col gap-10">
      <Combobox
        as="div"
        value={query.length > 0 ? selectedCity : ''}
        onChange={setSelectedCity}
      >
        <div className="relative">
          <Combobox.Input
            placeholder="What's the weather like in..."
            className=" w-full md:w-96 placeholder-white rounded-xl border-0 text-3xl bg-white py-3 pl-3 pr-10 text-black font-bold shadow-sm ring-4 ring-inset ring-[#FFAFCC] focus:ring-4 focus:ring-inset focus:ring-white"
            onChange={(event) => {
              setQuery(event.target.value)
              refreshSuggestions()
            }}
            displayValue={(selectedCity) => selectedCity}
            onBlur={() => refreshSuggestions()}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>

          {filteredCities.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredCities.map((city) => (
                <Combobox.Option
                  key={city.geoname_id}
                  value={city.name}
                  className={({ active }) =>
                    classNames(
                      'relative cursor-default select-none py-2 pl-8 pr-4',
                      active ? 'bg-[#FFAFCC] text-white' : 'text-gray-900'
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <span
                        className={classNames(
                          'block truncate',
                          selected && 'font-semibold'
                        )}
                      >
                        {`${city.name}, ${city.country}`}
                      </span>

                      {selected && (
                        <span
                          className={classNames(
                            'absolute inset-y-0 left-0 flex items-center pl-1.5',
                            active ? 'text-white' : 'text-[#A2D2FF]'
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </div>
  )
}

function SearchButton({
  getWeatherData,
  setDisplayedCity,
  selectedCity,
  showCityAPI,
}) {
  return (
    <button
      onClick={() => {
        getWeatherData()
        if (selectedCity) {
          setDisplayedCity(selectedCity)
        } else {
          setDisplayedCity('')
        }
        showCityAPI()
      }}
      type="button"
      className="rounded-xl bg-[#FFAFCC] border-4 border-[#FFAFCC] text-white hover:bg-[#FFC8DD] text-3xl font-bold px-3.5 py-2.5 shadow-lg hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
    >
      Show me!
    </button>
  )
}

function WeatherInfo({
  cityName,
  weatherData,
  weatherConditions,
  setWeatherConditions,
  setForecastDay,
  getWeatherConditions,
  forecastDate,
  setForecastDate,
}) {
  function formatDate(inputDate) {
    const parsedDate = new Date(`20${inputDate.replace(/-/g, '/')}`)
    const options = { weekday: 'long', day: 'numeric', month: 'numeric' }
    const formatter = new Intl.DateTimeFormat('en-US', options)
    const parts = formatter.formatToParts(parsedDate)
    const formattedDate = `${parts[0].value} ${parts[4].value}.${parts[2].value}.`
    return formattedDate
  }

  function getWeatherIcon() {
    const weatherCode = weatherData.current.condition.code
    const isDay = weatherData.current.is_day
    const icon = weatherIcons[isDay][weatherCode]
    return `../src/assets/${icon}.svg`
  }

  function handleUnitsChange(clickedCondition) {
    setWeatherConditions((prevConditions) => {
      return prevConditions.map((item) => {
        if (
          item.condition === clickedCondition &&
          item.condition !== 'Humidity'
        ) {
          if (item.units_primary.display) {
            return {
              ...item,
              units_primary: {
                ...item.units_primary,
                display: false,
              },
              units_secondary: { ...item.units_secondary, display: true },
            }
          } else {
            return {
              ...item,
              units_primary: {
                ...item.units_primary,
                display: true,
              },
              units_secondary: { ...item.units_secondary, display: false },
            }
          }
        } else {
          return item
        }
      })
    })
  }

  console.log('weatherData:', weatherData)

  return (
    <div>
      {weatherData !== 'initial' ? (
        !weatherData ? (
          <div className="grid grid-cols-2 grid-rows-2 bg-white rounded-lg shadow-lg border-4 p-10 w-[50vw] h-[50vh] place-items-center">
            <h2 className="text-4xl font-bold col-start-1 col-end-2 row-start-1 row-end-2 text-center">
              Your city does not exist on this planet (yet).
            </h2>
            <h2 className="col-start-1 col-end-2 row-start-2 row-end-3 text-xl">
              Please chceck the city name and search again!
            </h2>
            <img
              className="row-start-1 row-end-3 col-span-1 max-h-full max-w-full object-contain rounded-lg w-auto h-auto block m-[0 auto]"
              src={notfound}
              alt="city does not exist"
            ></img>
          </div>
        ) : (
          <div className="grid grid-cols-2 grid-rows-[min-content_1fr_min-content-1fr] bg-white rounded-3xl shadow-xl border-4 border-[#FFAFCC] p-8 gap-4 relative w-[100%] h-auto overflow-hidden">
            <div className="flex flex-col col-start-1 col-end-3 row-start-1 row-end-2 justify-start items-center">
              <div>
                <i>Today, {weatherData.current.last_updated.slice(11)}</i>
              </div>
              <div className="text-3xl font-bold ">
                {cityName.toUpperCase()}
              </div>
              <div className="text-xl font-bold">
                {weatherData.current.condition.text}
              </div>
            </div>
            <div className="col-start-2 col-end-3 row-start-2 row-end-3 place-self-center">
              {weatherConditions.map((item) => {
                return (
                  <div
                    key={item.condition}
                    className="flex flex-row w-60 justify-between border-2 bg-[#A2D2FF] rounded-lg p-2 m-2 cursor-pointer hover:bg-[#BDE0FE] transition-all"
                    onClick={() => handleUnitsChange(item.condition)}
                  >
                    <div>{item.condition}:</div>
                    {item.units_primary.display ? (
                      <div>
                        {item.units_primary.value} {item.units_primary.symbol}
                      </div>
                    ) : (
                      <div>
                        {item.units_secondary.value}{' '}
                        {item.units_secondary.symbol}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="col-start-1 col-end-2 row-start-2 row-end-3 flex justify-center items-center">
              {weatherData && (
                <img src={getWeatherIcon()} className="w-72 h-72" />
              )}
            </div>

            <div className="rounded-md shadow-sm col-start-1 col-end-3 row-start-3 row-end-4 place-self-center">
              <button //today
                onClick={() => {
                  setForecastDay('current')
                  setForecastDate(0)
                  getWeatherConditions(weatherData)
                }}
                type="button"
                className={`relative -ml-px inline-flex items-center  px-3 py-4 text-md font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 rounded-tl-md rounded-bl-md focus:z-10 ${
                  forecastDate === 0 && 'bg-pink-300'
                }`}
              >
                Today
              </button>
              <button //tomorrow
                onClick={() => {
                  setForecastDay('forecast.forecastday[1].hour[12]')
                  setForecastDate(1)
                  getWeatherConditions(weatherData)
                }}
                type="button"
                className={`relative -ml-px inline-flex items-center px-3 py-4 text-md font-semibold text-gray-900 ring-1 ring-inset ring-gray-300  focus:z-10 ${
                  forecastDate === 1 && 'bg-pink-300'
                }`}
              >
                {formatDate(weatherData.forecast.forecastday[1].date)}
              </button>
              <button //overtomorrow
                onClick={() => {
                  setForecastDay('forecast.forecastday[2].hour[12]')
                  setForecastDate(2)
                  getWeatherConditions(weatherData)
                }}
                type="button"
                className={`relative -ml-px inline-flex items-center  px-3 py-4 text-md font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 rounded-tr-md rounded-br-md focus:z-10 ${
                  forecastDate === 2 && 'bg-pink-300'
                }`}
              >
                {formatDate(weatherData.forecast.forecastday[2].date)}
              </button>
            </div>

            <div className="col-start-1 col-end-3 row-start-4 row-end-5 flex justify-center items-center"></div>
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 grid-rows-2 bg-white rounded-lg shadow-lg border-4 p-10 w-[50vw] h-[50vh] place-items-center">
          <h2 className="text-4xl font-bold col-start-1 col-end-2 row-start-1 row-end-2 text-center">
            I don&apos;t know where to look...
          </h2>
          <h2 className="col-start-1 col-end-2 row-start-2 row-end-3 text-xl text-center">
            Choose a city to see the weather forecast
          </h2>
          <img
            className="row-start-1 row-end-3 col-span-1 max-h-full max-w-full object-contain rounded-lg w-auto h-auto block m-[0 auto]"
            src={questionmark}
            alt="enter city name"
          ></img>
        </div>
      )}
    </div>
  )
}