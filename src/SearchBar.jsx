/* eslint-disable react/prop-types */
import { Combobox } from '@headlessui/react'
export default function SearchBar({
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
    <div className>
      <Combobox
        as="div"
        value={query.length > 0 ? selectedCity : ''}
        onChange={setSelectedCity}
        className="mr-2 md:mr-10"
      >
        <div className="">
          <Combobox.Input
            placeholder="What's the weather like in..."
            className="w-[100%] md:w-[50wv] placeholder-white rounded-xl border-0 text-3xl bg-white py-3 pl-3 text-black font-bold shadow-sm ring-4 ring-inset ring-[#FFAFCC] focus:ring-4 focus:ring-inset focus:ring-white"
            onChange={(event) => {
              setQuery(event.target.value)
              refreshSuggestions()
            }}
            displayValue={(selectedCity) => selectedCity}
            onBlur={() => refreshSuggestions()}
          />

          {filteredCities.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-[90%] md:w-[596px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                        ></span>
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
