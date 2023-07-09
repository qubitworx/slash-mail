use rspc::{Router, RouterBuilder};

use super::Context;

/// Responsible for handling the inbox (SMTP) related queries.
/// Can create, update, delete & list inboxes.
pub fn router() -> RouterBuilder<Context> {
    let router = Router::<Context>::new()
        .query("get", |t| {
            t(|ctx, _: ()| async move {
                let smtp_servers = ctx.client.smtp_settings().find_many(vec![]).exec().await?;

                Ok(smtp_servers)
            })
        })
        .mutation("create", |t| {
            #[derive(serde::Deserialize, rspc::Type)]
            pub struct SMTPCreateArgs {
                pub smtp_host: String,
                pub smtp_port: i32,
                pub smtp_username: String,
                pub smtp_password: String,

                pub smtp_tls: bool,
                pub smtp_from: String,

                pub auth_protocol: String, // Can be LOGIN, PLAIN, CRAM, NONE

                pub max_connections: i32,
                pub max_retries: i32,
                pub idle_timeout: i32,
                pub wait_timout: i32,

                pub custom_headers: String,
            }
            t(|ctx, args: SMTPCreateArgs| async move {
                let SMTPCreateArgs {
                    smtp_host,
                    smtp_port,
                    smtp_username,
                    smtp_password,
                    smtp_tls,
                    smtp_from,
                    auth_protocol,
                    max_connections,
                    max_retries,
                    idle_timeout,
                    wait_timout,
                    custom_headers,
                } = args;

                let smtp = ctx
                    .client
                    .smtp_settings()
                    .create(
                        smtp_host,
                        smtp_port,
                        smtp_username,
                        smtp_password,
                        smtp_from,
                        auth_protocol,
                        max_connections,
                        max_retries,
                        idle_timeout,
                        wait_timout,
                        custom_headers,
                        vec![prisma::smtp_settings::smtp_tls::set(smtp_tls)],
                    )
                    .exec()
                    .await?;

                Ok(smtp)
            })
        });

    router
}
