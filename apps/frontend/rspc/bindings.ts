// This file was generated by [rspc](https://github.com/oscartbeaumont/rspc). Do not edit this file manually.

export type Procedures = {
    queries: 
        { key: "user.authenticated", input: never, result: boolean } | 
        { key: "version", input: never, result: string },
    mutations: 
        { key: "auth.login", input: AuthLoginArgs, result: string },
    subscriptions: never
};

export type AuthLoginArgs = { username: string; password: string }
