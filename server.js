const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '자신의 MySQL 비밀번호 입력',
  database: 'lion_board',
})

db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err.message)
    console.error('DB_HOST, DB_USER, DB_PASSWORD, DB_NAME 값을 확인하세요.')
    process.exit(1)
  }

  console.log('MySQL 연결 성공')
  app.listen(3000, () => {
    console.log('서버 실행 중: http://localhost:3000')
  })
})

// 게시글 CRUD API
