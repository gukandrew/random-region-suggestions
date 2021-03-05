const express = require('express')
const app = express()
const port = 3000

const mustache = require('mustache')
const fetch = require('node-fetch')
const readFileSync = require('fs').readFileSync

const getRandomPositive = (max) => Math.floor(Math.random() * max)

app.get('/', async (req, res) => {
  const data = {
    'ua-vi': 'Вінниця',
    'ua-dp': 'місто Дніпро',
    'ua-dt': 'Донецьк',
    'ua-zt': 'Житомир',
    'ua-zp': 'Запоріжжя',
    'ua-if': 'Івано-Франківськ',
    'ua-kv': 'Київскій області',
    'ua-kc': 'місто Київ',
    'ua-kh': 'Кропивницький',
    'ua-lh': 'Луганськ',
    'ua-vo': 'Луцьк',
    'ua-lv': 'Львів',
    'ua-mk': 'Миколаїв',
    'ua-my': 'Одеса',
    'ua-pl': 'Полтава',
    'ua-rv': 'Рівне',
    'ua-sc': 'Севастополь',
    'ua-kr': 'Крим',
    'ua-sm': 'Суми',
    'ua-tp': 'Тернопіль',
    'ua-zk': 'Ужгород',
    'ua-kk': 'Харків',
    'ua-ks': 'Херсон',
    'ua-km': 'Хмельницьк',
    'ua-ck': 'Черкаси',
    'ua-cv': 'Чернівці',
    'ua-ch': 'Чернігів',
  }

  cases = await Promise.all(Object.keys(data).map(async (item, index) => {
    const phrase = encodeURI(`у ${data[item]}`)
    const req = await fetch(`http://suggestqueries.google.com/complete/search?client=firefox&q=${phrase}`)
    const body = await req.json()
    console.log(data[item], body[1])

    return {
      'hc-key': item,
      case: body[1][getRandomPositive(body[1].length)],
      value: body[1].length,
    }
  }))

  const tpl = readFileSync('./template.html').toString()

  res.send(mustache.render(tpl, { cases: decodeURI(JSON.stringify(cases)) }))
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
