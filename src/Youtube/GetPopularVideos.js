const countries = require('../Countries/index')
const VideoGroup = require('../VideoCache/VideoGroup')

function updatePopularVideosAt(mapping, countryCode) {
  // Get videos from Youtube. Each video has status, id, and player
  // Include only the player, status, id, and country as the object

  const { google } = require('googleapis')
  const youtube = google.youtube({
    version: 'v3',
    auth: 'AIzaSyDfeWatkoOPYwEz-WEdiylrBnpWwFXycfM'
  })
  const params = {
    "part": "player, id, status, contentDetails",
    "chart": "mostPopular",
    "maxResults": 50,
    "regionCode": countryCode
  }

  const testing = false
  if (testing) {
    mapping[countryCode] = 12
    return
  } else {
    youtube.videos.list(params, (err, res) => {
      if (err) {
        console.log(err)
        throw err
      }
      const items = new VideoGroup()
      for (let x of res.data.items) {
        const id = x.id
        const player = x.player.embedHtml
        const isEmbeddable = x.status.embeddable
        const isPublic = x.status.privacyStatus === "public"
        const isProcessed = x.status.uploadStatus === "processed"
        const restrictions = x.contentDetails.regionRestriction
        let isNotRestricted = true
        if (restrictions !== undefined) {
          const allowed = restrictions.allowed
          const blocked = restrictions.blocked
          if (allowed !== undefined)
            isNotRestricted = allowed.includes(countryCode)
          if (blocked !== undefined)
            isNotRestricted = !blocked.includes(countryCode)
        }
        const status = isEmbeddable && isPublic && isProcessed && isNotRestricted
        items.add({ player, status, id, origin: countryCode })
      };
      mapping[countryCode] = items
    })
  }
}

/**
 * Updates the popular videos in the database.
 * @param mapping 
 */
function updateAllVideos(mapping) {
  for (let c in countries) {
    updatePopularVideosAt(mapping, c)
  }
}

module.exports = updateAllVideos