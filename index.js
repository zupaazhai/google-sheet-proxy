require('dotenv').config()
const express = require('express')
const got = require('got')
const app = express()
const port = 3000

app.get('/', async (req, res) => {

  const queries = req.query

  if (!queries.sheet_id || !queries.sheet_name) {
    return res.status(422)
      .json({
        success: false,
        message: 'id or name is empty'
      })
  }

  const GOOGLE_AUTH_KEY = process.env.GOOGLE_AUTH_KEY
  const SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/${queries.sheet_id}/values/${encodeURI(queries.sheet_name)}?key=${GOOGLE_AUTH_KEY}`

  res.header('Cache-Control', 's-maxage=86400')

  try {
    const result = await got.get(SHEET_URL).json()

    res.json({
      success: true,
      result: result
    })
  } catch {

    res.status(500)
    .json({
      message: 'get sheet fail',
      success: false
    })
  }
})

app.listen(port, () => {
  console.log(`App started at port ${port}`)
})
