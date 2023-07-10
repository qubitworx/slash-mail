// This file was generated by [rspc](https://github.com/oscartbeaumont/rspc). Do not edit this file manually.

export type Procedures = {
    queries: 
        { key: "smtp.get", input: never, result: SmtpSettings[] } | 
        { key: "user.authenticated", input: never, result: boolean } | 
        { key: "version", input: never, result: string },
    mutations: 
        { key: "auth.login", input: AuthLoginArgs, result: string } | 
        { key: "smtp.create", input: SMTPCreateArgs, result: SmtpSettings } | 
        { key: "smtp.edit", input: SmtpSettings, result: SmtpSettings },
    subscriptions: never
};

export type AuthLoginArgs = { username: string; password: string }

export type SmtpSettings = { id: string; smtp_host: string; smtp_port: number; smtp_user: string; smtp_pass: string; auth_protocol: string; tls: string; helo_host: string; smtp_from: string; smtp_tls: boolean; max_connections: number; max_retries: number; idle_timeout: number; wait_timeout: number; custom_headers: string; created_at: string; updated_at: string }

export type SMTPCreateArgs = { smtp_host: string; smtp_port: string; smtp_username: string; smtp_password: string; helo_name: string; from_address: string; tls: string; smtp_tls: boolean; auth_protocol: string; max_connections: number; max_retries: number; idle_timeout: number; wait_timeout: number; custom_headers: string }
