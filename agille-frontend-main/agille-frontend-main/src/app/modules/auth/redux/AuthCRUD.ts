import {certClient, middlewareClient} from '../../../services/HttpService'
import {UserModel} from '../models/UserModel'

export const GET_USER_BY_ACCESSTOKEN_URL = `/user/user-info`
export const LOGIN_URL = `/user/login`
export const LOGIN_URL_CERTIFICATE = `/user/login-icp`
export const VALIDATE_URL = `/user/validate`
export const VALIDATE_PASSWORD_TOKEN_URL = `/user/validate-set-password-token`
export const CHANGE_PASSWORD_URL = `/user/set-password`
export const RECOVER_PASSWORD_URL = `/user/recover-password`

// Server should return AuthModel
export function login(email: string, password: string) {
  return middlewareClient.post(LOGIN_URL, {
    username: email,
    password,
  })
}

export function loginCertificate() {
  return certClient.post(LOGIN_URL_CERTIFICATE, undefined)
}
// Server should return AuthModel
export function validate(email: string) {
  return middlewareClient.post(VALIDATE_URL, {
    email,
  })
}

// Server should return AuthModel
export function requestNewPassword(email: string) {
  return middlewareClient.post(RECOVER_PASSWORD_URL, {
    email,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function validatePasswordToken(token: string, email: string) {
  return middlewareClient
    .get(VALIDATE_PASSWORD_TOKEN_URL, {
      setPasswordToken: token,
      email,
    })
    .then(() => ({result: true}))
}

// Server should return object => { result: boolean } (Is Email in DB)
export function changePassword(email: string, token: string, password: string) {
  return middlewareClient.post(CHANGE_PASSWORD_URL, {
    setPasswordToken: token,
    password,
    email,
  })
}

export function getUserByToken(): Promise<{data: UserModel}> {
  // Authorization head should be fulfilled in interceptor.
  // Check common redux folder => setupAxios
  return middlewareClient.get(GET_USER_BY_ACCESSTOKEN_URL).then((response) => {
    const {data: user} = response
    return {
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        fullname: user.fullname,
        occupation: user.occupation,
        companyName: user.companyName,
        phone: user.phone,
        roles: user.roles,
        pic: user.pic,
        language: user.language,
        timeZone: user.timeZone,
        website: user.website,
        emailSettings: user.emailSettings,
        auth: user.auth,
        id: user.id,
        username: user.username,
        password: user.password,
        address: user.address,
        communication: user.communication,
        socialNetworks: user.socialNetworks,
      },
    }
  })
}
