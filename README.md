# find-rss

### install

```sh
$ npm i -g https://github.com/ishiduca/find-rss.git
```

## usage

```sh
$ curl -sS https://feedbin.com/blog | find-rss | JSONStream
```

result
```json
[{
  "href": "/blog/atom.xml",
  "rel": "alternate",
  "type": "application/atom+xml",
  "title": "Feedbin Blog",
  "_": "<link rel=\"alternate\" href=\"/blog/atom.xml\" type=\"application/atom+xml\" title=\"Feedbin Blog\">"
}]
```
