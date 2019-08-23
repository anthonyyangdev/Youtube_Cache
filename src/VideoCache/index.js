const updateVideos = require('../Youtube/GetPopularVideos')
const VideoGroup = require('./VideoGroup')
const fs = require('fs')

/**
 * Return an object mapping video id to the information of that video.
 * @param {string} country 
 */
function getVideosAt(db, country) {
  return db[country] ||
    (function () {
      throw new Error(`Country ${country} does not exist in the database.`)
    })()
}

/**
 * @param {*} host An object of {list, set}
 * @param {{}[]} outside An array of objects {list, set}
 */
function selectVideos(host, outside) {
  if (host.index !== 50) {
    throw new Error('The videos from the host country needs to contain 50 videos.')
  }

  let result = new VideoGroup()
  for (let c of outside) {
    const filtered = c.list.filter(v => v.status)
    if (filtered.length === 0) throw new Error(`No videos are available at ${c}.`)
    let found = false
    for (let vids of filtered) {
      if (host.set[vids] || result.includes(vids)) {
        continue
      } else {
        result.add(vids)
        found = true
        break
      }
    }

    if (!found) {
      let index = Math.trunc((filtered.length) * Math.random())
      var item = filtered[index]
      while (result.includes(item)) {
        index = Math.trunc((filtered.length) * Math.random())
        item = filtered[index]
      }
      result.add(item)
    }
  }

  if (result.size() !== 6) {
    throw new Error(`The size of the array of selected videos is not 6.\n 
      Actual size: ${result.size()}`)
  }
  return result.getList()
}

/**
 * @param {string} host The country code of the participant's country.
 * @param {string[]} countries Array of country codes. Requires: countries.length === 6.
 */
function getAllVideosForCountries(host, countries) {
  if (countries.length !== 6) {
    throw new Error(`The countries array must contain 6 codes. 
      The request contains ${countries.length} codes.`)
  }
  const content = fs.readFileSync(__dirname + '/../Database/db.json')
  const db = JSON.parse(content)
  const hostVideos = getVideosAt(db, host)
  const outsideVideos = countries.map(x => getVideosAt(db, x))
  return { hostVideos, outsideVideos }
}

/**
 * Refresh twice a day or if more than 12 hours have elapsed.
 */
setInterval(() => {
  console.log('Checking clock.')
  const time = new Date().getTime();
  const content = fs.readFileSync(__dirname + '/../Database/time.json')
  const prev = JSON.parse(content).time
  const diff = time - prev
  if (diff >= 43200000) {
    updateVideos()
  }
}, 1000)

function status() {
  console.log(db, Object.keys(db).length)
}

/**
* @param {string} host The country code of the participant's country.
* @param {string[]} countries Array of country codes. Requires: countries.length === 6.
*/
function getVideos(host, countries) {
  const { hostVideos, outsideVideos } = getAllVideosForCountries(host, countries)
  const arrangedVideos = selectVideos(hostVideos, outsideVideos)
  return arrangedVideos
}

module.exports = { status, getVideos }


