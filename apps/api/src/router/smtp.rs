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
                pub smtp_port: String,
                pub smtp_username: String,
                pub smtp_password: String,

                pub helo_name: String,
                pub from_address: String,
                pub tls: String, //Can be NONE, STARTTLS, TLS
                pub smtp_tls: bool,

                pub auth_protocol: String, // Can be LOGIN, PLAIN, CRAM, NONE

                pub max_connections: i32,
                pub max_retries: i32,
                pub idle_timeout: i32,
                pub wait_timeout: i32,

                pub custom_headers: String,
            }
            t(|ctx, args: SMTPCreateArgs| async move {
                let SMTPCreateArgs {
                    smtp_host,
                    smtp_port,
                    smtp_username,
                    smtp_password,
                    smtp_tls,
                    from_address,
                    auth_protocol,
                    tls,
                    helo_name,
                    max_connections,
                    max_retries,
                    idle_timeout,
                    wait_timeout: wait_timout,
                    custom_headers,
                } = args;

                let smtp = ctx
                    .client
                    .smtp_settings()
                    .create(
                        smtp_host,
                        smtp_port.parse().unwrap(),
                        smtp_username,
                        smtp_password,
                        auth_protocol,
                        tls,
                        helo_name,
                        from_address,
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
        })
        .mutation("edit", |t| {
            t(|ctx, args: prisma::smtp_settings::Data| async move {
                let smtp = ctx
                    .client
                    .smtp_settings()
                    .update(
                        prisma::smtp_settings::id::equals(args.id),
                        vec![
                            prisma::smtp_settings::smtp_host::set(args.smtp_host),
                            prisma::smtp_settings::smtp_port::set(args.smtp_port),
                            prisma::smtp_settings::smtp_user::set(args.smtp_user),
                            prisma::smtp_settings::smtp_pass::set(args.smtp_pass),
                            prisma::smtp_settings::auth_protocol::set(args.auth_protocol),
                            prisma::smtp_settings::tls::set(args.tls),
                            prisma::smtp_settings::helo_host::set(args.helo_host),
                            prisma::smtp_settings::smtp_from::set(args.smtp_from),
                            prisma::smtp_settings::max_connections::set(args.max_connections),
                            prisma::smtp_settings::max_retries::set(args.max_retries),
                            prisma::smtp_settings::idle_timeout::set(args.idle_timeout),
                            prisma::smtp_settings::wait_timeout::set(args.wait_timeout),
                            prisma::smtp_settings::custom_headers::set(args.custom_headers),
                            prisma::smtp_settings::smtp_tls::set(args.smtp_tls),
                        ],
                    )
                    .exec()
                    .await?;

                Ok(smtp)
            })
        });

    router
}
