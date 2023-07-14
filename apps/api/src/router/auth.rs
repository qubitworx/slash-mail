use rspc::{Router, RouterBuilder};
use tower_cookies::{cookie::time::OffsetDateTime, Cookie};

use crate::prisma;

use super::Context;

pub fn router() -> RouterBuilder<Context> {
    let router = Router::new().mutation("login", |t| {
        #[derive(serde::Deserialize, serde::Serialize, rspc::Type)]
        pub struct AuthLoginArgs {
            pub username: String,
            pub password: String,
        }

        t(|ctx: Context, args: AuthLoginArgs| async move {
            if args.username != ctx.config.username || args.password != ctx.config.password {
                Err(rspc::Error::new(
                    rspc::ErrorCode::Forbidden,
                    "Invalid username or password".to_owned(),
                ))
            } else {
                // first we need to create a secret key
                let c = cuid::cuid2().to_string();
                let sk = format!("sk_{}", c);
                let time = chrono::Utc::now();

                // add 2 hours to the current time
                let expires_at = time + chrono::Duration::hours(2);

                // convert expires_at to a fixed offset
                let expires_at_fo =
                    expires_at.with_timezone(&chrono::FixedOffset::east_opt(0).unwrap());

                ctx.client
                    .secret_keys()
                    .create(vec![
                        prisma::secret_keys::expires_at::set(Some(expires_at_fo)),
                        prisma::secret_keys::id::set(sk.clone()),
                    ])
                    .exec()
                    .await?;

                let cookie = Cookie::build("sk", sk.clone())
                    .http_only(true)
                    .secure(true)
                    // expire after 2 hours.
                    .expires(OffsetDateTime::from_unix_timestamp(expires_at.timestamp()).unwrap())
                    .finish();

                ctx.cookies.add(cookie);

                return Ok(sk);
            }
        })
    });
    router
}
