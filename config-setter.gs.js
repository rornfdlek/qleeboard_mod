#!/usr/bin/env node

const inquirer = require('inquirer')
const fs = require('fs')

const questions = [
  {
    type: 'input',
    name: 'PRJ_NAME',
    default: 'QLeeboard',
    message: 'What\'s your project name?'
  },
  {
    type: 'input',
    name: 'DB_TYPE',
    default: 'mariadb',
    message: 'What\'s your DB TYPE?'
  },
  {
    type: 'input',
    name: 'DB_USERNAME',
    default: 'root',
    message: 'What\'s your DB username?'
  },
  {
    type: 'input',
    name: 'DB_PASSWORD',
    message: 'What\'s your DB password?'
  },
  {
    type: 'input',
    name: 'DB',
    message: 'What\'s your DataBase?'
  },
  {
    type: 'input',
    name: 'DB_HOST',
    message: 'What\'s your DB host?'
  },
  {
    type: 'input',
    name: 'GMAIL_ID',
    message: 'What\'s your GMAIL ID?'
  },
  {
    type: 'input',
    name: 'GMAIL_PASSWORD',
    message: 'What\'s your GMAIL Password?'
  },
  {
    type: 'input',
    name: 'JWT_SECRET',
    default: 'JwTSeCrEtQlEEbOArd',
    message: 'What\'s your JWT_SECRET?'
  },
  {
    type: 'input',
    name: 'PRIMARY_COLOR',
    default: '#ff4343',
    message: 'What\'s your Primary Color?'
  }
]

const inputData = {
  PRJ_NAME: '',
  production: {
    username: '',
    password: '',
    database: '',
    host: '',
    dialect: ''
  },
  JWT_SECRET: '',
  GMAIL_ID: '',
  GMAIL_PASSWORD: '',
  PRIMARY_COLOR: ''
}

const func = async () => {
  const answers = await inquirer.prompt(questions)
  inputData.production.username = answers['DB_USERNAME']
  inputData.production.password = answers['DB_PASSWORD']
  inputData.production.database = answers['DB']
  inputData.production.host = answers['DB_HOST']
  inputData.production.dialect = answers['DB_TYPE']
  inputData.JWTSECRET = answers['JWT_SECRET']
  inputData.GMAIL_ID = answers['GMAIL_ID']
  inputData.GMAIL_PASSWORD = answers['GMAIL_PASSWORD']
  inputData.PRJ_NAME = answers['PRJ_NAME']
  inputData.PRIMARY_COLOR = answers['PRIMARY_COLOR']

  console.log(inputData)

  fs.writeFile('./config/config.json', JSON.stringify(inputData), function (err) {
    if (err) {
      return console.log(err)
    }
    console.log('The file was saved!')

    let execSync = require('child_process').execSync
    let cmd = 'npm install'

    let options = {
      encoding: 'utf8'
    }

    console.log(execSync(cmd, options))
  })
}

func()
