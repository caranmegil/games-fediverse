/*

main.ts - execute functions for outputting to the Fediverse
Copyright (C) 2020  William R. Moore <caranmegil@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/

import generator, { Response, OAuth, Entity/*, WebSocketInterface*/ } from 'megalodon'
import Koa from 'koa'
import Router from 'koa-router'
import request from 'superagent'
import moment from 'moment'

const SCOPES: Array<string> = ['read', 'write', 'follow']
const BASE_URL: string = `https://${process.env.HOST}` || 'https://chilli.social'

let accessToken: string | null
// let refreshToken: string | null

const app = new Koa()
const router = new Router()
const client = generator('pleroma', BASE_URL)

router.get("/", async (ctx: any, _ /*next: any*/) => {
let code = ctx.request.query.code
let clientId = ctx.request.query.clientId
let secret = ctx.request.query.secret
client
  .registerApp('games', {
    scopes: SCOPES
  })
  .then(appData => {
    console.log('Authorization URL is generated.')
    console.log(appData.url)
    console.log()
    return client.fetchAccessToken(clientId, secret, code)
  })
  .then((tokenData: OAuth.TokenData) => {
    accessToken = tokenData.accessToken
    let next_available = moment()

    const activeClient = generator('pleroma', `https://${process.env.HOST}`, accessToken)
    setInterval( () => {
      activeClient.getPublicTimeline().then( (resp: Response<Array<Entity.Status>>) => {
        resp.data.forEach( (value: any) => {

        })
      })
    }, 1000)
  })
  .catch((err: Error) => console.error(err))
})

app.use(router.routes())
   .use(router.allowedMethods())

app.listen(process.env.PORT || 4000, () => {
  console.log('Koa started')
}) 
