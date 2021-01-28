var xtend = require('xtend')
var trumpet = require('trumpet')
var { BufferListStream } = require('bl')
var { through, duplex, pipe } = require('mississippi')

var types = [
  'application/rss+xml',
  'application/rss',
  'text/rss+xml',
  'text/rss',
  'application/atom+xml',
  'application/atom',
  'text/atom+xml',
  'text/atom',
  'application/rdf+xml',
  'application/rdf',
  'text/rdf+xml',
  'text/rdf',
  'application/feed+json',
  'application/json'
]

var REL = 'alternate'

module.exports = find

function find (f) {
  var tr = trumpet()
  var src = through.obj((result, _, done) => {
    if (typeof f !== 'function') return done(null, result)
    try {
      done(null, f(result))
    } catch (error) {
      done(error)
    }
  })
  var i = 0
  var mid = through.obj((link, _, done) => {
    if (link.href == null) return done()
    if (types.indexOf(link.type) !== -1) return done(null, link)
    if (link.rel === REL) return done(null, link)
    done()
  })
  mid.setMaxListeners(0)
  mid.on('pipe', () => (i += 1))
  mid.on('unpipe', () => {
    if ((i -= 1) === 0 && src._readableState.ended) mid.end()
  })
  tr.once('end', () => {
    if (i === 0 && !mid._readableState.ended) mid.end()
  })

  pipe(
    mid,
    src,
    error => {
      if (error != null) src.emit('error', error)
    }
  )

  tr.selectAll('link', link => {
    var data = {}
    var src = through.obj()
    link.getAttribute('href', href => (data.href = href))
    link.getAttribute('rel', rel => rel && (data.rel = rel))
    link.getAttribute('type', type => type && (data.type = type))
    link.getAttribute('title', title => title && (data.title = title))
    link.createReadStream({ outer: true })
      .pipe(BufferListStream((error, buf) => {
        if (error != null) return src.emit('error', error)
        src.end(xtend(data, { _: String(buf) }))
      }))

    src.pipe(mid, { end: false })
  })

  return duplex.obj(tr, src)
}
