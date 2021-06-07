import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'
// import MAX from 'max-exchange-api-node'

// 讓套件讀取 .env 檔案
// 讀取後可以用 process.env.變數使用
dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})
// bot.on('message', async event => {
//   if (event.message.type === 'text') {
//     try {
//       const response = await axios.get('https://datacenter.taichung.gov.tw/swagger/OpenData/f116d1db-56f7-4984-bad8-c82e383765c0')
//       const data = response.data.filter(data => {
//         return data['花種'] === event.message.text
//       })
//       let reply = ''
//       for (const d of data) {
//         reply += `地點:${d['地點']} \n地址:${d['地址']} \n觀賞時期:${d['觀賞時期']}＼n\n`
//       }
//       event.reply(reply)
//     } catch (error) {
//       event.reply('發生錯誤')
//     }
//   }
// })

bot.on('message', async event => {
  if (event.message.type === 'text') {
    if (event.message.text === 'HOW TO USE') {
      event.reply(`查詢貨幣價格\n請回傳\n"貨幣名稱"+"顯示貨幣單位"\nex: BTCTWD
      -------------------------------
    貨幣名稱:請點選下方\n"ALL MARKET" 查詢\n貨幣單位:TWD、SDT`)
    } else if (event.message.text === 'ALL MARKET') {
      event.reply('MAX\nBTC\nETH\nLTC\nMITH\nBCH\nUSDT\nXRP\nBCNT\nUSDC\nLINK')
    }
    try {
      const response = await axios.get('https://max-api.maicoin.com/api/v2/summary')
      // const data = response.data
      let reply = ''
      // Object.keys(response.data.tickers).length  資料長度
      for (let i = 0; i < Object.keys(response.data.tickers).length; i++) {
        // response.data.tickers[Object.keys(response.data.tickers)[i]]  第i筆資料
        // Object.keys(response.data.tickers)[i]  第 i 筆索引名稱
        if (Object.keys(response.data.tickers)[i] === event.message.text.toLowerCase()) {
          reply +=
            '限時買價:' +
            response.data.tickers[Object.keys(response.data.tickers)[i]].buy +
            '\n' +
            '限時賣價:' +
            response.data.tickers[Object.keys(response.data.tickers)[i]].sell +
            '\n' +
            '今日最低:' +
            response.data.tickers[Object.keys(response.data.tickers)[i]].low +
            '\n' +
            '今日最高::' +
            response.data.tickers[Object.keys(response.data.tickers)[i]].high +
            '\n' +
            '最新價格:' +
            response.data.tickers[Object.keys(response.data.tickers)[i]].last
          break
        }
      }
      event.reply(reply)
      // for (const d of data) {
      // reply += `限時買入:${d.buy} \n限時賣出:${d.sell} \n今日最低:${d.low} \n今日最高:${d.high}＼n\n`
      //   event.reply(reply)
      // }
    } catch (error) {
      event.reply('請輸入正確的查詢方式')
      console.log(error)
    }
  }
})
