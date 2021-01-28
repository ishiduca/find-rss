var test = require('tape')
var fs = require('fs')
var path = require('path')
var { pipe, concat } = require('mississippi')
var find = require('../find-rss')

test('readableStream.pipe(find()).pipe(writableStream)', t => {
  var html = path.join(__dirname, 'sample.html')
  var rss = {
    href: 'https://www.jsonfeed.org/feed.xml',
    type: 'application/rss+xml',
    rel: 'alternate',
    title: 'JSON Feed',
    _: '<link href="https://www.jsonfeed.org/feed.xml" rel="alternate" type="application/rss+xml" title="JSON Feed" />'
  }
  var podcast = {
    href: 'https://www.jsonfeed.org/podcast.xml',
    type: 'application/rss+xml',
    rel: 'alternate',
    title: 'Podcast',
    _: '<link href="https://www.jsonfeed.org/podcast.xml" rel="alternate" type="application/rss+xml" title="Podcast" />'
  }
  var jsonFeed = {
    href: 'https://www.jsonfeed.org/feed.json',
    type: 'application/json',
    rel: 'alternate',
    title: 'JSON Feed',
    _: '<link rel="alternate" type="application/json" title="JSON Feed" href="https://www.jsonfeed.org/feed.json" />'
  }

  pipe(
    fs.createReadStream(html),
    find(),
    concat(result => {
      t.deepEqual(result[0], rss, result[0].title)
      t.deepEqual(result[1], podcast, result[1].title)
      t.deepEqual(result[2], jsonFeed, result[2].title)
    }),
    error => {
      t.error(error, 'no error')
      t.end()
    }
  )
})
