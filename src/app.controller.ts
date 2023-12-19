import { Controller, Get, Post, Render, Body } from '@nestjs/common';
import * as mysql from 'mysql2';
import { AppService } from './app.service';
import { newcuponDto } from './newcuponDto';

const regexCode = /[A-Z]{4}-[0-9]{6}/

const conn = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'database',
}).promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index() {
    const [datas, cells] = await conn.execute('SELECT title, percentage, code FROM kuponok')
    return{title: 'Színház doga', kuponok : datas};
  }

  @Get('/newCoupon')
  @Render('newCoupon')
  newCoupon() {
    return {title: 'Színház doga'}
  }

  @Post('/newCoupon')
  async newCupon(@Body() cupon : newcuponDto) {
    const title = (document.getElementById('title') as HTMLInputElement).value
    const percentage = (document.getElementById('percentage') as HTMLInputElement).value
    const code = (document.getElementById('code') as HTMLInputElement).value
    let pre:number = 0
    if(title.trim().length < 1){
      alert('Hibás cím')
    }
    if(!isNaN(parseInt(percentage.trim()))){
       pre = parseInt(percentage)
    }
    else{
      alert('Hibás százalék')
    }
    if(!regexCode.test(code)){
      alert('Hibás code')
    }
    else{
      const [ data ] = await conn.execute(
        'INSERT INTO kuponok (title, precentage, code) VALUES (?, ?, ?)',
        [title, pre, code],
      )
      console.log(data)
      return {}
    }
  }
}
